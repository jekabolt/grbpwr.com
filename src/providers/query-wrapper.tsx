"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function QueryWrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
