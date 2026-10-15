"use client";

import { useQuery } from "@tanstack/react-query";

import { checkHealth } from "@/lib/api-client";

export function useApiHealth() {
  return useQuery({
    queryKey: ["api-health"],
    queryFn: checkHealth,
    retry: false,
  });
}
