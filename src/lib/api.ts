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
    cache: "force-cache",
    next: { revalidate: 15 },
  },
  GetArchivesPaged: {
    next: { revalidate: 15 },
  },
};

const requestHandler = async (
  { path, method, body }: RequestHandlerParams,
  { method: serviceMethod }: ProtoMetaParams,
) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  // Add method-specific headers
  if (serviceMethod === 'GetProduct') {
    headers['Cache-Control'] = 'max-age=300';
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
    {
      method,
      body,
      headers,
      ...(fetchParams[serviceMethod] as Object),
    },
  );

  console.log("[BE] response: ", response.status, response.statusText);

  return await response.json();
};

export const serviceClient = createFrontendServiceClient(requestHandler);
