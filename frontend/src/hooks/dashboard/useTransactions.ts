"use client";

import { useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api-client";
import type { TransactionItem } from "@/types/dashboard";

export function useTransactions(limit = 50) {
  return useQuery({
    queryKey: ["transactions", limit],
    queryFn: () => apiFetch<TransactionItem[]>(`/api/v1/transactions?limit=${limit}`),
  });
}
