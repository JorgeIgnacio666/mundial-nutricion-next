export const PHASE_CONFIG = {
  round_of_16: {
    label: "Octavos",
    date: "1 de Junio",
    order: 1
  },
  quarter_finals: {
    label: "Cuartos",
    date: "10 de Junio",
    order: 2
  },
  semi_finals: {
    label: "Semifinal",
    date: "20 de Junio",
    order: 3
  },
  final: {
    label: "FINAL",
    date: "21 de Junio",
    order: 4
  }
} as const;

export type CompetitionPhase = keyof typeof PHASE_CONFIG;

export const APP_CONFIG = {
  brand: {
    name: "CELAN",
    fullName: "Centro Latinoamericano de Nutrición",
    eventTitle: "Mundial de Nutrición Clínica 2026",
    tagline: "¿Qué área en nutrición clínica ganará? Tu lo decides. Únete al mundial de nutrición clínica y haz ganar a tu especialidad favorita.",
  },
  contact: {
    email: "info@nutricioncelan.com",
    instagram: "#",
    youtube: "#"
  }
};
