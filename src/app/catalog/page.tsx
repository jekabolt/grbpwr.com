import Layout from "@/components/global/Layout";
import ProductsSection from "@/components/sections/ProductsGridSection";
import { serviceClient } from "@/lib/api";

export default async function Page() {
  const { products } = await serviceClient.GetProductsPaged({
    limit: 50,
    offset: 0,
    sortFactors: undefined,
    orderFactor: undefined,
    filterConditions: undefined,
  });

  console.log(products);

  return (
    <Layout>
      <ProductsSection products={products} />
    </Layout>
  );
}
