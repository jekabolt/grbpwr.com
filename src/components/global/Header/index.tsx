"use client";

import Link from "next/link";
import Image from "@/components/global/Image";
import useMobileMenu from "./useMobileMenu";
import Button from "@/components/ui/Button";

export default function Header() {
  const { triggerElement, dropdownElement } = useMobileMenu();

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between bg-bgColor p-2 py-5 text-textColor backdrop-blur-md md:justify-start lg:p-5">
      <div className="grow basis-0 md:hidden">{triggerElement}</div>
      <Link href="/" className="h-10 w-10">
        <Image
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/6b8a4874b5cca3f5bc9a1f31add3e5664b819b7c32a62ec7ea0fdc1a1ca1a6b6?apiKey=2bd386ac58de4a4f9e996607125fc961&"
          alt="logo"
          aspectRatio="4/3"
        />
      </Link>

      <div className="grow basis-0 text-right text-sm underline md:hidden">
        cart {"(19)"}
      </div>
      {dropdownElement}
    </header>
  );
}
