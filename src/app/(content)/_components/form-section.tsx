import { Text } from "@/components/ui/text";

export default function FormSection({
  step,
  title,
  children,
}: {
  step: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-start gap-6">
      <div className="flex items-center gap-8">
        <Text>{step}</Text>
        <Text variant="uppercase">{title}</Text>
      </div>
      <div className="w-full lg:pl-14">{children}</div>
    </div>
  );
}
