import Link from "next/link";

import { MobileNavMenu } from "@/components/ui/mobile-nav-menu";
import { Button } from "@/components/ui/button";
import { DesktopNavigationMenu } from "@/app/[locale]/_components/desktop-nav-menu";

export function HeaderLeftNav({
  showAnnounce,
  isBigMenuEnabled,
  onNavOpenChange,
  isWebsiteEnabled,
  isMobile,
}: {
  showAnnounce?: boolean;
  isBigMenuEnabled?: boolean;
  onNavOpenChange: (isOpen: boolean) => void;
  isWebsiteEnabled?: boolean;
  isMobile?: boolean;
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
