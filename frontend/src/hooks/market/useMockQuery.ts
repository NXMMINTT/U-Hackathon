"use client";

import { useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api-client";

export function useMockQuery<T>(key: string, path: string) {
  return useQuery({ queryKey: ["market", key], queryFn: () => apiFetch<T>(path) });
}
