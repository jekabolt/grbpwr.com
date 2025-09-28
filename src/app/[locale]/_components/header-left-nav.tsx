import { MobileNavMenu } from "@/components/ui/mobile-nav-menu";
import { DesktopNavigationMenu } from "@/app/[locale]/_components/desktop-nav-menu";

export function HeaderLeftNav({
  showAnnounce,
  isBigMenuEnabled,
  onNavOpenChange,
}: {
  showAnnounce?: boolean;
  isBigMenuEnabled?: boolean;
  onNavOpenChange: (isOpen: boolean) => void;
}) {
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
        <MobileNavMenu isBigMenuEnabled={isBigMenuEnabled} />
      </div>
    </div>
  );
}
