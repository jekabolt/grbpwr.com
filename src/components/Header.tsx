import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="backdrop-md sticky top-0 p-5 backdrop-blur-md">
      <Link href="/">
        <Image
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/6b8a4874b5cca3f5bc9a1f31add3e5664b819b7c32a62ec7ea0fdc1a1ca1a6b6?apiKey=2bd386ac58de4a4f9e996607125fc961&"
          height={40}
          width={40}
          alt="logo"
        />
      </Link>
    </header>
  );
}
