import { DesktopNavigationMenu } from "@/components/ui/desktop-nav-menu";
import { MobileNavMenu } from "@/components/ui/mobile-nav-menu";

export function HeaderLeftNav({
  isNavOpen,
  isBigMenuEnabled,
  onNavOpenChange,
}: {
  isNavOpen: boolean;
  isBigMenuEnabled?: boolean;
  onNavOpenChange: (isOpen: boolean) => void;
}) {
  return (
    <div className="grow basis-0">
      <div className="hidden lg:block">
        <DesktopNavigationMenu
          isNavOpen={isNavOpen}
          onNavOpenChange={onNavOpenChange}
          isBigMenuEnabled={isBigMenuEnabled}
        />
      </div>

      <div className="block lg:hidden">
        <MobileNavMenu />
      </div>
    </div>
  );
}
