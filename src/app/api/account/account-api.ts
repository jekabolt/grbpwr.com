import { createFrontendServiceClient } from "@/api/proto-http/frontend";


type Handler = Parameters<typeof createFrontendServiceClient>[0];

export function createAccountServiceClient(getAccessToken: () => string | undefined): ReturnType<
    typeof createFrontendServiceClient> {

    const handler: Handler = async (req, meta) => {
        const token = getAccessToken();
        const headers: HeadersInit = {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };

        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${req.path}`, {
            method: req.method,
            body: req.body,
            headers,
        })

        const data = await response.json();
        if (!response.ok) {
            const err = new Error((data?.message as string) || response.statusText) as Error & {
                code?: number;
            };
            err.code = data?.code;
            throw err;
        }

        return data;
    }
    return createFrontendServiceClient(handler);
}