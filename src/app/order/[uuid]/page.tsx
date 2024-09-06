import { serviceClient } from "@/lib/api";

import V0GenUi from "./V0GenUi";

interface Props {
  params: {
    uuid: string;
  };
}

export default async function OrderPage({ params }: Props) {
  const { uuid } = params;

  const response = await serviceClient.GetOrderByUUID({ orderUuid: uuid });

  return (
    <div>
      <V0GenUi orderData={response.order as any} />
    </div>
  );
}
