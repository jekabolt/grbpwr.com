interface ProductPageProps {
  params: {
    productId: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const data = await fetch(
    `http://worldtimeapi.org/api/timezone/Europe/${params.productId}`,
    {
      next: {
        revalidate: 60,
      },
    }
  );

  const data1 = await data.json();

  return <main>{JSON.stringify(data1)}</main>;
}
