import { cn } from "@/lib/utils";

interface Props {
  cover: "screen" | "container";
  color?: "dark" | "light";
  className?: string;
  onClick?: () => void;
}

export function Overlay({ cover, color = "dark", onClick, className }: Props) {
  return (
    <div
      className={cn(
        "inset-0 z-10 h-screen bg-overlay",
        {
          "bg-overlay": color === "dark",
          "bg-white/50": color === "light",
          fixed: cover === "screen",
          "absolute h-full": cover === "container",
        },
        className,
      )}
      onClick={onClick}
    />
  );
}
