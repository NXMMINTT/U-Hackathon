import { useMockQuery } from "@/hooks/market/useMockQuery";
import type { KeywordVolume } from "@/types/market";

export const useKeywordVolume = () => useMockQuery<KeywordVolume[]>("keyword-volume", "/api/market/keyword-volume");
