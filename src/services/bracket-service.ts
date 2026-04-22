import { supabase } from "@/integrations/supabase/client";

export type Phase = "round_of_16" | "quarter_finals" | "semi_finals" | "final";

export interface Matchup {
  id: string;
  phase: Phase;
  position: number;
  specialty_a: string | null;
  specialty_b: string | null;
  opens_at: string;
}

export interface Vote {
  matchup_id: string;
  user_id: string;
  choice: "a" | "b";
}

export const BracketService = {
  async getMatchups(): Promise<Matchup[]> {
    const { data, error } = await supabase
      .from("matchups")
      .select("*")
      .order("phase")
      .order("position");
    
    if (error) {
      console.error("[Error-Sentinel] Matchups fetch failed:", error);
      throw error;
    }
    return data as Matchup[];
  },

  async getVotes(): Promise<Vote[]> {
    const { data, error } = await supabase
      .from("votes")
      .select("matchup_id, user_id, choice");
    
    if (error) {
      console.error("[Error-Sentinel] Votes fetch failed:", error);
      throw error;
    }
    return data as Vote[];
  },

  async submitVote(matchupId: string, userId: string, choice: "a" | "b") {
    try {
      // Clean up previous vote
      await supabase
        .from("votes")
        .delete()
        .eq("matchup_id", matchupId)
        .eq("user_id", userId);

      const { data, error } = await supabase
        .from("votes")
        .insert({
          matchup_id: matchupId,
          user_id: userId,
          choice: choice
        });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("[Error-Sentinel] Submit vote failed for match:", matchupId, error);
      throw error;
    }
  }
};
