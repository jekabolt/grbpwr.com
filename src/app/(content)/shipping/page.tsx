import CareComposition from "@/components/ui/care-composition";
import CopyText from "@/components/ui/copy-text";
import { Text } from "@/components/ui/text";

export default function Component() {
  return (
    <div className="prose-lg">
      <Text variant="uppercase" className="mb-10">
        shipping
      </Text>
      <Text variant="uppercase">order processing and delivery time:</Text>
      <Text size="small" className="leading-none">
        1. all orders are processed within 2 business days (excluding weekends
        and holidays) upon receiving your order confirmation email.
        <br />
        2. you will be notified once your order has been shipped. however,
        delays may occur due to unforeseen events such as peak traffic during
        holidays, force majeure, or challenges with our carriers.
      </Text>
      <CareComposition className="mb-10 space-y-6" />
      <Text variant="uppercase">shipping rates:</Text>
      <Text size="small" className="leading-none">
        1. netherlands: standard €7, express €10. free standard shipping on
        orders over €200.
        <br />
        2. belgium: standard €10, express €15. free standard shipping on orders
        over €300.
        <br />
        3. united kingdom: express £15. free express shipping on orders over
        £250.
        <br />
        4. european union: standard €10, express €15. free standard shipping on
        orders over €300.
        <br />
        5. usa: express $20. free express shipping on orders over $500.
        <br />
        6. australia: express aud 55. free express shipping on orders over aud
        800.
        <br />
        7. asia/rest of the world: express €25. free express shipping on orders
        over €600.
      </Text>
      <CareComposition className="mb-10 space-y-6" />
      <Text variant="uppercase">duties and taxes:</Text>
      <Text size="small" className="leading-none">
        deliveries outside the eu may incur import duties and taxes, which are
        the responsibility of the recipient.
      </Text>
      <CareComposition className="mb-10 space-y-6" />
      <Text variant="uppercase">order status:</Text>
      <Text size="small" component="span" className="mb-6 block leading-none">
        once your order is shipped, we'll send you an email with a tracking
        number. please allow 48 hours for tracking information to update. if
        your order has not arrived within 7 days post-shipment, please contact
        us at&nbsp;
        <span className="inline-flex items-center">
          <CopyText text="customercare@grbpwr.com" />
        </span>
        .
      </Text>
      <CareComposition className="mb-10 space-y-6" />
      <Text variant="uppercase">first-time order policy:</Text>
      <Text size="small" className="leading-none">
        for security reasons, first-time orders may need to be shipped to the
        cardholder's verified billing or work address. please ensure all details
        are accurate to avoid delays.
      </Text>
      <CareComposition className="mb-10 space-y-6" />
      <Text variant="uppercase">rejected parcels:</Text>
      <Text size="small" className="leading-none">
        if a parcel is refused, the customer will be charged for return
        shipping, import duties, and a €50 fee for packaging, handling, and
        restocking. these costs will be deducted from any refunds.
      </Text>
      <CareComposition className="mb-10 space-y-6" />
      <Text variant="uppercase">shipping restrictions:</Text>
      <Text size="small" className="leading-none">
        we do not ship to p.o. boxes.
      </Text>
      <CareComposition className="mb-10 space-y-6" />
    </div>
  );
}
