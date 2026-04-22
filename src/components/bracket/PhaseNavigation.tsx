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

export function PhaseNavigation({ totals }: { totals: Record<string, number> }) {
  return (
    <div className="bg-white border-y border-border sticky top-[80px] z-20 shadow-sm">
      <div className="max-w-[1600px] mx-auto overflow-x-auto no-scrollbar">
        <div className="flex items-center justify-between min-w-[800px] px-8 py-4">
          <PhaseTab label="Octavos" date="1 de Junio" count={totals.round_of_16} active />
          <PhaseDivider />
          <PhaseTab label="Cuartos" date="10 de Junio" count={totals.quarter_finals} />
          <PhaseDivider />
          <PhaseTab label="Semifinal" date="20 de Junio" count={totals.semi_finals} />
          <PhaseDivider />
          <PhaseTab label="FINAL" date="21 de Junio" count={totals.final} highlight />
          <PhaseDivider />
          <PhaseTab label="Semifinal" date="20 de Junio" count={totals.semi_finals} />
          <PhaseDivider />
          <PhaseTab label="Cuartos" date="10 de Junio" count={totals.quarter_finals} />
          <PhaseDivider />
          <PhaseTab label="Octavos" date="1 de Junio" count={totals.round_of_16} />
        </div>
      </div>
    </div>
  );
}
