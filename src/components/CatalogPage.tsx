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
    <div className="flex justify-center items-center bg-stone-300">
      <Image src={imageSrc} alt={name} className="aspect-[0.78] w-[200px]" />
    </div>
    <div className="flex gap-5 justify-between mt-2 text-xs font-medium text-black lowercase">
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
    <div className="flex flex-col py-5 bg-white">
      <div className="flex flex-col px-5 w-full max-md:max-w-full">
        <div className="flex gap-5 w-full max-md:flex-wrap max-md:max-w-full">
          <div className="flex flex-col text-sm font-medium text-black whitespace-nowrap">
            <Image
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/cc64f43a185078af71f0737501ee8ee7ee30a3df8867b8e73ce9bbd83877e583?apiKey=2bd386ac58de4a4f9e996607125fc961&"
              alt="Logo"
              className="w-10 aspect-square"
            />
            <div className="flex gap-2 mt-8">
              <div className="shrink-0 self-start w-2 bg-black h-[11px]" />
              <div>catalog</div>
            </div>
            <div className="mt-80 max-md:mt-10">archive</div>
          </div>
          <div className="flex-auto self-end mt-16 max-md:mt-10 max-md:max-w-full">
            <div className="flex gap-5 max-md:flex-col max-md:gap-0">
              <div className="flex flex-col w-6/12 max-md:ml-0 max-md:w-full">
                <div className="shrink-0 mx-auto max-w-full bg-zinc-800 h-[360px] w-[578px] max-md:mt-5" />
              </div>
              <div className="flex flex-col ml-5 w-6/12 max-md:ml-0 max-md:w-full">
                <div className="shrink-0 mx-auto max-w-full bg-zinc-800 h-[360px] w-[578px] max-md:mt-5" />
              </div>
            </div>
          </div>
          <div className="flex flex-col self-start mt-3.5 text-sm font-medium text-black">
            <div className="flex gap-0 justify-center px-1.5 py-0.5 text-xs text-white lowercase whitespace-nowrap bg-black">
              <div>currency:</div>
              <Image
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/8764204ec037682f32733d88473f7cc6f61e2364f55757470d79a852ae6116e4?apiKey=2bd386ac58de4a4f9e996607125fc961&"
                alt="Currency"
                className="shrink-0 w-3 aspect-square"
              />
            </div>
            <div className="mt-10">cart (19)</div>
            <div className="mt-80 max-md:mt-10">about</div>
          </div>
        </div>
        <div className="flex gap-5 items-center mt-16 w-full max-md:flex-wrap max-md:mt-10 max-md:max-w-full">
          <div className="self-stretch my-auto text-sm font-medium text-black">
            delivery
          </div>
          <div className="flex-auto self-stretch max-md:max-w-full">
            <div className="flex gap-5 max-md:flex-col max-md:gap-0">
              <div className="flex flex-col w-[18%] max-md:ml-0 max-md:w-full">
                <Product {...products[0]} />
              </div>
              <div className="flex flex-col ml-5 w-[32%] max-md:ml-0 max-md:w-full">
                <div className="flex flex-col grow justify-center w-full bg-stone-300 max-md:mt-5">
                  <Image
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/a15e1cd2bebfddf823b31e51183534c3408de12f20b23396c61f644aaf889cec?apiKey=2bd386ac58de4a4f9e996607125fc961&"
                    alt="Product"
                    className="w-full aspect-[0.78]"
                  />
                </div>
              </div>
              <div className="flex flex-col ml-5 w-[18%] max-md:ml-0 max-md:w-full">
                <Product {...products[1]} />
              </div>
              <div className="flex flex-col ml-5 w-[32%] max-md:ml-0 max-md:w-full">
                <Image
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/a53de092de4e4d2079db0b35b1ea670205eb9ac567184030e77a8bff650970a9?apiKey=2bd386ac58de4a4f9e996607125fc961&"
                  alt="Product"
                  className="grow w-full aspect-[0.78] max-md:mt-5"
                />
              </div>
            </div>
          </div>
          <div className="self-stretch my-auto text-sm font-medium text-black">
            contacts
          </div>
        </div>
        <div className="flex gap-5 self-end mt-2 mr-28 max-w-full text-xs font-medium text-black lowercase w-[954px] max-md:flex-wrap max-md:mr-2.5">
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
        <div className="self-center mt-24 w-full max-w-[1174px] max-md:mt-10 max-md:max-w-full">
          <div className="flex gap-5 max-md:flex-col max-md:gap-0">
            <div className="flex flex-col w-[32%] max-md:ml-0 max-md:w-full">
              <div className="flex flex-col grow justify-center w-full bg-stone-300 max-md:mt-5">
                <Image
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/f92c621a22d8561cacfdfb75121ece1cd9568391cd25db8fb3512e793a38832c?apiKey=2bd386ac58de4a4f9e996607125fc961&"
                  alt="Product"
                  className="w-full aspect-[0.78]"
                />
              </div>
            </div>
            <div className="flex flex-col ml-5 w-[18%] max-md:ml-0 max-md:w-full">
              <Product {...products[2]} />
            </div>
            <div className="flex flex-col ml-5 w-[32%] max-md:ml-0 max-md:w-full">
              <Image
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/a53de092de4e4d2079db0b35b1ea670205eb9ac567184030e77a8bff650970a9?apiKey=2bd386ac58de4a4f9e996607125fc961&"
                alt="Product"
                className="grow w-full aspect-[0.78] max-md:mt-5"
              />
            </div>
            <div className="flex flex-col ml-5 w-[18%] max-md:ml-0 max-md:w-full">
              <Product {...products[3]} />
            </div>
          </div>
        </div>
        <div className="flex gap-5 mt-2 ml-28 max-w-full text-xs font-medium text-black lowercase w-[954px] max-md:flex-wrap">
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
        <button className="justify-center self-center px-8 py-6 mt-20 font-medium text-white lowercase bg-black leading-[208.8px] text-[232px] max-md:px-5 max-md:mt-10 max-md:max-w-full max-md:text-4xl">
          VIEW ALL
        </button>
        <div className="self-center mt-96 text-sm leading-4 text-black lowercase max-md:mt-10">
          newsletter
        </div>
        <div className="self-end mt-7 mr-28 text-xs leading-3 text-black lowercase w-[575px] max-md:mr-2.5 max-md:max-w-full">
          Subscribe to our newsletter and receive news, information about
          promotions and pleasant surprises from grbpwr.com
        </div>
        <form>
          <label
            htmlFor="email"
            className="self-center mt-6 text-xs text-black"
          >
            email
          </label>
          <input
            type="email"
            id="email"
            className="shrink-0 self-center mt-1.5 ml-28 h-px bg-black border border-black border-solid w-[193px]"
            aria-label="Email"
          />
          <button
            type="submit"
            className="justify-center self-start px-12 py-2 text-lg font-medium text-white whitespace-nowrap bg-black max-md:px-5"
          >
            subscribe
          </button>
        </form>
      </div>
      <footer className="flex gap-5 justify-between items-start mt-6 ml-5 max-w-full w-[904px] max-md:flex-wrap">
        <div className="flex gap-5 justify-between self-end mt-6 text-xs text-black">
          <div>grbpwr 2024©</div>
          <nav className="flex gap-5 justify-between font-medium whitespace-nowrap">
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
