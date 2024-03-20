import Link from "next/link";

export default function Page() {
  return (
    <main>
      <Link href="/catalog" className="hover:underline">
        Catalog
      </Link>
      <h1 className="text-[200px]">Home</h1>
    </main>
  );
}
