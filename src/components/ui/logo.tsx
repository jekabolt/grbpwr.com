import Image from "@/components/ui/image";

export function Logo() {
  return (
    <div className="mx-auto mb-4 size-8 lg:mx-[inherit]">
      <Image src={"/grbpwr-logo.webp"} alt="grpwr logo" aspectRatio="1/1" />
    </div>
  );
}
