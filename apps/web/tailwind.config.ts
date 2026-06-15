import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        talos: {
          bg: "#f5f1dc",
          panel: "#fffdf1",
          panel2: "#d8ff2f",
          line: "#000000",
          muted: "#3d3d3d",
          text: "#000000",
          bronze: "#ffe600",
          cyan: "#00c2c8",
          danger: "#ff4d5a"
        }
      },
      boxShadow: {
        panel: "8px 8px 0 #000000"
      }
    }
  },
  plugins: []
};

export default config;
