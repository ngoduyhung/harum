// src/app/react-query.ts
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 phút data được coi là fresh
      cacheTime: 1000 * 60 * 30, // 30 phút data được giữ trong cache
      refetchOnWindowFocus: true, // Tự động fetch lại khi focus vào tab
    },
  },
});
