import Link from "next/link";

export default function Page() {
  return (
    <main>
      <div className="flex flex-col gap-2">
        <Link href="/catalog/Warsaw" className="hover:underline">
          Warsaw
        </Link>
        <Link href="/catalog/Paris" className="hover:underline">
          Paris
        </Link>
      </div>
      <h1 className="text-[200px]">Categories</h1>
    </main>
  );
}
