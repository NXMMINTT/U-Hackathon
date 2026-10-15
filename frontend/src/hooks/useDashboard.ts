"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api-client";
import type { components } from "@/types/api.gen";

type Schemas = components["schemas"];
export type Overview = Schemas["OverviewOut"];
export type TaxMeter = Schemas["TaxMeterOut"];
export type TransactionItem = Schemas["TransactionOut"];
export type ProductItem = Schemas["ProductOut"];
export type TransactionUpdate = Schemas["TransactionUpdateIn"];

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

/** Edit / confirm / cancel a pending transaction; refreshes everything that totals depend on. */
export function useTransactionActions() {
  const queryClient = useQueryClient();
  const onSuccess = () =>
    Promise.all(
      ["transactions", "overview", "tax-meter", "products"].map((key) => queryClient.invalidateQueries({ queryKey: [key] })),
    );
  const post = (action: "confirm" | "cancel") => (id: number) =>
    apiFetch<TransactionItem>(`/api/v1/transactions/${id}/${action}`, { method: "POST" });

  return {
    update: useMutation({
      mutationFn: ({ id, body }: { id: number; body: TransactionUpdate }) =>
        apiFetch<TransactionItem>(`/api/v1/transactions/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
      onSuccess,
    }),
    confirm: useMutation({ mutationFn: post("confirm"), onSuccess }),
    cancel: useMutation({ mutationFn: post("cancel"), onSuccess }),
  };
}
