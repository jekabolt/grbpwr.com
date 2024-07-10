import { serviceClient } from "@/lib/api";
import { HeroContextProvider } from "../contexts/HeroContext";

type Props = {
  children: React.ReactNode;
};

export default async function Layout({ children }: Props) {
  const heroData = await serviceClient.GetHero({});

  return <HeroContextProvider {...heroData}>{children}</HeroContextProvider>;
}
