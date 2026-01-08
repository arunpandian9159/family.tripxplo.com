import type { Config } from "tailwindcss";

const config = {
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
      screens: {
        xs: "375px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
      colors: {
        emerald: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#1ec089",
          600: "#16a373",
          700: "#15805c",
          800: "#16654c",
          900: "#145341",
        },
        // App specific color aliases
        "app-primary": "#1EC089",
        "app-secondary": "#1EC089",
        "app-emerald": "#1EC089",
        // Semantic colors
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
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "DM Sans", "system-ui", "sans-serif"],
        display: ["Plus Jakarta Sans", "DM Sans", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-xl": [
          "4.5rem",
          { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" },
        ],
        "display-lg": [
          "3.5rem",
          { lineHeight: "1.15", letterSpacing: "-0.02em", fontWeight: "700" },
        ],
        "display-md": [
          "2.5rem",
          { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "600" },
        ],
        "display-sm": [
          "1.875rem",
          { lineHeight: "1.3", letterSpacing: "-0.01em", fontWeight: "600" },
        ],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
      },
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "128": "32rem",
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
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px 0 rgba(30, 192, 137, 0.4)" },
          "50%": { boxShadow: "0 0 35px 8px rgba(30, 192, 137, 0.6)" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-down": {
          from: { opacity: "0", transform: "translateY(-20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        wave: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(30, 192, 137, 0.5)" },
          "50%": { boxShadow: "0 0 0 20px rgba(30, 192, 137, 0)" },
        },
        "bounce-subtle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        "bounce-in": {
          "0%": { transform: "translateY(-100%) scale(0.8)", opacity: "0" },
          "50%": { transform: "translateY(10%) scale(1.02)", opacity: "1" },
          "100%": { transform: "translateY(0) scale(1)", opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        float: "float 5s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "slide-up": "slide-up 0.5s ease-out forwards",
        "slide-down": "slide-down 0.5s ease-out forwards",
        "fade-in": "fade-in 0.4s ease-out forwards",
        "scale-in": "scale-in 0.3s ease-out forwards",
        shimmer: "shimmer 1.5s infinite",
        wave: "wave 2s ease-in-out infinite",
        "bounce-subtle": "bounce-subtle 2s ease-in-out infinite",
        "bounce-in": "bounce-in 0.5s ease-out forwards",
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.1)",
        "glow-emerald": "0 0 40px -8px rgba(30, 192, 137, 0.35)",
        card: "0 4px 20px -2px rgba(0, 0, 0, 0.06)",
        "card-hover": "0 12px 40px -8px rgba(0, 0, 0, 0.12)",
        button: "0 4px 14px -2px rgba(30, 192, 137, 0.25)",
        "button-emerald": "0 4px 14px -2px rgba(30, 192, 137, 0.25)",
        // Legacy shadows
        pkgShadow: "4px 8px 25.8px 0px rgba(0, 0, 0, 0.06)",
        "pkg-imgShadow": "2px 4px 13.2px 0px rgba(0, 0, 0, 0.06)",
        goldShadow: "7px 3px 13px 0px rgba(0, 0, 0, 0.22)",
        bookingOverviewShadow: "4px 8px 39.7px 0px rgba(30, 192, 137, 0.15)",
      },
      backgroundImage: {
        "gradient-emerald": "linear-gradient(135deg, #1EC089 0%, #34D399 100%)",
        "gradient-sunset":
          "linear-gradient(135deg, #FF8F78 0%, #1EC089 50%, #ED4242 100%)",
        "gradient-ocean":
          "linear-gradient(135deg, #34D399 0%, #1EC089 50%, #16A373 100%)",
        "gradient-mesh":
          "radial-gradient(at 40% 20%, hsla(0, 100%, 69%, 0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(160, 55%, 44%, 0.1) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(0, 100%, 69%, 0.1) 0px, transparent 50%)",
        // Legacy gradients
        goldGradient:
          "linear-gradient(75deg, #EF831E -0.94%, rgba(255, 215, 72, 1.00) 49.26%, rgba(246, 129, 21, 0.94) 109.25%)",
        silverGradient:
          "linear-gradient(75deg, #727B85 -0.94%, rgba(190, 198, 207, 1.00) 49.26%, rgba(73, 80, 88, 0.94) 109.25%)",
        platinumGradient:
          "linear-gradient(75deg, #CA0B0B -0.94%, rgba(255, 77, 87, 1.00) 49.26%, rgba(219, 13, 13, 0.94) 109.25%)",
      },
      transitionTimingFunction: {
        "bounce-in": "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
