import FlexibleLayout from "@/components/flexible-layout";
import { Text } from "@/components/ui/text";

import AftersaleForm from "./_components";

export default function AftersaleServicesPage() {
  return (
    <FlexibleLayout>
      <div className="h-full space-y-12 px-2.5 pt-8 lg:space-y-16 lg:px-28 lg:pt-24">
        <Text variant="uppercase">aftersale Services</Text>
        <AftersaleForm />
      </div>
    </FlexibleLayout>
  );
}
