import { cn } from "@/lib/utils";

interface Props {
  cover: "screen" | "container";
  color?: "dark" | "light";
  disablePointerEvents?: boolean;
  onClick?: () => void;
}

export function Overlay({
  cover,
  color = "dark",
  disablePointerEvents = true,
  onClick,
}: Props) {
  return (
    <div
      className={cn("inset-0 z-10 h-screen", {
        "pointer-events-none": disablePointerEvents,
        "bg-overlay": color === "dark",
        "bg-white/50": color === "light",
        fixed: cover === "screen",
        "absolute h-full": cover === "container",
      })}
      onClick={onClick}
    />
  );
}
