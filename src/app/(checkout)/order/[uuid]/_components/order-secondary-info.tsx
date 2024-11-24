import Link from "next/link";
import type { common_OrderFull } from "@/api/proto-http/frontend";
import { AccordionContent } from "@radix-ui/react-accordion";

import { useDataContext } from "@/components/DataContext";
import {
  AccordionItem,
  AccordionRoot,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

export function DesktopOrderSecondaryInfo({
  shipping,
  shipment,
  billing,
}: Props) {
  const { dictionary } = useDataContext();

  const shipmentCarrierName = dictionary?.shipmentCarriers?.find(
    (carrier) => carrier.id === shipment?.carrierId,
  )?.shipmentCarrier?.carrier;

  return (
    <div className="mb-10 hidden min-h-52 gap-10 border-b border-dashed border-textInactiveColor py-10 md:grid-cols-4 lg:grid">
      <div className="space-y-4">
        <Text variant="inactive">shipping address</Text>
        {shipping && (
          <Text variant="default">
            {`${shipping.addressInsert?.addressLineOne}, ${shipping.addressInsert?.city}`}
          </Text>
        )}
      </div>
      <div className="space-y-4">
        <Text variant="inactive">billing address</Text>
        {billing && (
          <Text variant="default">
            {`${billing.addressInsert?.addressLineOne}, ${billing.addressInsert?.city}`}
          </Text>
        )}
      </div>
      <div className="space-y-4">
        <Text variant="inactive">shipping method</Text>
        <Text variant="default">{shipmentCarrierName}</Text>
      </div>
      <div className="space-y-4">
        <Text variant="inactive">receipt</Text>
        <Button variant="underlineWithColors" size="default" asChild>
          <Link href={"/some-page"}>link</Link>
        </Button>
      </div>
    </div>
  );
}

export function MobileOrderSecondaryInfo({
  shipping,
  billing,
  shipment,
}: Props) {
  const { dictionary } = useDataContext();

  const shipmentCarrierName = dictionary?.shipmentCarriers?.find(
    (carrier) => carrier.id === shipment?.carrierId,
  )?.shipmentCarrier?.carrier;

  return (
    <AccordionRoot type="single" collapsible className="space-y-6">
      <AccordionItem value="item-1" className="space-y-4">
        <AccordionTrigger>
          <Text variant="inactive">shipping address</Text>
        </AccordionTrigger>
        <AccordionContent>
          {shipping && (
            <Text variant="default">
              {`${shipping.addressInsert?.addressLineOne}, ${shipping.addressInsert?.city}`}
            </Text>
          )}
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-2" className="space-y-4">
        <AccordionTrigger>
          <Text variant="inactive">billing address</Text>
        </AccordionTrigger>
        <AccordionContent>
          {billing && (
            <Text variant="default">
              {`${billing.addressInsert?.addressLineOne}, ${billing.addressInsert?.city}`}
            </Text>
          )}
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-3" className="space-y-4">
        <AccordionTrigger>
          <Text variant="inactive">shipping method</Text>
        </AccordionTrigger>
        <AccordionContent>{shipmentCarrierName}</AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-4" className="space-y-4">
        <AccordionTrigger>
          <Text variant="inactive">receipt</Text>
        </AccordionTrigger>
        <AccordionContent>
          <Button variant="underlineWithColors" size="default" asChild>
            <Link href={"/some-page"}>link</Link>
          </Button>
        </AccordionContent>
      </AccordionItem>
    </AccordionRoot>
  );
}

type Props = Pick<common_OrderFull, "shipping" | "billing" | "shipment">;
