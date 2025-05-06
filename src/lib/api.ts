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

// Define cache settings for different service methods
const fetchParams: Object = {
  GetHero: {
    cache: "no-store",
  },
  GetProduct: {
    cache: "force-cache",
    next: { tags: ['product'] } // Adding tags for better cache control
  },
  GetArchivesPaged: {
    next: { revalidate: 15 },
  },
};

const requestHandler = async (
  { path, method, body }: RequestHandlerParams,
  { method: serviceMethod }: ProtoMetaParams,
) => {
  const options: RequestInit = {
    method,
    body,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Apply caching parameters from fetchParams
  if (fetchParams[serviceMethod]) {
    Object.assign(options, fetchParams[serviceMethod] as Object);
  }

  console.log(`[BE] Request to ${path} with cache settings:`, options.cache, options.next);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
    options
  );

  console.log("[BE] response: ", response.status, response.statusText);
  // Log cache status if available
  const cacheHeader = response.headers.get('x-vercel-cache');
  if (cacheHeader) {
    console.log(`[BE] Cache status: ${cacheHeader}`);
  }

  return await response.json();
};

export const serviceClient = createFrontendServiceClient(requestHandler);
