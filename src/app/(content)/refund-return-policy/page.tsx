import { generateCommonMetadata } from "@/lib/common-metadata";
import CareComposition from "@/components/ui/care-composition";
import { Text } from "@/components/ui/text";
import TextWrapper from "@/components/ui/text-wrapper";

export const metadata = generateCommonMetadata({
  title: "refund and return policy".toUpperCase(),
});

export default function Component() {
  return (
    <TextWrapper>
      <Text variant="uppercase" component="h1">
        returns and cancelations policy
      </Text>
      <Text variant="uppercase">eligibility for returns:</Text>
      <Text size="small" className="leading-none">
        grbpwr do not accept any returns or item exchange.we do not accept any
        returns or exchanges even in case the item/s you received does not feet
        you (too small, too big), if it&apos;s not the color you thought it is
        or if you think it doesn&apos;t suit you. we therefore ask our customers
        to pay attention to all provided details of the item/s purchased and
        have a close look at our photos and item details before placing an
        order. if you have any doubt or uncertainty regarding any of our items,
        please contact us beforehand. if you believe you&apos;ve received a
        defective or incorrect product (item or size) please send us an email
        with a photo of the item and a short explanation about it within 5 days
        from its arrival date. after confirming that the item is defective or is
        different to the one ordered, we will instruct you on where and how to
        send the defective/wrong back item to us. defective or incorrect items
        should be sent back to us with in a maximum of 10 days from its arrival
        day. shipping costs will be paid by us only in case of returning
        defective or incorrect product and after our confirmation. once we
        receive the defective or incorrect product we check its condition and if
        the claim is approved we will refund you the shipping cost from your
        location back to us. if the originally ordered item exists in stock it
        will be resent to you and shipping cost will be paid by us, in case the
        item is already sold out and not in stock, we will refund you the full
        item cost together with its original shipping cost. please note that
        items with tags removed, items that are worn, items stained or damaged
        by the buyer cannot be returned and will not be refunded. all claims
        must be made by email within 5 days from the arrival of your order, and
        must be resent back to us within 10 days from its arrival. if you fail
        to comply any of the above instructions, no refunds will be made what so
        ever. sale and promotion items (all discounted items) are nonreturnable
        and nonrefundable under any circumstances.
      </Text>
      <CareComposition className="mb-10 space-y-6" />
      <Text variant="uppercase">return time frame:</Text>
      <Text size="small" className="leading-none">
        products must be returned within 14 days of delivery. please report any
        defective products within 5 days of receipt to ensure timely processing.
      </Text>
      <CareComposition className="mb-10 space-y-6" />
      <Text variant="uppercase">return process:</Text>
      <Text size="small" className="leading-none">
        1. contact us: notify us by email or phone before sending any products
        back. this allows us to provide you with specific instructions and
        streamline the return process.
        <br />
        2. prepare your return: pack the items securely in the original
        packaging, including all paperwork. if the original packaging is
        unavailable, pack items in a manner that ensures their safe transit.
        <br />
        3. ship your return: send the items to the following address at your own
        cost and risk: grbpwI returns department 500-651 plac zbawiciela
        warszawa, polandwe recommend using a recorded delivery service as we are
        not liable for items lost or damaged in transit.
      </Text>
      <CareComposition className="mb-10 space-y-6" />
      <Text variant="uppercase">refunds processing:</Text>
      <Text size="small" className="leading-none">
        once we receive your returned items, please allow up to 14 business days
        for us to process your refund. you will be notified via email once your
        return has been processed and your refund issued.
      </Text>
      <CareComposition className="mb-10 space-y-6" />
      <Text variant="uppercase">exchanges:</Text>
      <Text size="small" className="leading-none">
        if you prefer to exchange an item, please contact us for assistance.
        exchanges are subject to stock availability and can be arranged directly
        with our customer service team.
      </Text>
      <CareComposition className="mb-10 space-y-6" />
      <Text variant="uppercase">defective products:</Text>
      <Text size="small" className="leading-none">
        upon receipt, inspect your products immediately. if you believe any
        items are defective or not as described, contact our customer service
        without returning the products. we will guide you through the process of
        obtaining a replacement or refund for the defective item.
        <br />
        international returns: for customers outside of poland, please contact
        us for specific instructions and details regarding potential additional
        costs for international returns.
      </Text>
      <CareComposition className="mb-10 space-y-6" />
    </TextWrapper>
  );
}
