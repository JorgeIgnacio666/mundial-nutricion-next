"use client";

import { cn } from "@/lib/utils";
import { MatchupSlot } from "./MatchupSlot";

interface BracketSideProps {
  side: "left" | "right";
  r16: any[];
  qf: any[];
  sf: any[];
  tally: Map<string, any>;
  isOpen: (phase: string) => boolean;
  onVote: (matchupId: string, choice: "a" | "b") => void;
}

export function BracketSide({ side, r16, qf, sf, tally, isOpen, onVote }: BracketSideProps) {
  const reverse = side === "right";
  
  return (
    <div className={cn("flex gap-4 sm:gap-6 min-w-0", reverse && "flex-row-reverse")}>
      <div className="flex flex-col justify-around gap-4 flex-1 min-w-0">
        {r16.map((m: any) => (
          <MatchupSlot 
            key={m.id} 
            matchup={m} 
            tally={tally.get(m.id)} 
            isOpen={isOpen("round_of_16") && !!m.specialty_a && !!m.specialty_b} 
            onVote={onVote} 
          />
        ))}
      </div>
      
      <div className="flex flex-col justify-around gap-4 flex-1 min-w-0">
        {qf.map((m: any) => (
          <MatchupSlot 
            key={m.id} 
            matchup={m} 
            tally={tally.get(m.id)} 
            isOpen={isOpen("quarter_finals") && !!m.specialty_a && !!m.specialty_b} 
            onVote={onVote} 
          />
        ))}
      </div>
      
      <div className="flex flex-col justify-around gap-4 flex-1 min-w-0">
        {sf.map((m: any) => (
          <MatchupSlot 
            key={m.id} 
            matchup={m} 
            tally={tally.get(m.id)} 
            isOpen={isOpen("semi_finals") && !!m.specialty_a && !!m.specialty_b} 
            onVote={onVote} 
          />
        ))}
      </div>
    </div>
  );
}
