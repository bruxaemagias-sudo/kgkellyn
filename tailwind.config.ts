import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: "#4C1B53",
        secondary: "#301E37",
        bege: "#D9D3C7",
        preto: "#0D0D0D",
      },
    },
  },
  plugins: [],
};
export default config;
