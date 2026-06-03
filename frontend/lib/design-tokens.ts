export const designTokens = {
  color: {
    background: {
      base: "#fff7ed",
      rose: "#fff1f2",
      lilac: "#eef2ff",
      mint: "#ecfeff",
      ink: "#070816"
    },
    brand: {
      primary: "#4f46e5",
      accent: "#f59e0b",
      navy: "#0f172a",
      glow: "rgba(245, 158, 11, 0.28)"
    },
    semantic: {
      success: "#16a34a",
      warning: "#d97706",
      error: "#dc2626",
      info: "#2563eb"
    },
    text: {
      primary: "#0f172a",
      secondary: "#475569",
      muted: "#64748b",
      inverse: "#fffaf3"
    }
  },
  typography: {
    display: { size: "clamp(3rem, 7vw, 5.75rem)", weight: 800, lineHeight: 0.96 },
    h1: { size: "clamp(2.5rem, 5vw, 4.5rem)", weight: 800, lineHeight: 1 },
    h2: { size: "clamp(2rem, 3.5vw, 3rem)", weight: 750, lineHeight: 1.08 },
    h3: { size: "2rem", weight: 700, lineHeight: 1.2 },
    body: { size: "1rem", weight: 400, lineHeight: 1.7 },
    label: { size: "0.75rem", weight: 700, letterSpacing: "0.12em" }
  },
  spacing: {
    1: "4px",
    2: "8px",
    3: "12px",
    4: "16px",
    5: "20px",
    6: "24px",
    8: "32px",
    10: "40px",
    12: "48px",
    16: "64px",
    20: "80px",
    24: "96px",
    32: "128px"
  },
  radius: {
    sm: "8px",
    md: "12px",
    card: "20px",
    xl: "28px",
    full: "9999px"
  },
  shadow: {
    glowSm: "0 0 24px rgba(245, 158, 11, 0.16)",
    glowMd: "0 0 48px rgba(79, 70, 229, 0.22)",
    panel: "0 28px 80px rgba(15, 23, 42, 0.16)",
    darkPanel: "0 28px 90px rgba(2, 6, 23, 0.36)"
  }
} as const;

export type DesignTokens = typeof designTokens;
