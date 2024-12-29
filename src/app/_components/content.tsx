import Link from "next/link";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function Content({ className }: { className?: string }) {
  return (
    <div className={cn("flex", className)}>
      <Button asChild>
        <Link href="/shipping">shippinng</Link>
      </Button>
      <Button asChild>
        <Link href="/refund-return-policy">refund and return policy</Link>
      </Button>
      <Button asChild>
        <Link href="product-care">product care</Link>
      </Button>
      <Button asChild>
        <Link href="privacy-policy">privacy policy</Link>
      </Button>
      <Button asChild>
        <Link href="terms-and-conditions">terms and conditions</Link>
      </Button>
    </div>
  );
}
