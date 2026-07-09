import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        background: "#000000",
        "background-secondary": "#0A0A0A",
        surface: "#101214",
        "surface-secondary": "#181C20",
        border: "#2B3138",
        foreground: "#E8E8E8",
        "foreground-secondary": "#BFC4CA",
        "foreground-muted": "#8A939F",
        "metallic-100": "#BFC4CA",
        "metallic-200": "#707780",
        "metallic-300": "#4A5159",
        primary: {
          DEFAULT: "#101214",
          foreground: "#E8E8E8",
        },
        secondary: {
          DEFAULT: "#181C20",
          foreground: "#E8E8E8",
        },
        destructive: {
          DEFAULT: "#B91C1C",
          foreground: "#E8E8E8",
        },
        muted: {
          DEFAULT: "#181C20",
          foreground: "#8A939F",
        },
        accent: {
          DEFAULT: "#2B3138",
          foreground: "#E8E8E8",
        },
        popover: {
          DEFAULT: "#0A0A0A",
          foreground: "#E8E8E8",
        },
        card: {
          DEFAULT: "#101214",
          foreground: "#E8E8E8",
        },
        sidebar: {
          DEFAULT: "#0A0A0A",
          foreground: "#E8E8E8",
          primary: "#101214",
          "primary-foreground": "#E8E8E8",
          accent: "#181C20",
          "accent-foreground": "#E8E8E8",
          border: "#2B3138",
          ring: "#4A5159",
        },
        ring: "#4A5159",
        input: "#101214",
      },
      fontFamily: {
        sans: ["Space Grotesk", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
        heading: ["Space Grotesk", "system-ui", "sans-serif"],
        bebas: ["Bebas Neue", "cursive"],
      },
      borderRadius: {
        lg: "4px",
        md: "3px",
        sm: "2px",
      },
      boxShadow: {
        "industrial-sm": "0 1px 2px 0 rgba(0, 0, 0, 0.3)",
        "industrial": "0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)",
        "industrial-lg": "0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.4)",
        "industrial-xl": "0 20px 25px -5px rgba(0, 0, 0, 0.6), 0 10px 10px -5px rgba(0, 0, 0, 0.5)",
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
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-slow": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "metallic-sweep": {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "fade-in-slow": "fade-in-slow 0.8s ease-out",
        "slide-up": "slide-up 0.6s ease-out",
        "metallic-sweep": "metallic-sweep 3s linear infinite",
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
