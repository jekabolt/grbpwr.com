import * as Checkbox from "@radix-ui/react-checkbox";

export default function CheckboxGlobal({
  id,
  label,
  name,
  ...props
}: {
  id: string;
  label: string;
  name: string;
  [k: string]: any;
}) {
  return (
    <div className="flex items-center">
      <Checkbox.Root
        className="flex h-[12px] w-[12px] appearance-none items-center justify-center border border-textColor"
        id={id}
        name={name}
        {...props}
      >
        <Checkbox.Indicator className="h-full w-full bg-textColor"></Checkbox.Indicator>
      </Checkbox.Root>
      <label className="ml-3 leading-3" htmlFor={id}>
        {label}
      </label>
    </div>
  );
}
