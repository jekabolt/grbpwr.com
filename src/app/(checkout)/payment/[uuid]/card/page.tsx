import { serviceClient } from "@/lib/api";

import StripeSecureCardForm from "./_components/stripe-card-form";

export default async function Page(props: Props) {
  const uuid = (await props.params).uuid;
  const clientSecret = (await props.searchParams).clientSecret;

  console.log("clientSecret", clientSecret);
  console.log("uuid", uuid);

  //   {
  //     "orderUuid": "f66d65c9-f1f2-4726-bf54-019e697661e5",
  //     "orderStatus": "ORDER_STATUS_ENUM_PLACED",
  //     "expiredAt": "2024-12-15T13:55:23.000680195Z",
  //     "payment": {
  //         "paymentMethod": "PAYMENT_METHOD_NAME_ENUM_CARD_TEST",
  //         "transactionId": "",
  //         "transactionAmount": {
  //             "value": "11"
  //         },
  //         "transactionAmountPaymentCurrency": {
  //             "value": "11"
  //         },
  //         "payer": "",
  //         "payee": "",
  //         "clientSecret": "pi_3QWII3P97IsmiR4D166nc7Qs_secret_2rdu3urK7FOenb3PDMcLbhmD6",
  //         "isTransactionDone": false
  //     }
  // }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-8">
        <div className="rounded-lg bg-gray-100 p-6 shadow-md">
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="mb-2 text-xl font-semibold">Order Details</h2>
              <p className="text-sm text-gray-600">Order ID:</p>
              <p className="break-all font-mono text-sm">{uuid}</p>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">Stripe Token:</p>
              <p className="break-all font-mono text-sm">{clientSecret}</p>
            </div>
          </div>
        </div>
      </div>
      {/* <StripeSecureCardForm clientSecret={clientSecret} /> */}
    </div>
  );
}

interface Props {
  params: {
    uuid: string;
  };
  searchParams: {
    clientSecret: string;
  };
}
