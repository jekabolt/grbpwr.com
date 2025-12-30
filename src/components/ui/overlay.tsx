import { cn } from "@/lib/utils";

interface Props {
  cover: "screen" | "container";
  color?: "dark" | "light" | "highlight";
  disablePointerEvents?: boolean;
  onClick?: () => void;
  trigger?: "hover" | "held" | "none";
}

export function Overlay({
  cover,
  color = "dark",
  disablePointerEvents = true,
  trigger = "none",
  onClick,
}: Props) {
  return (
    <div
      className={cn("inset-0 z-20 h-screen", {
        "pointer-events-none z-10": disablePointerEvents,
        "bg-overlay": color === "dark",
        "bg-white/50": color === "light",
        "bg-highlightColor mix-blend-screen": color === "highlight",
        fixed: cover === "screen",
        "absolute h-full": cover === "container",
        "opacity-0 transition-opacity duration-[400ms] ease-out group-hover:opacity-60":
          trigger === "hover",
        "opacity-0 transition-opacity duration-[400ms] ease-out group-data-[held=true]:opacity-60":
          trigger === "held",
      })}
      onClick={onClick}
      aria-hidden="true"
    />
  );
}
