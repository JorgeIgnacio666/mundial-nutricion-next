"use client"

import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAuthed?: () => void;
}

export function AuthModal({ open, onOpenChange, onAuthed }: AuthModalProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Fixed background password to eliminate friction
    const FIXED_PASSWORD = "celan-guest-password-2026";

    try {
      // 1. Try to sign up
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password: FIXED_PASSWORD,
        options: {
          data: { full_name: name },
        },
      });

      // 2. If it fails (usually because user exists), try to sign in
      if (signUpError) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password: FIXED_PASSWORD,
        });
        if (signInError) throw signInError;
      }
      
      toast.success("¡Bienvenido! Ya puedes emitir tu voto.");
      onAuthed?.();
      onOpenChange(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "No se pudo procesar el registro";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card sm:max-w-md border-border shadow-elevated">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <DialogHeader className="space-y-4">
            <div className="flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                <div className="relative h-16 w-16 rounded-full bg-white border border-border flex items-center justify-center shadow-card">
                   <img src="/logo-icon.png" alt="Logo" className="h-8 w-8" />
                </div>
              </div>
            </div>
            <DialogTitle className="text-center font-display text-2xl font-black text-secondary uppercase tracking-tight">
              Únete al Mundial
            </DialogTitle>
            <DialogDescription className="text-center text-muted-foreground font-medium">
              Ingresa tus datos para registrar tu voto y seguir la competición académica.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[11px] uppercase tracking-widest font-black text-secondary/60 ml-1">
                Nombre completo
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Dr. Juan Pérez"
                className="h-12 border-border focus:ring-primary/20 rounded-xl"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[11px] uppercase tracking-widest font-black text-secondary/60 ml-1">
                Correo
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="doctor@institucion.com"
                className="h-12 border-border focus:ring-primary/20 rounded-xl"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-white h-13 text-base font-black rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-100"
            >
              {loading ? "Registrando voto..." : "Confirmar y Votar"}
            </Button>

            <p className="text-center text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
              Seguridad CELAN — Sin contraseña
            </p>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
