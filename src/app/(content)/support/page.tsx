import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

import { SupportForm } from "./_components/support-form";

export default function SupportPage() {
  return (
    <div className="container mx-auto space-y-16">
      <Text variant="uppercase" component="h1">
        Customer support
      </Text>
      <div>
        <Text variant="uppercase" component="h2" className="mb-6">
          1/2 fill out the form
        </Text>
        <div className="lg:pl-9">
          <SupportForm />
        </div>
      </div>
      <div>
        <div className="space-y-8">
          <Text variant="uppercase" component="h2">
            2/2 send us your completed form via
          </Text>
          <div className="lg:pl-9">
            <div className="flex gap-4 ">
              <Button variant="main" size="lg">
                TELEGRAM BOT
              </Button>
              <Button variant="main" size="lg">
                COPY EMAIL
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
