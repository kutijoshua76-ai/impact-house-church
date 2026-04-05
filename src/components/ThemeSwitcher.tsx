import { Moon, Sun, Monitor, Palette } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  const themes = [
    { name: "dark", icon: Moon, label: "Midnight" },
    { name: "light", icon: Sun, label: "Daylight" },
    { name: "solarized", icon: Monitor, label: "Solarized" },
    { name: "vivid", icon: Palette, label: "Vivid" },
  ] as const;

  return (
    <div className="flex bg-midnight/80 backdrop-blur-md border border-foreground/10 rounded-full p-1 gap-1">
      {themes.map(({ name, icon: Icon, label }) => (
        <button
          key={name}
          onClick={() => setTheme(name)}
          className={`
            relative p-2 rounded-full transition-all duration-300 group
            ${theme === name ? "bg-rose-gold text-midnight" : "text-foreground/60 hover:text-foreground hover:bg-foreground/10"}
          `}
          aria-label={`Switch to ${label} theme`}
          title={`Switch to ${label} theme`}
        >
          <Icon size={16} className="relative z-10" />
          
          {/* Tooltip */}
          <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-midnight border border-foreground/10 text-foreground text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
            {label}
          </span>
        </button>
      ))}
    </div>
  );
}
