"use client";

import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { MatchupSlot } from "./MatchupSlot";

interface CenterTrophyProps {
  finalMatch?: any;
  tally?: any;
  isOpen?: boolean;
  onVote: (matchupId: string, choice: "a" | "b") => void;
}

export function CenterTrophy({ finalMatch, tally, isOpen, onVote }: CenterTrophyProps) {
  const champion = tally && tally.a > tally.b 
    ? finalMatch?.specialty_a 
    : tally && tally.b > tally.a 
      ? finalMatch?.specialty_b 
      : null;

  return (
    <div className="flex flex-col items-center justify-center gap-10 lg:px-6 py-12 lg:py-0 min-w-[240px]">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center relative"
      >
        <div className="relative mx-auto h-24 w-24 lg:h-32 lg:w-32 rounded-full bg-white flex items-center justify-center shadow-elevated border border-border/50">
          <Trophy className="h-12 w-12 lg:h-16 lg:w-16 text-primary" />
        </div>
      </motion.div>

      {finalMatch && (
        <div className="w-full max-w-[240px]">
          <MatchupSlot 
            matchup={finalMatch} 
            tally={tally} 
            isOpen={isOpen} 
            onVote={onVote} 
          />
        </div>
      )}

      <div className="w-full max-w-[240px] text-center">
        <div className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground font-extrabold mb-3">
          Campeón Mundial
        </div>
        <motion.div 
          animate={champion ? { scale: [1, 1.05, 1] } : {}}
          className={cn(
            "border-2 rounded-2xl py-6 px-4 font-display text-base lg:text-lg font-black transition-all",
            champion 
              ? "border-primary bg-primary text-white shadow-lg shadow-primary/20" 
              : "border-dashed border-border text-muted-foreground/50"
          )}
        >
          {champion ?? "Por definir"}
        </motion.div>
      </div>
    </div>
  );
}
