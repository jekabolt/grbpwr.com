import * as Checkbox from "@radix-ui/react-checkbox";

export default function CheckboxGlobal({
  name,
  ...props
}: {
  name: string;
  [k: string]: unknown;
}) {
  console.log("props111");
  console.log(props);
  return (
    <Checkbox.Root
      className="flex h-3 w-3 flex-none appearance-none items-center justify-center border border-textColor"
      id={name}
      name={name}
      {...props}
    >
      <Checkbox.Indicator className="h-full w-full bg-textColor"></Checkbox.Indicator>
    </Checkbox.Root>
  );
}
