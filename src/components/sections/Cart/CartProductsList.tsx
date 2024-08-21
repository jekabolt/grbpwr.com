import Button from "@/components/ui/Button";
import Link from "next/link";
import CartItemRow from "./CartItemRow";

export default async function CartProductsList() {
  const response = await fetch("/api/validate-items/route", {
    method: "POST",
    body: JSON.stringify({
      shipmentCarrierId: undefined,
      promoCode: undefined,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response?.validItems?.map((p) => (
    <Button key={p.id as number} asChild>
      <Link href={p.slug || ""}>
        <CartItemRow product={p} />
      </Link>
    </Button>
  ));
}
