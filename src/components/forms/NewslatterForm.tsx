"use client";

import Input from "@/components/ui/input";
import { SubmitButton } from "./SubmitButton";

type FooterFormProps = {
  formSubmitClick: (data: FormData) => Promise<void>;
};

// todo: add react hook form same as order details form
export default function NewslatterForm({ formSubmitClick }: FooterFormProps) {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    try {
      await formSubmitClick(formData);
    } catch (error) {}
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm">newsletter</p>
      <p className="text-xs">
        subscribe to our newsletter and receive news, information about
        promotions and pleasant surprises from grbpwr.com
      </p>
      <div className="w-full md:w-1/2 lg:w-1/2 xl:w-1/3 2xl:w-1/3">
        <Input
          id="newsletter"
          type="email"
          required
          placeholder="email"
          name="email"
        />
      </div>
      <SubmitButton text="SUBSCRIBE" />
    </form>
  );
}
