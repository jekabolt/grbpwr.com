"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function QueryWrapper({ children }: { children: React.ReactNode }) {
  // Create QueryClient once per component instance with aggressive caching
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Permanent cache - only revalidate via webhook
            staleTime: Infinity, // Never consider data stale
            gcTime: Infinity, // Keep in cache forever
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            refetchOnReconnect: false,
            retry: 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
