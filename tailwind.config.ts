import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FFF8E7",
        primary: "#4CAF50",
        accent: "#6EC6FF",
      },
      fontFamily: {
        display: ["var(--font-nunito)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 8px 24px rgba(76, 175, 80, 0.2)",
        softBlue: "0 8px 24px rgba(110, 198, 255, 0.25)",
      },
      animation: {
        sparkle: "sparkle 0.6s ease-out forwards",
        bounceRetry: "bounceRetry 0.5s ease-in-out",
        scaleSuccess: "scaleSuccess 0.35s ease-out",
      },
      keyframes: {
        sparkle: {
          "0%": { opacity: "0", transform: "scale(0.8)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        bounceRetry: {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-8px)" },
          "75%": { transform: "translateX(8px)" },
        },
        scaleSuccess: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.04)" },
          "100%": { transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
