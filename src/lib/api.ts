import { createFrontendServiceClient } from "@/api/proto-http/frontend";
import { ARCHIVES_CACHE_TAG, HERO_CACHE_TAG, PRODUCTS_CACHE_TAG } from "@/constants";

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
    next: {
      tags: [HERO_CACHE_TAG],
    },
  },
  GetProduct: {
    next: {
      tags: [PRODUCTS_CACHE_TAG],
    },
  },
  // GetProductsPaged: {
  //   next: {
  //     tags: [PRODUCTS_CACHE_TAG],
  //   },
  // },
  GetArchive: {
    next: {
      tags: [ARCHIVES_CACHE_TAG],
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

  console.log("[BE] response: ", response.status, response.statusText);

  return await response.json();
};

export const serviceClient = createFrontendServiceClient(requestHandler);
