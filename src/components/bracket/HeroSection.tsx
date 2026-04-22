"use client";

import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { APP_CONFIG } from "@/config/competition";

export function HeroSection() {
  return (
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
            {APP_CONFIG.brand.tagline}
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
  );
}
