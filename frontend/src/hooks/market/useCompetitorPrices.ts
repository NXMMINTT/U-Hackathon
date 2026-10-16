import { useMockQuery } from "@/hooks/market/useMockQuery";
import type { CompetitorPrices } from "@/types/market";

export const useCompetitorPrices = () => useMockQuery<CompetitorPrices>("competitor-prices", "/api/market/competitor-prices");
