import Layout from "@/components/global/Layout";
import { serviceClient } from "@/lib/api";
import Catalog from "./Catalog";

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
