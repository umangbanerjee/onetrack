import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1100px",
      },
    },
    extend: {
      fontFamily: {
        mono: [
          "var(--font-mono)",
          "JetBrains Mono",
          "IBM Plex Mono",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "Liberation Mono",
          "Courier New",
          "monospace",
        ],
        sans: [
          "var(--font-mono)",
          "JetBrains Mono",
          "IBM Plex Mono",
          "ui-monospace",
          "monospace",
        ],
      },
      colors: {
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        canvas: "#fdfcfc",
        "surface-soft": "#f8f7f7",
        "surface-card": "#f1eeee",
        "surface-dark": "#201d1d",
        "surface-dark-elevated": "#302c2c",
        ink: {
          DEFAULT: "#201d1d",
          deep: "#0f0000",
        },
        charcoal: "#302c2c",
        body: "#424245",
        mute: "#646262",
        stone: "#6e6e73",
        ash: "#9a9898",
        hairline: "var(--hairline)",
        "hairline-strong": "#646262",
        accent: {
          DEFAULT: "#007aff",
          hover: "#0056b3",
          active: "#004085",
        },
        warning: {
          DEFAULT: "#ff9f0a",
          hover: "#cc7f08",
          active: "#995f06",
        },
        danger: {
          DEFAULT: "#ff3b30",
          hover: "#d70015",
          active: "#a50011",
        },
        success: {
          DEFAULT: "#30d158",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
      },
      borderRadius: {
        none: "0px",
        sm: "4px",
        DEFAULT: "4px",
        md: "4px",
        lg: "4px",
        xl: "4px",
        "2xl": "4px",
        full: "9999px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
