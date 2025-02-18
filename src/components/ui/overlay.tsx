import { cn } from "@/lib/utils";

interface Props {
  cover: "screen" | "container";
}

export function Overlay({ cover }: Props) {
  return (
    <div
      className={cn("inset-0 z-10 h-screen bg-overlay", {
        fixed: cover === "screen",
        "absolute h-full": cover === "container",
      })}
    />
  );
}
