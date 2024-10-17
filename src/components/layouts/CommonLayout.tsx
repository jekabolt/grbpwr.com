type Props = {
  children: React.ReactNode;
};

import { serviceClient } from "@/lib/api";
import { HeroContextProvider } from "@/components/contexts/HeroContext";

export async function CommonLayout({ children }: Props) {
  const heroData = await serviceClient.GetHero({});

  return (
    <HeroContextProvider {...heroData}>
      <div className="lightTheme relative min-h-screen">{children}</div>
    </HeroContextProvider>
  );
}
