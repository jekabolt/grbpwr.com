import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Header } from "@/app/_components/header";

import "./globals.css";

export default function NotFoundPage() {
  return (
    <div>
      <Header />
      <div className="space-y-6 px-2.5 pt-6 lg:px-24 lg:pt-0">
        <Text component="h1">page not found</Text>
        <Text className="lg:max-w-xl" size="small">
          sorry, the page you are looking for doesn&apos;t exist or has been
          moved. please go back to the homepage or contact us if the problem
          persists.
        </Text>
        <div className="flex items-center gap-8 lg:gap-x-20">
          <Button variant="underlineWithColors" asChild>
            <Link href="/contacts-us">contact us</Link>
          </Button>
          <Button variant="main" size="lg" asChild>
            <Link href="/catalog">catalog</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
