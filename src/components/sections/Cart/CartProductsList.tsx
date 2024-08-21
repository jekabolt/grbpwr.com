import Button from "@/components/ui/Button";
import fetchValidateItems from "@/lib/api";
import Link from "next/link";
import CartItemRow from "./CartItemRow";

export default async function CartProductsList() {
  const response = await fetchValidateItems(undefined, undefined);

  return response?.validItems?.map((p) => (
    <Button key={p.id as number} asChild>
      <Link href={p.slug || ""}>
        <CartItemRow product={p} />
      </Link>
    </Button>
  ));
}
