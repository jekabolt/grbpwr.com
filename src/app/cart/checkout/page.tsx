import CoreLayout from "@/components/layouts/CoreLayout";
import ConfirmOrderForm from "@/components/forms/CheckoutForm";

export default async function Page() {
  return (
    <CoreLayout>
      <ConfirmOrderForm />
    </CoreLayout>
  );
}
