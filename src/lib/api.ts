import { createFrontendServiceClient } from "@/api/proto-http/frontend";

type Object = {
  [key: string]: unknown;
};

interface RequestHandlerParams {
  path: string;
  method: string;
  body: string | null;
}

interface ProtoMetaParams {
  service: string;
  method: string;
}

const fetchParams: Object = {
  GetHero: {
    cache: "no-store",
  },
  GetProduct: {
    next: {
      revalidate: 15,
    },
  },
  GetArchivesPaged: {
    next: {
      revalidate: 15,
    },
  },
};

const requestHandler = async (
  { path, method, body }: RequestHandlerParams,
  { method: serviceMethod }: ProtoMetaParams,
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
    {
      method,
      body,
      ...(fetchParams[serviceMethod] as Object),
    },
  );

  return await response.json();
};

export const serviceClient = createFrontendServiceClient(requestHandler);

async function fetchValidateItems(
  shipmentCarrierId: number | undefined,
  promoCode: string | undefined,
) {
  const url = "http://localhost:3000/api/validate-items/";
  //const headers = { "Content-Type": "application/json" };
  const body = JSON.stringify({
    shipmentCarrierId,
    promoCode,
  });

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });
    //console.log(response);
    const data = await response.json();

    return data;
  } catch (error) {
    //console.log(error);
    return null; // or handle error more specifically if needed
  }
}

export default fetchValidateItems;
