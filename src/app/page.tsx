"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { AuthModal } from "@/components/auth-modal";
import { Navbar } from "@/components/Navbar";
import { toast } from "sonner";

// Domain Components
import { HeroSection } from "@/components/bracket/HeroSection";
import { PhaseNavigation } from "@/components/bracket/PhaseNavigation";
import { BracketSide } from "@/components/bracket/BracketSide";
import { CenterTrophy } from "@/components/bracket/CenterTrophy";
import { Footer } from "@/components/Footer";

// Services
import { BracketService, type Matchup, type Vote, type Phase } from "@/services/bracket-service";

export default function BracketPage() {
  const { user } = useAuth();
  const [matchups, setMatchups] = useState<Matchup[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [authOpen, setAuthOpen] = useState(false);
  const [pendingVote, setPendingVote] = useState<{ matchupId: string; choice: "a" | "b" } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    try {
      const [m, v] = await Promise.all([
        BracketService.getMatchups(),
        BracketService.getVotes(),
      ]);
      setMatchups(m);
      setVotes(v);
    } catch (error) {
      toast.error("Error al cargar datos del mundial.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    
    // Real-time synchronization
    const channel = supabase
      .channel("live-votes")
      .on("postgres_changes", { event: "*", schema: "public", table: "votes" }, fetchAll)
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (user && pendingVote) {
      submitVote(pendingVote.matchupId, pendingVote.choice);
      setPendingVote(null);
    }
  }, [user, pendingVote]);

  const submitVote = async (matchupId: string, choice: "a" | "b") => {
    if (!user) return;
    
    setLoading(true);
    try {
      await BracketService.submitVote(matchupId, user.id, choice);
      toast.success("¡Voto actualizado con éxito!");
      fetchAll();
    } catch (error: any) {
      toast.error("No se pudo registrar tu voto.");
    } finally {
      setLoading(false);
    }
  };

  const handleVote = (matchupId: string, choice: "a" | "b") => {
    if (!user) {
      setPendingVote({ matchupId, choice });
      setAuthOpen(true);
      return;
    }
    submitVote(matchupId, choice);
  };

  const tally = useMemo(() => {
    const map = new Map<string, { a: number; b: number; mine: "a" | "b" | null }>();
    for (const v of votes) {
      const cur = map.get(v.matchup_id) ?? { a: 0, b: 0, mine: null };
      if (v.choice === "a") cur.a++;
      else cur.b++;
      if (user && v.user_id === user.id) cur.mine = v.choice as "a" | "b";
      map.set(v.matchup_id, cur);
    }
    return map;
  }, [votes, user]);

  const phaseTotals = useMemo(() => {
    const totals: Record<string, number> = {
      round_of_16: 0,
      quarter_finals: 0,
      semi_finals: 0,
      final: 0,
    };
    for (const v of votes) {
      const match = matchups.find(m => m.id === v.matchup_id);
      if (match) totals[match.phase]++;
    }
    return totals;
  }, [votes, matchups]);

  const byPhase = useMemo(() => {
    const map: Record<Phase, Matchup[]> = {
      round_of_16: [],
      quarter_finals: [],
      semi_finals: [],
      final: [],
    };
    for (const m of matchups) map[m.phase].push(m);
    for (const k of Object.keys(map) as Phase[]) {
      map[k].sort((a, b) => a.position - b.position);
    }
    return map;
  }, [matchups]);

  // View data chunks
  const isPhaseOpen = (phase: string) => true;
  const left = {
    r16: byPhase.round_of_16.slice(0, 4),
    qf:  byPhase.quarter_finals.slice(0, 2),
    sf:  byPhase.semi_finals.slice(0, 1),
  };
  const right = {
    r16: byPhase.round_of_16.slice(4, 8),
    qf:  byPhase.quarter_finals.slice(2, 4),
    sf:  byPhase.semi_finals.slice(1, 2),
  };
  const finalMatch = byPhase.final[0];

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20">
      <Navbar />
      <HeroSection />
      <PhaseNavigation totals={phaseTotals} />

      <main id="bracket-main" className="max-w-[1600px] mx-auto px-4 sm:px-8 py-16">
        {loading && matchups.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="h-12 w-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            <p className="text-muted-foreground font-medium italic tracking-wide">Analizando evidencia clínica...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-6 lg:gap-4 items-stretch">
            <BracketSide
              side="left"
              r16={left.r16}
              qf={left.qf}
              sf={left.sf}
              tally={tally}
              isOpen={isPhaseOpen}
              onVote={handleVote}
            />

            <CenterTrophy
              finalMatch={finalMatch}
              tally={finalMatch ? tally.get(finalMatch.id) : undefined}
              isOpen={isPhaseOpen("final")}
              onVote={handleVote}
            />

            <BracketSide
              side="right"
              r16={right.r16}
              qf={right.qf}
              sf={right.sf}
              tally={tally}
              isOpen={isPhaseOpen}
              onVote={handleVote}
            />
          </div>
        )}
      </main>

      <Footer />
      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </div>
  );
}
