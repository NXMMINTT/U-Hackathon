"use client";

import { useMutation, useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api-client";
import type { KnowledgeTopic, TopicScript } from "@/types/knowledge";

/** The knowledge library (title, category, outline) — served from mock data, no AI cost. */
export function useKnowledgeTopics() {
  return useQuery({
    queryKey: ["knowledge", "topics"],
    queryFn: () => apiFetch<KnowledgeTopic[]>("/api/knowledge/topics"),
    staleTime: 60 * 60 * 1000,
  });
}

/** On-demand: U-Bot writes a short briefing for one topic (Gemini, cached on the server). */
export function useTopicScript() {
  return useMutation({
    mutationFn: (topicId: string) => apiFetch<TopicScript>(`/api/knowledge/topics/${topicId}/script`),
  });
}
