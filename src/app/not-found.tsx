import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

import "./globals.css";

import { generateCommonMetadata } from "@/lib/common-metadata";
import FlexibleLayout from "@/components/flexible-layout";

export const dynamic = "force-static";

export const metadata = generateCommonMetadata({
  title: "page not found".toUpperCase(),
  description: "page not found",
});

export default function NotFoundPage() {
  return (
    <FlexibleLayout headerType="catalog" footerType="regular">
      <div className="flex h-screen flex-col items-center justify-center gap-6">
        <Text variant="uppercase" component="h1">
          page not found
        </Text>
        <Text className="max-w-xs px-2.5 text-center lg:max-w-72 lg:px-0">
          sorry, the page you are looking for doesn&apos;t exist or has been
          moved. please go back to the homepage or contact us if the problem
          persists.
        </Text>
        <Button asChild variant="main" size="lg" className="uppercase">
          <Link href="/">main</Link>
        </Button>
      </div>
    </FlexibleLayout>
  );
}
