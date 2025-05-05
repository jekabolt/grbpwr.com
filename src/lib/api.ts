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
      tags: [PRODUCT_CACHE_TAG],
      revalidate: 15
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
  // Add cache headers in the response
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
    {
      method,
      body,
      ...(fetchParams[serviceMethod] as Object),
    },
  );

  console.log("[BE] response: ", response.status, response.statusText);

  // Log cache status for debugging
  const cacheStatus = response.headers.get('x-vercel-cache');
  if (cacheStatus) {
    console.log("[Cache Status]:", cacheStatus, "for", serviceMethod);
  }

  return await response.json();
};

export const serviceClient = createFrontendServiceClient(requestHandler);
