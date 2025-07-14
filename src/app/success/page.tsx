import Link from "next/link";

import FlexibleLayout from "@/components/flexible-layout";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

export default function SuccessPage() {
  return (
    <FlexibleLayout headerType="catalog" footerType="regular">
      <div className="flex h-screen flex-col items-center justify-center gap-6">
        <Text variant="uppercase" component="h1">
          thank you for reaching us
        </Text>
        <Text className="max-w-xs px-2.5 text-center lg:max-w-72 lg:px-0">
          Your request has been received. We&apos;ll get back to you by email
          within 1&ndash;3 business days.
        </Text>
        <Button asChild variant="main" size="lg" className="uppercase">
          <Link href="/">main</Link>
        </Button>
      </div>
    </FlexibleLayout>
  );
}
