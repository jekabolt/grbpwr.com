import { createFrontendServiceClient } from "@/api/proto-http/frontend";
import { PRODUCT_CACHE_VERSION_TAG } from "@/constants/cacheTags";

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
      cache: 'force-cache',
      tags: [PRODUCT_CACHE_VERSION_TAG],
    },
  },
  GetArchivesPaged: {
    next: { revalidate: 15 },
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

  console.log("[BE] response: ", response.status, response.statusText);

  return await response.json();
};

export const serviceClient = createFrontendServiceClient(requestHandler);
