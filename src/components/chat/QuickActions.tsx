import { AlertTriangle, Package, Route, Heart, Home, Droplets } from "lucide-react";

interface QuickActionsProps {
  onSelect: (message: string) => void;
  disabled?: boolean;
}

const quickActions = [
  {
    icon: AlertTriangle,
    label: "Flood Warning Signs",
    message: "What are the warning signs of an approaching flood?",
  },
  {
    icon: Route,
    label: "Evacuation Steps",
    message: "What should I do if I need to evacuate due to flooding?",
  },
  {
    icon: Package,
    label: "Emergency Kit",
    message: "What should I include in a flood emergency kit?",
  },
  {
    icon: Droplets,
    label: "During Flood",
    message: "What safety precautions should I take during a flood?",
  },
  {
    icon: Home,
    label: "After Flood",
    message: "What should I do after a flood to stay safe?",
  },
  {
    icon: Heart,
    label: "First Aid",
    message: "What basic first aid should I know for flood emergencies?",
  },
];

export function QuickActions({ onSelect, disabled }: QuickActionsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {quickActions.map((action) => (
        <button
          key={action.label}
          onClick={() => onSelect(action.message)}
          disabled={disabled}
          className="flex items-center gap-2 p-3 rounded-xl bg-card border border-border hover:border-primary/30 hover:bg-accent/50 transition-all duration-200 text-left group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
            <action.icon className="w-4 h-4 text-primary" />
          </div>
          <span className="text-xs font-medium text-foreground">{action.label}</span>
        </button>
      ))}
    </div>
  );
}
