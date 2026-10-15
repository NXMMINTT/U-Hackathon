import { useMockQuery } from "@/hooks/market/useMockQuery";
import type { MarketTrend } from "@/types/market";

export const useMarketTrend = () => useMockQuery<MarketTrend>("trend", "/api/market/trend");
