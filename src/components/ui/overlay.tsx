import { cn } from "@/lib/utils";

interface Props {
  cover: "screen" | "container";
  color?: "dark" | "light";
  onClick?: () => void;
}

export function Overlay({ cover, color = "dark", onClick }: Props) {
  return (
    <div
      className={cn("pointer-events-none inset-0 z-10 h-screen", {
        "bg-overlay": color === "dark",
        "bg-white/50": color === "light",
        fixed: cover === "screen",
        "absolute h-full": cover === "container",
      })}
      onClick={onClick}
    />
  );
}
