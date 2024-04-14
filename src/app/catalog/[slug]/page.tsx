import { serviceClient } from "@/lib/api";
import Image from "next/image";
import { Fragment } from "react";

interface ProductPageProps {
  params: {
    slug: string;
  };
}

const catalogData = [
  { label: "cloth", separator: "/" },
  { label: "Jackets & Coats", separator: "/" },
];

export default async function ProductPage({ params }: ProductPageProps) {
  const { product } = await serviceClient.GetProduct({ slug: params.slug });

  // @ts-ignore
  console.log(product);

  // const data = await fetch(
  //   `http://worldtimeapi.org/api/timezone/Europe/${params.productId}`,
  //   {
  //     next: {
  //       revalidate: 60,
  //     },
  //   },
  // );

  //@ts-ignore
  // const data1 = await data.json();

  return (
    <main>
      <div className="flex flex-col bg-white pb-20 pt-5">
        {JSON.stringify(product)}
        <div className="flex w-full flex-col items-start px-5 max-md:max-w-full max-md:pr-5">
          <div className="flex w-full gap-5 self-stretch max-md:max-w-full max-md:flex-wrap">
            <div className="flex-auto max-md:max-w-full">
              <div className="flex gap-5 max-md:flex-col max-md:gap-0">
                <div className="flex w-[57%] flex-col max-md:ml-0 max-md:w-full">
                  <div className="grow max-md:mt-2.5 max-md:max-w-full">
                    <div className="flex gap-5 max-md:flex-col max-md:gap-0">
                      <div className="flex w-6/12 flex-col max-md:ml-0 max-md:w-full">
                        <div className="z-10 flex grow flex-col">
                          <div className="mt-40 flex justify-between gap-5 max-md:mt-10">
                            <div className="flex flex-col">
                              <div className="flex flex-col justify-center bg-zinc-100">
                                <Image
                                  width={250}
                                  height={330}
                                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/41472bb43ca43c787a79d66169a8dc3530a8eabac78726227330f56c2f163407?apiKey=2bd386ac58de4a4f9e996607125fc961&"
                                  alt="Scarf sous cropped"
                                  className="aspect-[0.68] w-full"
                                />
                              </div>
                              <p className="mt-4 text-lg lowercase leading-5 tracking-wide text-zinc-800">
                                Scarf sous cropped
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="ml-5 flex w-6/12 flex-col max-md:ml-0 max-md:w-full">
                        <div className="mt-12 flex grow flex-col whitespace-nowrap text-2xl text-zinc-800 max-md:mt-10">
                          <Image
                            width={400}
                            height={600}
                            src="https://cdn.builder.io/api/v1/image/assets/TEMP/e24fd80e18d916ad527c3150a919b9d3a25ab0b8cfc42a063553b22e042e597d?apiKey=2bd386ac58de4a4f9e996607125fc961&"
                            alt="Product image"
                            className="aspect-[0.72] w-full"
                          />
                          <p className="mt-3.5 self-end max-md:mr-2.5">170$</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="ml-5 flex w-[43%] flex-col max-md:ml-0 max-md:w-full">
                  <div className="my-auto self-stretch max-md:mt-10 max-md:max-w-full">
                    <div className="flex gap-5 max-md:flex-col max-md:gap-0">
                      <div className="flex w-[67%] flex-col max-md:ml-0 max-md:w-full">
                        <Image
                          width={400}
                          height={600}
                          src="https://cdn.builder.io/api/v1/image/assets/TEMP/590aa68644207dff39aa19e1f5dfaf7edb0504c213d7a16ee42b0fd776b4b646?apiKey=2bd386ac58de4a4f9e996607125fc961&"
                          alt="Product image"
                          className="aspect-[0.68] w-full grow max-md:mt-2.5"
                        />
                      </div>
                      <div className="ml-5 flex w-[33%] flex-col max-md:ml-0 max-md:w-full">
                        <div className="relative mt-64 flex aspect-[0.66] w-[180px] grow flex-col items-start overflow-hidden px-16 pt-20 max-md:mt-10">
                          <Image
                            width={250}
                            height={330}
                            src="https://cdn.builder.io/api/v1/image/assets/TEMP/1d39fd841392d7e7fb4b7b562a8786f8fdf3dad084a27ea09c25b0c333ceb64a?apiKey=2bd386ac58de4a4f9e996607125fc961&"
                            alt="Background"
                            className="size-full absolute inset-0 object-cover"
                          />
                          <div className="relative ml-3 mt-7 h-[164px] w-full shrink-0 bg-stone-300 max-md:ml-2.5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p className="ml-28 mt-3.5 w-[537px] text-xs lowercase leading-3 text-zinc-800 max-md:max-w-full">
            Nobody knows what it is, but it exists. We create or don\t create
            narratives and objects. Appreciate action, not criticizing inaction.
            Culture compilation. Limited by our experience not by the mentality.
          </p>
          <p className="ml-28 mt-7 text-xs font-medium lowercase leading-3 text-zinc-800 underline max-md:ml-2.5">
            measurments
          </p>
        </div>
      </div>
    </main>
  );
}
