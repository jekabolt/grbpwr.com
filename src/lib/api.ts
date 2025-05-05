import { createFrontendServiceClient } from "@/api/proto-http/frontend";
import { PRODUCT_CACHE_TAG } from "@/constants";

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
  params?: any;
}

const fetchParams: Object = {
  GetHero: {
    cache: "no-store",
  },
  GetProduct: {
    next: {
      tags: [PRODUCT_CACHE_TAG]
    }
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
  const cacheOptions = fetchParams[serviceMethod] as Object || {};

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
    {
      method,
      body,
      ...cacheOptions,
    },
  );

  console.log("[BE] response: ", response.status, response.statusText);

  return await response.json();
};

export const serviceClient = createFrontendServiceClient(requestHandler);
