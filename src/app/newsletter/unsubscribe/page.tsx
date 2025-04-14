import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Header } from "@/app/_components/header";

export const dynamic = "force-static";

export default function Unsubscribe() {
  return (
    <div className="relative">
      <Header />
      <div className="space-y-6 px-2.5 pt-6 lg:px-24 lg:pt-0">
        <Text className="lg:max-w-xl">
          we are so sorry you are leaving. click &quot;unsubscribe&quot; to
          resign from list &quot;grbpwr&quot;.by clicking unsubscribe,
          you&apos;ll no longer receive marketing emails.
        </Text>
        <Button variant="main" size="lg">
          unsubscribe
        </Button>
      </div>
    </div>
  );
}
