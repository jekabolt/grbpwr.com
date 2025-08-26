import { DesktopNavigationMenu } from "@/components/ui/desktop-nav-menu";
import { MobileNavMenu } from "@/components/ui/mobile-nav-menu";

export function HeaderLeftNav({
  isBigMenuEnabled,
  onNavOpenChange,
  isVisible = true,
}: {
  isBigMenuEnabled?: boolean;
  onNavOpenChange: (isOpen: boolean) => void;
  isVisible?: boolean;
}) {
  return (
    <div className="grow basis-0">
      <div className="hidden lg:block">
        <DesktopNavigationMenu
          onNavOpenChange={onNavOpenChange}
          isBigMenuEnabled={isBigMenuEnabled}
          isVisible={isVisible}
        />
      </div>

      <div className="block lg:hidden">
        <MobileNavMenu isBigMenuEnabled={isBigMenuEnabled} />
      </div>
    </div>
  );
}
