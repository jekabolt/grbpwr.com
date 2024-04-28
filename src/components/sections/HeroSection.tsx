import Image from "next/image";

export default function Hero({ contentLink }: any) {
  if (!contentLink) return null;

  return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <Image height={300} width={400} src={contentLink} alt="main hero image" />
    </div>
  );
}
