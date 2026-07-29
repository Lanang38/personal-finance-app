import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          purple: "#6D28D9",
          purpleLight: "#8B5CF6",
          red: "#EF4444",
          blue: "#2563EB",
          orange: "#F97316",
          lime: "#C6F135",
        },
      },
      backgroundImage: {
        "sidebar-gradient": "linear-gradient(180deg, #7C3AED 0%, #4C1D95 100%)",
      },
      borderRadius: {
        xl2: "1.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
