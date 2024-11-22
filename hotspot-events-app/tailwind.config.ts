import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        flame: 'flame 1.5s infinite',
        'slide-in': 'slideIn 1.3s ease-out forwards',
        'gradient-flow': 'gradient-flow 5s ease-in-out infinite',
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      keyframes: {
        flame: {
          '0%': {
            transform: 'scale(1)',
            opacity: '1',
          },
          '50%': {
            transform: 'scale(1.2)',
            opacity: '0.8',
          },
          '100%': {
            transform: 'scale(1)',
            opacity: '1',
          },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)', opacity: '1' },
          '100%': { transform: 'translateX(0)', opacity: '2' },
        },
      },
    },
  },
  plugins: [],
};

export default config; 
