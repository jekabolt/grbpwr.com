"use client";

import Checkbox from "@/components/ui/Checkbox";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import InputMask from "../ui/InputMask";
import { SubmitButton } from "./SubmitButton";

export default function ConfirmOrderForm() {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {};

  return (
    // todo: change to react-hook form
    <form onSubmit={handleSubmit} className="space-y-10">
      <Input label="some label" type="email" placeholder="email" name="email" />
      <InputMask
        mask="__/__"
        label="some label (mm/yy)"
        type="text"
        placeholder="mm/yy"
        name="expiration date"
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
