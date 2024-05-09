import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="backdrop-md sticky top-0 z-20 flex items-center justify-between p-5 text-textColor backdrop-blur-md md:justify-start">
      <div className="grow basis-0 text-sm underline md:hidden">menu</div>
      <Link href="/">
        <Image
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/6b8a4874b5cca3f5bc9a1f31add3e5664b819b7c32a62ec7ea0fdc1a1ca1a6b6?apiKey=2bd386ac58de4a4f9e996607125fc961&"
          height={40}
          width={40}
          alt="logo"
        />
      </Link>
      <div className="grow basis-0 text-right text-sm underline md:hidden">
        cart {"(19)"}
      </div>
    </header>
  );
}
