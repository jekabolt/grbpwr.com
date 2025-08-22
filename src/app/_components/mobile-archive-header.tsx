import { HeaderProps } from "@/components/flexible-layout";
import { AnimatedButton } from "@/components/ui/animated-button";

export function MobileArchiveHeader({
  left,
  center,
  right,
  link,
  onClick,
}: HeaderProps) {
  return (
    <>
      <div className="fixed inset-x-6 top-6 z-30 flex justify-end bg-transparent text-textColor mix-blend-exclusion">
        <AnimatedButton animationArea="text" onClick={onClick}>
          {right}
        </AnimatedButton>
      </div>
      <div className="bottom fixed inset-x-2.5 bottom-2.5 z-30 flex h-12 items-center justify-between bg-bgColor px-4 py-2.5 text-textColor mix-blend-hard-light">
        <AnimatedButton href={link ? link : "/"}>{left}</AnimatedButton>
        <AnimatedButton href="/archive">{center}</AnimatedButton>
      </div>
    </>
  );
}
