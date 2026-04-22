"use client";

import { Mail, Instagram, Youtube } from "lucide-react";

export function Footer() {
  return (
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
  );
}
