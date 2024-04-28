import Catalog from "@/components/elements/Catalog";
import Layout from "@/components/global/Layout";
import { catalogLimit } from "@/constants";
import { serviceClient } from "@/lib/api";

export default async function Page() {
  const response = await serviceClient.GetProductsPaged({
    limit: catalogLimit,
    offset: 0,
    sortFactors: undefined,
    orderFactor: undefined,
    filterConditions: undefined,
  });
  return (
    <Layout>
      <Catalog firstPageItems={response.products || []} />
    </Layout>
  );
}
