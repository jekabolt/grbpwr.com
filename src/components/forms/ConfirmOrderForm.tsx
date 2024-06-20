"use client";

import Input from "@/components/ui/Input";
import Checkbox from "@/components/ui/Checkbox";
import Select from "@/components/ui/Select";
import { SubmitButton } from "./SubmitButton";
import { Label } from "@radix-ui/react-select";

export default function NewslatterForm() {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {};

  return (
    // todo: change to react-hook form
    <form onSubmit={handleSubmit} className="space-y-10">
      <Input
        label="some label:"
        type="email"
        placeholder="email"
        name="email"
      />
      <Checkbox name="newsletter" label="subscribe to our newsletter" />
      <Select
        name="country"
        label="country/region:"
        items={[
          { label: "Sweden", value: "sweden" },
          { label: "Norway", value: "norway" },
          { label: "Denmark", value: "denmark" },
          { label: "Finland", value: "finland" },
          { label: "Iceland", value: "iceland" },
          { label: "Ireland", value: "ireland" },
        ]}
      />
      <SubmitButton text="subscribe" />
    </form>
  );
}
