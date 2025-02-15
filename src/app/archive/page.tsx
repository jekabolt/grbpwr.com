import { serviceClient } from "@/lib/api";
import FlexibleLayout from "@/components/flexible-layout";

export default async function Page() {
  const { archives } = await serviceClient.GetArchivesPaged({
    limit: 10,
    offset: 0,
    orderFactor: "ORDER_FACTOR_UNKNOWN",
  });

  return (
    <div className="blackTheme bg-bgColor text-textColor">
      <FlexibleLayout headerType="catalog" footerType="mini" theme="dark">
        <div>arrchive</div>
      </FlexibleLayout>
    </div>
  );
}
