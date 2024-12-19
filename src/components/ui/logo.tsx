import { cn } from "@/lib/utils";
import Image from "@/components/ui/image";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("size-8 bg-white", className)}>
      <Image src={"/grbpwr-logo.webp"} alt="grpwr logo" aspectRatio="1/1" />
    </div>
  );
}
