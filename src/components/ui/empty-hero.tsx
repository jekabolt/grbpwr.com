import Link from "next/link";
import { useTranslations } from "next-intl";

import FlexibleLayout from "../flexible-layout";
import { Button } from "./button";

export function EmptyHero() {
  const t = useTranslations("empty-hero");
  return (
    <FlexibleLayout theme="dark">
      <div className="blackTheme absolute inset-0 flex h-screen w-full items-center justify-center bg-bgColor text-textColor">
        <Button variant="underline" className="uppercase" asChild>
          <Link href="/catalog">{t("shop now")}</Link>
        </Button>
      </div>
    </FlexibleLayout>
  );
}
