import Catalog from "@/components/elements/Catalog";
import Layout from "@/components/global/Layout";
import { serviceClient } from "@/lib/api";

export default async function Page() {
  const response = await serviceClient.GetProductsPaged({
    limit: 16,
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
