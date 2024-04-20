"use client";

import { toast } from "sonner";
import { SubmitButton } from "./SubmitButton";

interface FooterFormProps {
  formSubmitClick: (data: FormData) => Promise<void>;
}

export default function FooterForm({ formSubmitClick }: FooterFormProps) {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    try {
      await formSubmitClick(formData);
      toast.success("Subscribed successfully");
    } catch (error) {
      toast.error("Subscribe error occurred");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-1/2 flex-col self-stretch max-md:max-w-full"
    >
      <p className="lowercase leading-3 max-md:max-w-full">
        Subscribe to our newsletter and receive news, information about
        promotions and pleasant surprises from grbpwr.com
      </p>
      <label htmlFor="email" className="mt-6 max-md:max-w-full">
        email
      </label>
      <input
        type="email"
        name="email"
        required
        className="mt-1.5 border-b-2 border-black focus:outline-none max-md:max-w-full"
        aria-label="Email"
        placeholder="us@grbpwr.com"
      />
      <SubmitButton
        text="Subscribe"
        className="mt-6 justify-center self-start whitespace-nowrap bg-black px-12 py-2 text-lg font-medium text-white max-md:px-5"
      />
    </form>
  );
}
