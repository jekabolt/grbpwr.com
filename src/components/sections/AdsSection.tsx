import Image from "next/image";

export default function AdsSection({ ads }: { ads?: any[] }) {
  return (
    <div className="space-y-24">
      <div className="grid grid-cols-2 gap-3">
        {ads?.map((a) =>
          a.contentLink ? (
            <div key={a.contentLink} className="relative col-span-1 h-[600px]">
              <Image
                src={a.contentLink || ""}
                alt="ad hero image"
                fill
                className="object-cover"
              />
            </div>
          ) : null,
        )}
      </div>
      <div className="justify-center bg-black px-8 py-6 text-[232px] font-medium lowercase leading-[208.8px] text-white max-md:mt-10 max-md:max-w-full max-md:px-5 max-md:text-4xl">
        VIEW ALL
      </div>
    </div>
  );
}
