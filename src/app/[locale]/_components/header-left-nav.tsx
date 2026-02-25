import Link from "next/link";

import { Button } from "@/components/ui/button";
import { MobileNavMenu } from "@/components/ui/mobile-nav-menu";
import { DesktopNavigationMenu } from "@/app/[locale]/_components/desktop-nav-menu";

export function HeaderLeftNav({
  showAnnounce,
  isBigMenuEnabled,
  isWebsiteEnabled,
  isMobile,
  onNavOpenChange,
}: {
  showAnnounce?: boolean;
  isBigMenuEnabled?: boolean;
  isWebsiteEnabled?: boolean;
  isMobile?: boolean;
  onNavOpenChange: (isOpen: boolean) => void;
}) {
  const showGrbpwrOnLeft = isWebsiteEnabled === false && isMobile;

  return (
    <div className="grow basis-0">
      <div className="hidden lg:block">
        <DesktopNavigationMenu
          showAnnounce={showAnnounce}
          onNavOpenChange={onNavOpenChange}
          isBigMenuEnabled={isBigMenuEnabled}
        />
      </div>

      <div className="block lg:hidden">
        {showGrbpwrOnLeft ? (
          <Button
            asChild
            size="lg"
            className="transition-colors hover:opacity-70 active:opacity-50"
          >
            <Link href="/">grbpwr</Link>
          </Button>
        ) : (
          <MobileNavMenu isBigMenuEnabled={isBigMenuEnabled} />
        )}
      </div>
    </div>
  );
}
