"use client";

import { useMutation, useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api-client";

// Market Radar routes serve mock-data/*.json as-is (backend/app/routers/market_radar.py etc.),
// so they aren't in the OpenAPI schema — these types mirror mock-data/README.md.

export type Competitor = {
  platform_id: string;
  platform: string;
  seller: string;
  price: number | null;
  currency: string;
  stock: string;
};

export type CompetitorPrices = {
  product_id: string;
  product_name: string;
  my_cost_price: number;
  my_selling_price: number;
  competitors: Competitor[];
  price_distribution_thb: { min: number; p25: number; median: number; p75: number; max: number };
};

export type MarketTrend = {
  product_id: string;
  product_name: string;
  granularity: string;
  series: { platform: string; points: { week: string; units_sold: number }[] }[];
};

export type KeywordVolume = { keyword: string; platform: string; search_volume: number; trend: "up" | "down" | "stable" };

export type EuArbitrage = {
  product_id: string;
  product_name: string;
  thailand_avg_price_thb: number;
  eu_market: {
    region: string;
    avg_retail_price_eur: number;
    suggested_wholesale_price_eur: number;
    demand_score: number;
    demand_note: string;
  };
};

export type Insight = { insight_id: string; related_product_id: string; tab: string; text: string; generated_at: string };

export type Sponsor = {
  listing_id: string;
  sponsor_name: string;
  sponsor_type: string;
  product_name: string;
  description: string;
  price: number;
  unit: string;
  moq: number;
  cta_link: string;
};

export type Platform = { platform_id: string; name: string; region: string; type: string };

export type Subscription = {
  plans: {
    plan_id: string;
    name: string;
    price_thb_per_month: number;
    trial_days?: number;
    features: string[];
  }[];
  current_user: {
    shop_name: string;
    plan_id: string;
    status: string;
    is_premium: boolean;
    days_left_in_trial: number | null;
    next_billing_date: string | null;
    next_billing_amount_thb: number | null;
    payment_method: { label: string } | null;
    banner: { type: string; message: string } | null;
  };
};

function useMockQuery<T>(key: string, path: string) {
  return useQuery({ queryKey: ["market", key], queryFn: () => apiFetch<T>(path) });
}

export const useCompetitorPrices = () => useMockQuery<CompetitorPrices>("competitor-prices", "/api/market/competitor-prices");
export const useMarketTrend = () => useMockQuery<MarketTrend>("trend", "/api/market/trend");
export const useKeywordVolume = () => useMockQuery<KeywordVolume[]>("keyword-volume", "/api/market/keyword-volume");
export const useEuArbitrage = () => useMockQuery<EuArbitrage[]>("eu-arbitrage", "/api/market/eu-arbitrage");
export const useMarketInsights = () => useMockQuery<Insight[]>("insights", "/api/insights?tab=market_radar");
export const usePlatforms = () => useMockQuery<Platform[]>("platforms", "/api/market/platforms");
export const useSubscription = () => useMockQuery<Subscription>("subscription", "/api/market/subscription");

export function useSponsors(productId: string | undefined) {
  return useQuery({
    queryKey: ["market", "sponsors", productId],
    queryFn: () => apiFetch<Sponsor[]>(`/api/b2b/sponsors/match?product_id=${productId}`),
    enabled: Boolean(productId),
  });
}

export function useAskUBot() {
  return useMutation({
    mutationFn: (body: { question: string; product_id?: string }) =>
      apiFetch<{ answer: string }>("/api/ubot/ask", { method: "POST", body: JSON.stringify(body) }),
  });
}
