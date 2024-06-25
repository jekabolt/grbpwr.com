import CoreLayout from "@/components/layouts/CoreLayout";
import ConfirmOrderForm from "@/components/forms/OrderDetailsForm";

export default async function Page() {
  return (
    <CoreLayout>
      <h1 className="mb-12 text-3xl">form test fields</h1>
      <ConfirmOrderForm />
    </CoreLayout>
  );
}
