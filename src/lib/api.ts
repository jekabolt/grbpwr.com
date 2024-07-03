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
    next: {
      revalidate: 15,
    },
  },
  GetProduct: {
    next: {
      revalidate: 15,
    },
  },
  GetProductsPaged: {
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
