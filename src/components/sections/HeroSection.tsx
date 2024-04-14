import Image from "next/image";

export default function Hero({ contentLink }: any) {
  if (!contentLink) return null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <Image height={600} width={800} src={contentLink} alt="main hero image" />
    </div>
  );
}
