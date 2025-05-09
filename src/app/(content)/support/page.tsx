import { generateCommonMetadata } from "@/lib/common-metadata";
import { Text } from "@/components/ui/text";

import { CommunicationButtons } from "./_components/communication-buttons";
import { SupportForm } from "./_components/support-form";

export const metadata = generateCommonMetadata({
  title: "support".toUpperCase(),
});

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
        <div className="max-w-xl lg:pl-9">
          <SupportForm />
        </div>
      </div>
      <div>
        <div className="space-y-8">
          <Text variant="uppercase" component="h2">
            2/2 send us your completed form via
          </Text>
          <div className="lg:pl-9">
            <CommunicationButtons />
          </div>
        </div>
      </div>
    </div>
  );
}
