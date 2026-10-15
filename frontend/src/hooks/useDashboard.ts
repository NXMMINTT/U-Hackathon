"use client";

import { useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api-client";
import type { components } from "@/types/api.gen";

type Schemas = components["schemas"];
export type Overview = Schemas["OverviewOut"];
export type TaxMeter = Schemas["TaxMeterOut"];
export type TransactionItem = Schemas["TransactionOut"];
export type ProductItem = Schemas["ProductOut"];

export function useOverview() {
  return useQuery({
    queryKey: ["overview"],
    queryFn: () => apiFetch<Overview>("/api/v1/dashboard/overview"),
  });
}

export function useTaxMeter() {
  return useQuery({
    queryKey: ["tax-meter"],
    queryFn: () => apiFetch<TaxMeter>("/api/v1/tax/meter"),
  });
}

export function useTransactions(limit = 50) {
  return useQuery({
    queryKey: ["transactions", limit],
    queryFn: () => apiFetch<TransactionItem[]>(`/api/v1/transactions?limit=${limit}`),
  });
}

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: () => apiFetch<ProductItem[]>("/api/v1/products"),
  });
}
