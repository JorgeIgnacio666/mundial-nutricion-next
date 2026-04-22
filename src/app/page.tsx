"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Mail, Instagram, Youtube, Lock, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { AuthModal } from "@/components/auth-modal";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/Navbar";

type Phase = "round_of_16" | "quarter_finals" | "semi_finals" | "final";

interface MatchupRow {
  id: string;
  phase: Phase;
  position: number;
  specialty_a: string | null;
  specialty_b: string | null;
  opens_at: string;
}

interface VoteRow {
  matchup_id: string;
  user_id: string;
  choice: "a" | "b";
}

export default function BracketPage() {
  const { user } = useAuth();
  const [matchups, setMatchups] = useState<MatchupRow[]>([]);
  const [votes, setVotes] = useState<VoteRow[]>([]);
  const [authOpen, setAuthOpen] = useState(false);
  const [pendingVote, setPendingVote] = useState<{ matchupId: string; choice: "a" | "b" } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    const [{ data: m }, { data: v }] = await Promise.all([
      supabase.from("matchups").select("*").order("phase").order("position"),
      supabase.from("votes").select("matchup_id, user_id, choice"),
    ]);
    setMatchups((m as MatchupRow[]) ?? []);
    setVotes((v as VoteRow[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
    const channel = supabase
      .channel("votes-changes")
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
      await supabase
        .from("votes")
        .delete()
        .eq("matchup_id", matchupId)
        .eq("user_id", user.id);

      const { error } = await supabase
        .from("votes")
        .insert({ matchup_id: matchupId, user_id: user.id, choice });

      if (error) throw error;
      
      toast.success("¡Voto actualizado!");
      fetchAll();
    } catch (error: any) {
      toast.error("No se pudo registrar tu voto: " + error.message);
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
    const totals: Record<Phase, number> = {
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
    const map: Record<Phase, MatchupRow[]> = {
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

  const isPhaseOpen = (phase: Phase) => true;

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

      <section className="relative bg-[#375161] overflow-hidden py-16 sm:py-24 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--color-primary)_0%,_transparent_70%)]" />
        </div>

        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-[11px] uppercase tracking-widest font-bold mb-6">
              <Trophy className="h-3.5 w-3.5" />
              Competición Académica 2026
            </div>
            
            <h1 className="font-display font-black leading-[1.1] tracking-tight text-[clamp(2.5rem,6vw,4.5rem)] mb-6">
              Mundial de <br />
              <span className="text-primary italic">Nutrición Clínica</span>
            </h1>
            
            <p className="max-w-2xl text-white/70 text-lg sm:text-xl font-medium leading-relaxed mb-10">
              Análisis, criterios clínicos y la voz de la comunidad científica para decidir 
              la especialidad líder en evidencia basada para 2026.
            </p>

            <div className="flex gap-4">
               <Button 
                 onClick={() => document.getElementById('bracket-main')?.scrollIntoView({ behavior: 'smooth' })}
                 className="bg-primary hover:bg-primary/90 text-white font-bold py-6 px-8 rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-105"
               >
                 Explorar Especialidades
               </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="bg-white border-y border-border sticky top-[80px] z-20 shadow-sm">
        <div className="max-w-[1600px] mx-auto overflow-x-auto no-scrollbar">
          <div className="flex items-center justify-between min-w-[800px] px-8 py-4">
            <PhaseTab label="Octavos" date="1 de Junio" count={phaseTotals.round_of_16} active />
            <PhaseDivider />
            <PhaseTab label="Cuartos" date="10 de Junio" count={phaseTotals.quarter_finals} />
            <PhaseDivider />
            <PhaseTab label="Semifinal" date="20 de Junio" count={phaseTotals.semi_finals} />
            <PhaseDivider />
            <PhaseTab label="FINAL" date="21 de Junio" count={phaseTotals.final} highlight />
            <PhaseDivider />
            <PhaseTab label="Semifinal" date="20 de Junio" count={phaseTotals.semi_finals} />
            <PhaseDivider />
            <PhaseTab label="Cuartos" date="10 de Junio" count={phaseTotals.quarter_finals} />
            <PhaseDivider />
            <PhaseTab label="Octavos" date="1 de Junio" count={phaseTotals.round_of_16} />
          </div>
        </div>
      </div>

      <main id="bracket-main" className="max-w-[1600px] mx-auto px-4 sm:px-8 py-16">
        {loading ? (
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

            <CenterColumn
              finalMatch={finalMatch}
              tally={tally}
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

      <footer className="bg-[#375161] text-white py-20 px-4 sm:px-8 border-t border-white/5">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6">
              <h3 className="font-display text-2xl font-black tracking-tighter">CELAN</h3>
              <p className="text-white/60 text-sm leading-relaxed max-w-xs">
                Centro Latinoamericano de Nutrición. Formación científica para profesionales de la salud.
              </p>
            </div>

            <div className="space-y-6">
              <h4 className="text-[11px] uppercase tracking-[0.2em] font-black text-white/40">Formación</h4>
              <ul className="space-y-4 text-sm font-bold text-white/80">
                <li><a href="#" className="hover:text-primary transition-colors">Oferta Académica</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Publicaciones</a></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-[11px] uppercase tracking-[0.2em] font-black text-white/40">Institución</h4>
              <ul className="space-y-4 text-sm font-bold text-white/80">
                <li><a href="#" className="hover:text-primary transition-colors">Quiénes somos</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-[11px] uppercase tracking-[0.2em] font-black text-white/40">Contacto</h4>
              <div className="space-y-4">
                <a href="mailto:info@nutricioncelan.com" className="flex items-center gap-3 text-sm font-bold text-white/80 hover:text-primary transition-colors">
                  <Mail className="h-4 w-4" />
                  info@nutricioncelan.com
                </a>
                <div className="flex gap-4 pt-2">
                  <a href="#" className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-all">
                    <Instagram className="h-4 w-4" />
                  </a>
                  <a href="#" className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-all">
                    <Youtube className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-12 border-t border-white/5 flex flex-col sm:flex-row justify-center items-center text-center">
            <p className="text-[11px] font-bold text-white/30 uppercase tracking-widest">
              © 2026 CELAN — Centro Latinoamericano de Nutrición. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </div>
  );
}

function PhaseTab({ label, date, count = 0, active, highlight }: any) {
  return (
    <div className={cn(
      "flex flex-col items-center gap-1 group cursor-default px-4 py-1 rounded-xl transition-all",
      active && "bg-primary/5 shadow-sm border border-primary/10"
    )}>
      <div className="flex items-center gap-2">
        <span className={cn(
          "text-[11px] uppercase tracking-[0.2em] font-black transition-colors",
          active ? "text-primary" : "text-muted-foreground group-hover:text-secondary",
          highlight && "text-primary"
        )}>
          {label}
        </span>
        {count > 0 && (
          <span className={cn(
            "text-[9px] px-1.5 py-0.5 rounded-full font-black border",
            active 
              ? "bg-primary text-white border-primary shadow-sm shadow-primary/20" 
              : "bg-muted text-muted-foreground border-border"
          )}>
            {count}
          </span>
        )}
      </div>
      <span className={cn(
        "text-[10px] font-bold tracking-tight",
        active ? "text-secondary" : "text-muted-foreground/60"
      )}>
        {date}
      </span>
    </div>
  );
}

function PhaseDivider() {
  return <div className="h-8 w-px bg-border mx-2" />
}

function BracketSide({ side, r16, qf, sf, tally, isOpen, onVote }: any) {
  const reverse = side === "right";
  return (
    <div className={cn("flex gap-4 sm:gap-6 min-w-0", reverse && "flex-row-reverse")}>
      <div className="flex flex-col justify-around gap-4 flex-1 min-w-0">
        {r16.map((m: any) => (
          <BracketMatch key={m.id} matchup={m} tally={tally.get(m.id)} isOpen={isOpen("round_of_16") && !!m.specialty_a && !!m.specialty_b} onVote={onVote} />
        ))}
      </div>
      <div className="flex flex-col justify-around gap-4 flex-1 min-w-0">
        {qf.map((m: any) => (
          <BracketMatch key={m.id} matchup={m} tally={tally.get(m.id)} isOpen={isOpen("quarter_finals") && !!m.specialty_a && !!m.specialty_b} onVote={onVote} />
        ))}
      </div>
      <div className="flex flex-col justify-around gap-4 flex-1 min-w-0">
        {sf.map((m: any) => (
          <BracketMatch key={m.id} matchup={m} tally={tally.get(m.id)} isOpen={isOpen("semi_finals") && !!m.specialty_a && !!m.specialty_b} onVote={onVote} />
        ))}
      </div>
    </div>
  );
}

function BracketMatch({ matchup, tally, isOpen, onVote }: any) {
  const showResults = tally?.mine !== undefined;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      className="relative bg-white border border-border/60 rounded-xl overflow-hidden shadow-card hover:shadow-elevated transition-shadow duration-300 flex flex-col group"
    >
      <Slot name={matchup.specialty_a ?? "Por definir"} pct={tally ? Math.round((tally.a / (tally.a+tally.b || 1)) * 100) : 0} chosen={tally?.mine === "a"} showResults={showResults} disabled={!isOpen} onClick={() => onVote(matchup.id, "a")} />
      <div className="h-px bg-border/40 w-[90%] mx-auto" />
      <Slot name={matchup.specialty_b ?? "Por definir"} pct={tally ? Math.round((tally.b / (tally.a+tally.b || 1)) * 100) : 0} chosen={tally?.mine === "b"} showResults={showResults} disabled={!isOpen} onClick={() => onVote(matchup.id, "b")} />
    </motion.div>
  );
}

function Slot({ name, pct, chosen, showResults, disabled, onClick }: any) {
  return (
    <button onClick={onClick} disabled={disabled} className={cn("relative text-left px-4 py-3.5 transition-all group min-h-[52px] flex items-center hover:bg-muted/30", chosen && "bg-primary/5")}>
      {showResults && <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} className={cn("absolute inset-y-0 left-0 opacity-10", chosen ? "bg-primary" : "bg-secondary")} />}
      <div className="relative flex items-center justify-between gap-3 w-full">
        <span className={cn("text-xs sm:text-[13px] font-bold leading-tight line-clamp-2", chosen ? "text-primary" : "text-secondary")}>{name}</span>
        <div className="flex items-center gap-2 shrink-0">
          {showResults && <span className="tabular-nums text-[11px] font-black">{pct}%</span>}
          {chosen && <Check className="h-4 w-4 text-white p-0.5 bg-primary rounded-full" />}
        </div>
      </div>
    </button>
  );
}

function CenterColumn({ finalMatch, tally, isOpen, onVote }: any) {
  const t = finalMatch ? tally.get(finalMatch.id) : undefined;
  const champion = t && t.a > t.b ? finalMatch?.specialty_a : t && t.b > t.a ? finalMatch?.specialty_b : null;

  return (
    <div className="flex flex-col items-center justify-center gap-10 lg:px-6 py-12 lg:py-0 min-w-[240px]">
      <motion.div className="text-center relative">
        <div className="relative mx-auto h-24 w-24 lg:h-32 lg:w-32 rounded-full bg-white flex items-center justify-center shadow-elevated border border-border/50">
          <Trophy className="h-12 w-12 lg:h-16 lg:w-16 text-primary" />
        </div>
        <div className="mt-4 text-[11px] uppercase tracking-[0.3em] text-primary font-black">Cuerpo de Élite</div>
      </motion.div>
      {finalMatch && (
        <div className="w-full max-w-[240px]">
          <BracketMatch matchup={finalMatch} tally={t} isOpen={isOpen} onVote={onVote} />
        </div>
      )}
      <div className="w-full max-w-[240px] text-center">
        <div className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground font-extrabold mb-3">Campeón Mundial</div>
        <div className={cn("border-2 rounded-2xl py-6 px-4 font-display text-base lg:text-lg font-black transition-all", champion ? "border-primary bg-primary text-white" : "border-dashed border-border text-muted-foreground/50")}>
          {champion ?? "Por definir"}
        </div>
      </div>
    </div>
  );
}
