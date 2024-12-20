import { DesktopNavigationMenu } from "@/components/ui/desktop-nav-menu";
import { MobileNavMenu } from "@/components/ui/mobile-nav-menu";

export function HeaderLeftNav() {
  return (
    <div className="grow basis-0">
      <div className="hidden lg:block">
        <DesktopNavigationMenu />
      </div>

      <div className="block lg:hidden">
        <MobileNavMenu />
      </div>
    </div>
  );
}
