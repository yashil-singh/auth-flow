import { Switch } from "../ui/switch";
import { Moon, Sun } from "lucide-react";
import useThemeStore, {
  selectSetTheme,
  selectTheme,
} from "@/lib/stores/themeStore";
import { flushSync } from "react-dom";
import { useRef } from "react";

const ThemeToggler = () => {
  const theme = useThemeStore(selectTheme);
  const setTheme = useThemeStore(selectSetTheme);

  const isLightMode = theme === "light";

  const switchRef = useRef<HTMLButtonElement>(null);

  const onToggle = async (isLight: boolean) => {
    if (
      !switchRef.current ||
      !document.startViewTransition ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setTheme(isLight ? "light" : "dark");
      return;
    }

    await document.startViewTransition(() => {
      // to force sync updates as DOM state needs to reflect the new theme before the browser takes a snapshot for the transition
      flushSync(() => {
        setTheme(isLight ? "light" : "dark");
      });
    }).ready;

    const { top, left, right, bottom, width, height } =
      switchRef.current.getBoundingClientRect(); // get position from where the circle should expand

    const maxRadius = Math.hypot(Math.max(left, right), Math.max(top, bottom)); // to calculate the radius of the circle to the end of the screen

    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${left + width / 2}px ${top + height / 2}px)`,
          `circle(${maxRadius}px at ${left + width / 2}px ${
            top + height / 2
          }px)`,
        ],
      },
      {
        duration: 800,
        easing: "ease-in-out",
        pseudoElement: "::view-transition-new(root)",
      }
    );
  };

  return (
    <div className="flex items-center gap-2">
      <Switch
        ref={switchRef}
        checked={isLightMode}
        onCheckedChange={onToggle}
        thumb={isLightMode ? <Sun /> : <Moon />}
        size="lg"
      />
    </div>
  );
};

export default ThemeToggler;
