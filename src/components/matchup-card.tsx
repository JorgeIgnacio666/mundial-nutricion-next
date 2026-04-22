"use client"

import { motion } from "framer-motion";
import { Lock, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type Phase = "round_of_16" | "quarter_finals" | "semi_finals" | "final";

export interface MatchupRow {
  id: string;
  phase: Phase;
  position: number;
  specialty_a: string | null;
  specialty_b: string | null;
  opens_at: string;
}

interface MatchupCardProps {
  matchup: MatchupRow;
  votesA: number;
  votesB: number;
  userChoice: "a" | "b" | null;
  isOpen: boolean;
  onVote: (choice: "a" | "b") => void;
}

export function MatchupCard({
  matchup,
  votesA,
  votesB,
  userChoice,
  isOpen,
  onVote,
}: MatchupCardProps) {
  const total = votesA + votesB;
  const pctA = total ? Math.round((votesA / total) * 100) : 0;
  const pctB = total ? Math.round((votesB / total) * 100) : 0;

  const a = matchup.specialty_a ?? "Por definir";
  const b = matchup.specialty_b ?? "Por definir";

  const showResults = userChoice !== null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4 }}
      className="bg-card border-2 border-border rounded-xl shadow-[var(--shadow-card)] overflow-hidden"
    >
      <div className="px-4 py-2 bg-secondary/95 text-secondary-foreground flex items-center justify-between text-xs uppercase tracking-widest font-medium">
        <span>Match #{matchup.position}</span>
        {!isOpen && (
          <span className="flex items-center gap-1 text-accent">
            <Lock className="h-3 w-3" /> Cerrado
          </span>
        )}
      </div>

      <div className="divide-y divide-border">
        <SideRow
          name={a}
          side="a"
          pct={pctA}
          votes={votesA}
          chosen={userChoice === "a"}
          showResults={showResults}
          disabled={!isOpen || !matchup.specialty_a}
          onClick={() => onVote("a")}
        />
        <div className="relative flex items-center justify-center py-1 bg-muted/40">
          <span className="font-display italic text-sm text-muted-foreground">vs</span>
        </div>
        <SideRow
          name={b}
          side="b"
          pct={pctB}
          votes={votesB}
          chosen={userChoice === "b"}
          showResults={showResults}
          disabled={!isOpen || !matchup.specialty_b}
          onClick={() => onVote("b")}
        />
      </div>

      {showResults && total > 0 && (
        <div className="px-4 py-2 bg-muted/30 text-xs text-muted-foreground text-center">
          {total} {total === 1 ? "voto" : "votos"} totales
        </div>
      )}
    </motion.div>
  );
}

interface SideRowProps {
  name: string;
  side: "a" | "b";
  pct: number;
  votes: number;
  chosen: boolean;
  showResults: boolean;
  disabled: boolean;
  onClick: () => void;
}

function SideRow({ name, pct, chosen, showResults, disabled, onClick }: SideRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative w-full text-left px-4 py-3.5 transition-colors group",
        "hover:bg-primary/5 disabled:hover:bg-transparent",
        chosen && "bg-primary/10",
        disabled && "cursor-not-allowed opacity-70",
      )}
    >
      {showResults && (
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={cn(
            "absolute inset-y-0 left-0",
            chosen ? "bg-primary/20" : "bg-secondary/10",
          )}
        />
      )}
      <div className="relative flex items-center justify-between gap-3">
        <span
          className={cn(
            "font-medium text-sm sm:text-base",
            chosen ? "text-primary" : "text-secondary",
          )}
        >
          {name}
        </span>
        <div className="flex items-center gap-2 shrink-0">
          {showResults && (
            <span
              className={cn(
                "tabular-nums text-sm font-semibold",
                chosen ? "text-primary" : "text-muted-foreground",
              )}
            >
              {pct}%
            </span>
          )}
          {chosen && <Check className="h-4 w-4 text-primary" />}
        </div>
      </div>
    </button>
  );
}
