import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        talos: {
          bg: "#07090d",
          panel: "#10141c",
          panel2: "#151b24",
          line: "#27303d",
          muted: "#8996a8",
          text: "#edf2f7",
          bronze: "#c4935d",
          cyan: "#38d4ff",
          danger: "#ff5c7a"
        }
      },
      boxShadow: {
        panel: "0 18px 80px rgba(0,0,0,.35)"
      }
    }
  },
  plugins: []
};

export default config;
