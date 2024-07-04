import CoreLayout from "@/components/layouts/CoreLayout";
import ConfirmOrderForm from "@/components/forms/OrderDetailsForm";

export default async function Page() {
  return (
    <CoreLayout>
      <ConfirmOrderForm />
    </CoreLayout>
  );
}
