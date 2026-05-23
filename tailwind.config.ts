import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "#0A0A0A",
        surface: "#0D0D0D",
        border: "#111111",
        ghost: "rgba(255,255,255,0.06)",
        cream: "#F5F0E8",
        electric: "#C8FF00",
        muted: "rgba(255,255,255,0.45)",
        caption: "rgba(255,255,255,0.25)",
      },
      fontFamily: {
        display: ["var(--font-cormorant)", "serif"],
        heading: ["var(--font-bebas)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
}

export default config