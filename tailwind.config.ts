import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.25rem",
        sm: "1.5rem",
        lg: "2rem",
      },
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      colors: {
        // Tokens de marca Beauty by Leela (uso directo)
        bl: {
          cream: "var(--bl-cream)",
          marble: "var(--bl-marble)",
          gold: "var(--bl-gold)",
          "gold-deep": "var(--bl-gold-deep)",
          rose: "var(--bl-rose)",
          "rose-soft": "var(--bl-rose-soft)",
          charcoal: "var(--bl-charcoal)",
          muted: "var(--bl-muted)",
          white: "var(--bl-white)",
        },
        // Tokens semánticos (compatibles con shadcn/ui)
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-geist)", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Escala tipográfica fluida (clamp)
        "fluid-sm": "clamp(0.875rem, 0.83rem + 0.22vw, 1rem)",
        "fluid-base": "clamp(1rem, 0.95rem + 0.25vw, 1.125rem)",
        "fluid-lg": "clamp(1.125rem, 1rem + 0.6vw, 1.375rem)",
        "fluid-xl": "clamp(1.375rem, 1.1rem + 1.2vw, 2rem)",
        "fluid-2xl": "clamp(1.75rem, 1.3rem + 2.2vw, 3rem)",
        "fluid-3xl": "clamp(2.25rem, 1.5rem + 3.2vw, 3.75rem)",
        // Tope máximo controlado: no crece sin límite en pantallas anchas
        "fluid-hero": "clamp(2.5rem, 1.6rem + 3.8vw, 5rem)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
