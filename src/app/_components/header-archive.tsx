import { HeaderProps } from "@/components/flexible-layout";
import { AnimatedButton } from "@/components/ui/animated-button";

import { MobileArchiveHeader } from "./mobile-archive-header";

export function HeaderArchive({
  left,
  center,
  right,
  link,
  onClick,
}: HeaderProps) {
  return (
    <>
      <div className="block lg:hidden">
        <MobileArchiveHeader
          left={left}
          center={center}
          right={right}
          onClick={onClick}
        />
      </div>
      <header className="fixed inset-x-2.5 bottom-2 z-30 hidden h-12 items-center justify-between gap-1 border-textInactiveColor bg-transparent p-3 text-textColor mix-blend-exclusion lg:top-2 lg:flex lg:gap-0 lg:border-0 lg:px-2.5 lg:py-3">
        <div className="flex gap-3">
          <AnimatedButton className="lg:pl-2" href={link ? link : "/"}>
            {left}
          </AnimatedButton>
          <AnimatedButton
            href="/timeline"
            className="flex grow basis-0 text-left"
          >
            {center}
          </AnimatedButton>
        </div>
        {/* <AnimatedButton animationArea="text" onClick={onClick}>
          {right}
        </AnimatedButton> */}
      </header>
    </>
  );
}
