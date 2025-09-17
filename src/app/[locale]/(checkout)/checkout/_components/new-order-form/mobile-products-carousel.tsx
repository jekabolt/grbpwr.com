import type { common_OrderItem } from "@/api/proto-http/frontend";

import Image from "@/components/ui/image";

export function MobileProductsCarousel({ validatedProducts }: Props) {
  return (
    <div className="flex gap-1 overflow-scroll">
      {validatedProducts?.map((p, i) => (
        <div className="h-20" key={p?.id + "" + p?.orderId + i}>
          <Image
            src={p?.thumbnail || ""}
            alt={p?.thumbnail || ""}
            aspectRatio="3/4"
            fit="contain"
          />
        </div>
      ))}
    </div>
  );
}

interface Props {
  validatedProducts?: common_OrderItem[];
}
