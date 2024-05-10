import Image from "@/components/global/Image";

export default function Hero({ contentLink }: any) {
  if (!contentLink) return null;

  return (
    // todo: rework + change bg color
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <div className="h-[600px] w-[800px]">
        <Image src={contentLink} alt="main hero image" aspectRatio="4/3" />
      </div>
    </div>
  );
}
