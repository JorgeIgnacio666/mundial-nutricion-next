"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface SlotProps {
  name: string;
  pct: number;
  count: number;
  chosen: boolean;
  showResults: boolean;
  disabled: boolean;
  onClick: () => void;
}

function Slot({ name, pct, count, chosen, showResults, disabled, onClick }: SlotProps) {
  const isTBD = name === "Por definir";
  
  return (
    <button 
      onClick={onClick} 
      disabled={disabled || isTBD} 
      className={cn(
        "relative text-left px-4 py-3.5 transition-all group min-h-[52px] flex items-center", 
        chosen ? " bg-primary/5" : "hover:bg-muted/30",
        isTBD && "opacity-40 cursor-default"
      )}
    >
      {showResults && !isTBD && (
        <motion.div 
          initial={{ width: 0 }} 
          animate={{ width: `${pct}%` }} 
          className={cn("absolute inset-y-0 left-0 opacity-10", chosen ? "bg-primary" : "bg-secondary")} 
        />
      )}
      <div className="relative flex items-center justify-between gap-3 w-full">
        <span className={cn(
          "text-xs sm:text-[13px] font-bold leading-tight line-clamp-2 transition-colors", 
          chosen ? "text-primary" : isTBD ? "text-muted-foreground italic font-medium" : "text-secondary"
        )}>
          {name}
        </span>
        <div className="flex items-center gap-2 shrink-0">
          {showResults && !isTBD && (
            <div className="flex flex-col items-end leading-none">
              <span className="tabular-nums text-[11px] font-black">{pct}%</span>
              <span className="text-[9px] text-muted-foreground/60 font-bold">{count} {count === 1 ? 'voto' : 'votos'}</span>
            </div>
          )}
          {chosen && <Check className="h-4 w-4 text-white p-0.5 bg-primary rounded-full transition-transform group-hover:scale-110" />}
        </div>
      </div>
    </button>
  );
}

export function MatchupSlot({ matchup, tally, isOpen, onVote }: any) {
  const showResults = tally?.mine !== undefined;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="relative bg-white border border-border/60 rounded-xl overflow-hidden shadow-card hover:shadow-elevated transition-shadow duration-300 flex flex-col group"
    >
      <Slot 
        name={matchup.specialty_a ?? "Por definir"} 
        pct={tally ? Math.round((tally.a / (tally.a + tally.b || 1)) * 100) : 0} 
        count={tally?.a || 0}
        chosen={tally?.mine === "a"} 
        showResults={showResults} 
        disabled={!isOpen} 
        onClick={() => onVote(matchup.id, "a")} 
      />
      
      <div className="h-px bg-border/40 w-[90%] mx-auto" />
      
      <Slot 
        name={matchup.specialty_b ?? "Por definir"} 
        pct={tally ? Math.round((tally.b / (tally.a + tally.b || 1)) * 100) : 0} 
        count={tally?.b || 0}
        chosen={tally?.mine === "b"} 
        showResults={showResults} 
        disabled={!isOpen} 
        onClick={() => onVote(matchup.id, "b")} 
      />
    </motion.div>
  );
}
