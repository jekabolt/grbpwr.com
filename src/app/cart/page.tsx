import { GRBPWR_CART } from "@/actions/cart";
import CoreLayout from "@/components/layouts/CoreLayout";
import { cookies } from "next/headers";

export default async function Page() {
  const cookieStore = cookies();

  return (
    <CoreLayout>
      <div>
        <h1 className="mb-20 text-8xl">Cart</h1>
        <p>{JSON.stringify(cookieStore.get(GRBPWR_CART))}</p>
      </div>
    </CoreLayout>
  );
}
