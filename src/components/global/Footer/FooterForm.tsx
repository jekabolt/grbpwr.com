"use client";

import { SubmitButton } from "./SubmitButton";

type FooterFormProps = {
  formSubmitClick: (data: FormData) => Promise<void>;
};

export default function FooterForm({ formSubmitClick }: FooterFormProps) {
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
      <label htmlFor="email">email</label>
      <input
        type="email"
        name="email"
        required
        className=""
        aria-label="Email"
        placeholder="us@grbpwr.com"
      />
      <SubmitButton
        text="subscribe"
        className="block w-36 bg-textColor px-1.5 text-center text-sm text-buttonTextColor"
      />
    </form>
  );
}
