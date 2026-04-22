"use client";

import { cn } from "@/lib/utils";

interface PhaseTabProps {
  label: string;
  date: string;
  count?: number;
  active?: boolean;
  highlight?: boolean;
}

function PhaseTab({ label, date, count = 0, active, highlight }: PhaseTabProps) {
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

import { PHASE_CONFIG } from "@/config/competition";

export function PhaseNavigation({ totals }: { totals: Record<string, number> }) {
  return (
    <div className="bg-white border-y border-border sticky top-[80px] z-20 shadow-sm">
      <div className="max-w-[1600px] mx-auto overflow-x-auto no-scrollbar">
        <div className="flex items-center justify-between min-w-[800px] px-8 py-4">
          <PhaseTab 
            label={PHASE_CONFIG.round_of_16.label} 
            date={PHASE_CONFIG.round_of_16.date} 
            count={totals.round_of_16} 
            active 
          />
          <PhaseDivider />
          <PhaseTab 
            label={PHASE_CONFIG.quarter_finals.label} 
            date={PHASE_CONFIG.quarter_finals.date} 
            count={totals.quarter_finals} 
          />
          <PhaseDivider />
          <PhaseTab 
            label={PHASE_CONFIG.semi_finals.label} 
            date={PHASE_CONFIG.semi_finals.date} 
            count={totals.semi_finals} 
          />
          <PhaseDivider />
          <PhaseTab 
            label={PHASE_CONFIG.final.label} 
            date={PHASE_CONFIG.final.date} 
            count={totals.final} 
            highlight 
          />
          <PhaseDivider />
          <PhaseTab 
            label={PHASE_CONFIG.semi_finals.label} 
            date={PHASE_CONFIG.semi_finals.date} 
            count={totals.semi_finals} 
          />
          <PhaseDivider />
          <PhaseTab 
            label={PHASE_CONFIG.quarter_finals.label} 
            date={PHASE_CONFIG.quarter_finals.date} 
            count={totals.quarter_finals} 
          />
          <PhaseDivider />
          <PhaseTab 
            label={PHASE_CONFIG.round_of_16.label} 
            date={PHASE_CONFIG.round_of_16.date} 
            count={totals.round_of_16} 
            active
          />
        </div>
      </div>
    </div>
  );
}
