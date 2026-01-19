import { Settings, Volume2, RefreshCw, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TTSSettings, ELEVENLABS_VOICES } from "@/hooks/useTTS";
import { Badge } from "@/components/ui/badge";

interface VoiceSettingsProps {
  settings: TTSSettings;
  onSettingsChange: (settings: Partial<TTSSettings>) => void;
  useFallbackMode: boolean;
  onResetToElevenLabs: () => void;
}

export function VoiceSettings({
  settings,
  onSettingsChange,
  useFallbackMode,
  onResetToElevenLabs,
}: VoiceSettingsProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Settings className="w-4 h-4" />
          <span className="hidden sm:inline">Voice Settings</span>
          {useFallbackMode && (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
              Demo
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium flex items-center gap-2">
              <Volume2 className="w-4 h-4" />
              Voice Settings
            </h4>
            {useFallbackMode && (
              <Badge variant="outline" className="text-xs text-amber-600 border-amber-300">
                Browser Mode
              </Badge>
            )}
          </div>

          {/* Fallback Mode Notice */}
          {useFallbackMode && (
            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
              <p className="text-xs text-amber-700 dark:text-amber-300 mb-2">
                Using browser speech synthesis (ElevenLabs unavailable)
              </p>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs h-7"
                onClick={onResetToElevenLabs}
              >
                <RefreshCw className="w-3 h-3 mr-1.5" />
                Retry ElevenLabs
              </Button>
            </div>
          )}

          {/* Voice Selection (only for ElevenLabs) */}
          {!useFallbackMode && (
            <div className="space-y-2">
              <Label className="text-sm">Voice</Label>
              <Select
                value={settings.voiceId}
                onValueChange={(value) => onSettingsChange({ voiceId: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select voice" />
                </SelectTrigger>
                <SelectContent>
                  {ELEVENLABS_VOICES.map((voice) => (
                    <SelectItem key={voice.id} value={voice.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{voice.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {voice.description}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Speaking Rate */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Speaking Rate</Label>
              <span className="text-xs text-muted-foreground">
                {settings.speakingRate.toFixed(1)}x
              </span>
            </div>
            <Slider
              value={[settings.speakingRate]}
              onValueChange={([value]) => onSettingsChange({ speakingRate: value })}
              min={0.5}
              max={2.0}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>Slower</span>
              <span>Normal</span>
              <span>Faster</span>
            </div>
          </div>

          {/* Auto-speak Toggle */}
          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label className="text-sm">Auto-speak responses</Label>
              <p className="text-xs text-muted-foreground">
                Automatically read AI responses aloud
              </p>
            </div>
            <Switch
              checked={settings.autoSpeak}
              onCheckedChange={(checked) => onSettingsChange({ autoSpeak: checked })}
            />
          </div>

          {/* Force Browser Mode */}
          <div className="flex items-center justify-between py-2 border-t pt-4">
            <div className="space-y-0.5">
              <Label className="text-sm flex items-center gap-1.5">
                <Mic className="w-3.5 h-3.5" />
                Use browser voice
              </Label>
              <p className="text-xs text-muted-foreground">
                Skip ElevenLabs, use device voice
              </p>
            </div>
            <Switch
              checked={settings.useBrowserFallback}
              onCheckedChange={(checked) => onSettingsChange({ useBrowserFallback: checked })}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
