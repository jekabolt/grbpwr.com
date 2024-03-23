import * as React from "react";

interface ImageProps {
  src: string;
  alt: string;
  className?: string;
}

const Image: React.FC<ImageProps> = ({ src, alt, className }) => (
  <img loading="lazy" src={src} alt={alt} className={className} />
);

interface ProductProps {
  imageSrc: string;
  name: string;
  price: string;
}

const Product: React.FC<ProductProps> = ({ imageSrc, name, price }) => (
  <div className="flex flex-col">
    <div className="flex items-center justify-center bg-stone-300">
      <Image src={imageSrc} alt={name} className="aspect-[0.78] w-[200px]" />
    </div>
    <div className="mt-2 flex justify-between gap-5 text-xs font-medium lowercase text-black">
      <div className="leading-4">{name}</div>
      <div className="self-start text-right">{price}</div>
    </div>
  </div>
);

const products: ProductProps[] = [
  {
    imageSrc:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/0f73018e5a1f20e75aa0c904557ee1862f24438cd5a6f95588ef2fb97f88bfa7?apiKey=2bd386ac58de4a4f9e996607125fc961&",
    name: "Rick owens owens 2k34567fghjdfg",
    price: "100$",
  },
  {
    imageSrc:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/e03e58c6c7d4b1c0ab7f0f643f87b7991d051100a4341533f0b06cafd41c50bc?apiKey=2bd386ac58de4a4f9e996607125fc961&",
    name: "Rick owens owens 2k34567fghjdfg",
    price: "100$",
  },
  {
    imageSrc:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/e41de7d3032c425188b15f609dced450fbc4baae89b33bcc37bef7374f39e233?apiKey=2bd386ac58de4a4f9e996607125fc961&",
    name: "Rick owens owens 2k34567fghjdfg",
    price: "100$",
  },
  {
    imageSrc:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/e03e58c6c7d4b1c0ab7f0f643f87b7991d051100a4341533f0b06cafd41c50bc?apiKey=2bd386ac58de4a4f9e996607125fc961&",
    name: "Rick owens owens 2k34567fghjdfg",
    price: "100$",
  },
];

function MyComponent() {
  return (
    <div className="flex flex-col bg-white py-5">
      <div className="flex w-full flex-col px-5 max-md:max-w-full">
        <div className="flex w-full gap-5 max-md:max-w-full max-md:flex-wrap">
          <div className="flex flex-col whitespace-nowrap text-sm font-medium text-black">
            <Image
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/cc64f43a185078af71f0737501ee8ee7ee30a3df8867b8e73ce9bbd83877e583?apiKey=2bd386ac58de4a4f9e996607125fc961&"
              alt="Logo"
              className="aspect-square w-10"
            />
            <div className="mt-8 flex gap-2">
              <div className="h-[11px] w-2 shrink-0 self-start bg-black" />
              <div>catalog</div>
            </div>
            <div className="mt-80 max-md:mt-10">archive</div>
          </div>
          <div className="mt-16 flex-auto self-end max-md:mt-10 max-md:max-w-full">
            <div className="flex gap-5 max-md:flex-col max-md:gap-0">
              <div className="flex w-6/12 flex-col max-md:ml-0 max-md:w-full">
                <div className="mx-auto h-[360px] w-[578px] max-w-full shrink-0 bg-zinc-800 max-md:mt-5" />
              </div>
              <div className="ml-5 flex w-6/12 flex-col max-md:ml-0 max-md:w-full">
                <div className="mx-auto h-[360px] w-[578px] max-w-full shrink-0 bg-zinc-800 max-md:mt-5" />
              </div>
            </div>
          </div>
          <div className="mt-3.5 flex flex-col self-start text-sm font-medium text-black">
            <div className="flex justify-center gap-0 whitespace-nowrap bg-black px-1.5 py-0.5 text-xs lowercase text-white">
              <div>currency:</div>
              <Image
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/8764204ec037682f32733d88473f7cc6f61e2364f55757470d79a852ae6116e4?apiKey=2bd386ac58de4a4f9e996607125fc961&"
                alt="Currency"
                className="aspect-square w-3 shrink-0"
              />
            </div>
            <div className="mt-10">cart (19)</div>
            <div className="mt-80 max-md:mt-10">about</div>
          </div>
        </div>
        <div className="mt-16 flex w-full items-center gap-5 max-md:mt-10 max-md:max-w-full max-md:flex-wrap">
          <div className="my-auto self-stretch text-sm font-medium text-black">
            delivery
          </div>
          <div className="flex-auto self-stretch max-md:max-w-full">
            <div className="flex gap-5 max-md:flex-col max-md:gap-0">
              <div className="flex w-[18%] flex-col max-md:ml-0 max-md:w-full">
                <Product {...products[0]} />
              </div>
              <div className="ml-5 flex w-[32%] flex-col max-md:ml-0 max-md:w-full">
                <div className="flex w-full grow flex-col justify-center bg-stone-300 max-md:mt-5">
                  <Image
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/a15e1cd2bebfddf823b31e51183534c3408de12f20b23396c61f644aaf889cec?apiKey=2bd386ac58de4a4f9e996607125fc961&"
                    alt="Product"
                    className="aspect-[0.78] w-full"
                  />
                </div>
              </div>
              <div className="ml-5 flex w-[18%] flex-col max-md:ml-0 max-md:w-full">
                <Product {...products[1]} />
              </div>
              <div className="ml-5 flex w-[32%] flex-col max-md:ml-0 max-md:w-full">
                <Image
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/a53de092de4e4d2079db0b35b1ea670205eb9ac567184030e77a8bff650970a9?apiKey=2bd386ac58de4a4f9e996607125fc961&"
                  alt="Product"
                  className="aspect-[0.78] w-full grow max-md:mt-5"
                />
              </div>
            </div>
          </div>
          <div className="my-auto self-stretch text-sm font-medium text-black">
            contacts
          </div>
        </div>
        <div className="mr-28 mt-2 flex w-[954px] max-w-full gap-5 self-end text-xs font-medium lowercase text-black max-md:mr-2.5 max-md:flex-wrap">
          <div className="flex flex-1 gap-5 self-start leading-[120%]">
            <div className="flex-auto">Rick owens owens 2k34567fghjdfg</div>
            <div className="text-right">100$</div>
          </div>
          <div className="flex flex-1 gap-5">
            <div className="flex-auto leading-[120%]">
              Rick owens owens 2k34567fghjdfg
            </div>
            <div className="text-right">100$</div>
          </div>
        </div>
        <div className="mt-24 w-full max-w-[1174px] self-center max-md:mt-10 max-md:max-w-full">
          <div className="flex gap-5 max-md:flex-col max-md:gap-0">
            <div className="flex w-[32%] flex-col max-md:ml-0 max-md:w-full">
              <div className="flex w-full grow flex-col justify-center bg-stone-300 max-md:mt-5">
                <Image
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/f92c621a22d8561cacfdfb75121ece1cd9568391cd25db8fb3512e793a38832c?apiKey=2bd386ac58de4a4f9e996607125fc961&"
                  alt="Product"
                  className="aspect-[0.78] w-full"
                />
              </div>
            </div>
            <div className="ml-5 flex w-[18%] flex-col max-md:ml-0 max-md:w-full">
              <Product {...products[2]} />
            </div>
            <div className="ml-5 flex w-[32%] flex-col max-md:ml-0 max-md:w-full">
              <Image
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/a53de092de4e4d2079db0b35b1ea670205eb9ac567184030e77a8bff650970a9?apiKey=2bd386ac58de4a4f9e996607125fc961&"
                alt="Product"
                className="aspect-[0.78] w-full grow max-md:mt-5"
              />
            </div>
            <div className="ml-5 flex w-[18%] flex-col max-md:ml-0 max-md:w-full">
              <Product {...products[3]} />
            </div>
          </div>
        </div>
        <div className="ml-28 mt-2 flex w-[954px] max-w-full gap-5 text-xs font-medium lowercase text-black max-md:flex-wrap">
          <div className="flex flex-1 gap-5 self-start leading-[120%]">
            <div className="flex-auto">Rick owens owens 2k34567fghjdfg</div>
            <div className="text-right">100$</div>
          </div>
          <div className="flex flex-1 gap-5">
            <div className="flex-auto leading-[120%]">
              Rick owens owens 2k34567fghjdfg
            </div>
            <div className="text-right">100$</div>
          </div>
        </div>
        <button className="mt-20 justify-center self-center bg-black px-8 py-6 text-[232px] font-medium lowercase leading-[208.8px] text-white max-md:mt-10 max-md:max-w-full max-md:px-5 max-md:text-4xl">
          VIEW ALL
        </button>
        <div className="mt-96 self-center text-sm lowercase leading-4 text-black max-md:mt-10">
          newsletter
        </div>
        <div className="mr-28 mt-7 w-[575px] self-end text-xs lowercase leading-3 text-black max-md:mr-2.5 max-md:max-w-full">
          Subscribe to our newsletter and receive news, information about
          promotions and pleasant surprises from grbpwr.com
        </div>
        <form>
          <label
            htmlFor="email"
            className="mt-6 self-center text-xs text-black"
          >
            email
          </label>
          <input
            type="email"
            id="email"
            className="ml-28 mt-1.5 h-px w-[193px] shrink-0 self-center border border-solid border-black bg-black"
            aria-label="Email"
          />
          <button
            type="submit"
            className="justify-center self-start whitespace-nowrap bg-black px-12 py-2 text-lg font-medium text-white max-md:px-5"
          >
            subscribe
          </button>
        </form>
      </div>
      <footer className="ml-5 mt-6 flex w-[904px] max-w-full items-start justify-between gap-5 max-md:flex-wrap">
        <div className="mt-6 flex justify-between gap-5 self-end text-xs text-black">
          <div>grbpwr 2024©</div>
          <nav className="flex justify-between gap-5 whitespace-nowrap font-medium">
            <a href="#">ig</a>
            <div className="my-auto">x</div>
            <a href="#">tg</a>
            <a href="#">gh</a>
            <a href="#">p</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}

export default MyComponent;
