import { useState, useCallback, useRef, useEffect } from "react";

const TTS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-tts`;

export interface TTSSettings {
  voiceId: string;
  speakingRate: number;
  autoSpeak: boolean;
  useBrowserFallback: boolean;
}

const DEFAULT_SETTINGS: TTSSettings = {
  voiceId: "EXAVITQu4vr4xnSDxMaL", // Sarah
  speakingRate: 1.0,
  autoSpeak: true,
  useBrowserFallback: false,
};

const STORAGE_KEY = "floodguard-tts-settings";

export function useTTS() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<TTSSettings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });
  const [useFallbackMode, setUseFallbackMode] = useState(settings.useBrowserFallback);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Persist settings to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  // Browser SpeechSynthesis fallback
  const speakWithBrowser = useCallback((text: string) => {
    if (!('speechSynthesis' in window)) {
      console.error("Browser does not support SpeechSynthesis");
      return false;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = settings.speakingRate;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Try to get a good voice
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v => v.lang.startsWith('en') && v.name.includes('Female')) 
      || voices.find(v => v.lang.startsWith('en'))
      || voices[0];
    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsLoading(false);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      utteranceRef.current = null;
    };

    utterance.onerror = (e) => {
      if (e.error !== 'canceled') {
        console.error("SpeechSynthesis error:", e.error);
      }
      setIsSpeaking(false);
      setIsLoading(false);
      utteranceRef.current = null;
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    return true;
  }, [settings.speakingRate]);

  const speak = useCallback(async (text: string) => {
    if (!text || text.trim().length === 0) return;

    // Stop any current audio/speech
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (utteranceRef.current) {
      window.speechSynthesis.cancel();
      utteranceRef.current = null;
    }

    // Cancel any pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // If fallback mode is active, use browser speech directly
    if (useFallbackMode) {
      setIsLoading(true);
      speakWithBrowser(text);
      return;
    }

    abortControllerRef.current = new AbortController();
    setIsLoading(true);

    try {
      const response = await fetch(TTS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ text, voiceId: settings.voiceId }),
        signal: abortControllerRef.current.signal,
      });

      // Check for auth/permission errors - fallback to browser
      if (response.status === 401 || response.status === 403) {
        console.warn("ElevenLabs auth failed, falling back to browser SpeechSynthesis");
        setUseFallbackMode(true);
        speakWithBrowser(text);
        return;
      }

      if (!response.ok) {
        console.error("TTS request failed:", response.status);
        // Fallback for any error
        console.warn("Falling back to browser SpeechSynthesis");
        speakWithBrowser(text);
        return;
      }

      const audioBlob = await response.blob();
      
      // Check if we got JSON error instead of audio
      if (audioBlob.type.includes('application/json')) {
        console.warn("Got JSON error response, falling back to browser SpeechSynthesis");
        setUseFallbackMode(true);
        speakWithBrowser(text);
        return;
      }

      const audioUrl = URL.createObjectURL(audioBlob);
      
      const audio = new Audio(audioUrl);
      audio.playbackRate = settings.speakingRate;
      audioRef.current = audio;

      audio.onplay = () => {
        setIsSpeaking(true);
        setIsLoading(false);
      };

      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;
      };

      audio.onerror = () => {
        console.error("Audio playback error, falling back to browser");
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;
        speakWithBrowser(text);
      };

      await audio.play();
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error("TTS error:", error);
        // Fallback on any error
        speakWithBrowser(text);
      } else {
        setIsLoading(false);
        setIsSpeaking(false);
      }
    }
  }, [settings.voiceId, settings.speakingRate, useFallbackMode, speakWithBrowser]);

  const stop = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (utteranceRef.current) {
      window.speechSynthesis.cancel();
      utteranceRef.current = null;
    }
    setIsSpeaking(false);
    setIsLoading(false);
  }, []);

  const updateSettings = useCallback((newSettings: Partial<TTSSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    if (newSettings.useBrowserFallback !== undefined) {
      setUseFallbackMode(newSettings.useBrowserFallback);
    }
  }, []);

  const resetToElevenLabs = useCallback(() => {
    setUseFallbackMode(false);
    setSettings(prev => ({ ...prev, useBrowserFallback: false }));
  }, []);

  return {
    speak,
    stop,
    isSpeaking,
    isLoading,
    settings,
    updateSettings,
    useFallbackMode,
    resetToElevenLabs,
  };
}

// Available ElevenLabs voices
export const ELEVENLABS_VOICES = [
  { id: "EXAVITQu4vr4xnSDxMaL", name: "Sarah", description: "Soft, young female" },
  { id: "JBFqnCBsd6RMkjVDRZzb", name: "George", description: "Warm British male" },
  { id: "XrExE9yKIg1WjnnlVkGX", name: "Matilda", description: "Warm, friendly female" },
  { id: "pFZP5JQG7iQjIQuC4Bku", name: "Lily", description: "Warm British female" },
  { id: "onwK4e9ZLuTAKqWW03F9", name: "Daniel", description: "Deep, authoritative male" },
  { id: "cgSgspJ2msm6clMCkdW9", name: "Jessica", description: "Expressive American female" },
  { id: "iP95p4xoKVk53GoZ742B", name: "Chris", description: "Casual American male" },
  { id: "nPczCjzI2devNBz1zQrb", name: "Brian", description: "Deep American male" },
] as const;
