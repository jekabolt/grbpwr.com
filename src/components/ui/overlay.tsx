import { cn } from "@/lib/utils";

interface Props {
  cover: "screen" | "container";
  color?: "dark" | "light" | "highlight";
  disablePointerEvents?: boolean;
  onClick?: () => void;
  trigger?: "hover" | "held" | "active" | "none";
  active?: boolean;
  /** When set, overlay is clipped to media bounds (no highlight on empty/letterbox area) */
  maskImage?: string;
}

export function Overlay({
  cover,
  color = "dark",
  disablePointerEvents = true,
  trigger = "none",
  active = false,
  onClick,
  maskImage,
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
        "transition-opacity duration-[400ms] ease-out": trigger !== "none",
        "opacity-0 group-hover:opacity-60": trigger === "hover",
        "opacity-0 group-data-[held=true]:opacity-60": trigger === "held",
        "opacity-0": trigger === "active" && !active,
        "opacity-60": trigger === "active" && active,
      })}
      style={
        maskImage
          ? {
              maskImage: `url(${maskImage})`,
              maskSize: "contain",
              maskPosition: "center",
              maskRepeat: "no-repeat",
              WebkitMaskImage: `url(${maskImage})`,
              WebkitMaskSize: "contain",
              WebkitMaskPosition: "center",
              WebkitMaskRepeat: "no-repeat",
            }
          : undefined
      }
      onClick={onClick}
      aria-hidden="true"
    />
  );
}
