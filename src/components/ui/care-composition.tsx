import { Text } from "@/components/ui/text";

const content = ["composition", "care"];

interface Props {
  className?: string;
}

export default function CareComposition({ className }: Props) {
  return (
    <div className={className}>
      {content.map((item) => (
        <div key={item} className="flex h-4 w-56 items-center justify-between">
          <Text variant="uppercase">{item}</Text>
          {/* btn in future */}
          <p className="text-[30px] font-extralight">+</p>
        </div>
      ))}
    </div>
  );
}
