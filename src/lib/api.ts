import { createFrontendServiceClient } from "../api/proto-http/frontend";

interface requestHandlerParams {
  path: string;
  method: string;
  body?: any;
}

const requestHandler = async ({ path, method, body }: requestHandlerParams) => {
  const response = await fetch(`${process.env.BACKEND_URL}/${path}`, {
    method,
    body,
    // next: {
    //   revalidate: 15,
    // },
  });

  return await response.json();
};

export const serviceClient = createFrontendServiceClient(requestHandler);
