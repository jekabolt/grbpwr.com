import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Header } from "@/app/_components/header";

import "./globals.css";

export default function NotFound() {
  return (
    <div>
      <Header />
      <div className="ml-40 mt-40">
        <Text variant="default" component="p" className="mb-4">
          page not found.
        </Text>
        <Text variant="default" component="p" className="mb-6">
          sorry, the page you are looking for doesn&apos;t exist or has been
          moved.
          <br />
          please go back to the homepage or contact us if the problem persists.
        </Text>
        <div className="flex gap-x-20">
          <Button asChild variant="underlineWithColors">
            <Link href="/about">contact us</Link>
          </Button>
          <Button asChild variant="underlineWithColors">
            <Link href="/catalog">catalog</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
