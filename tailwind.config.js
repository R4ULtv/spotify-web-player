/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      inset: {
        "1/8": "12.5%",
      },
      animation: {
        float: "float 20s infinite ease-in-out",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "25%": { transform: "translate(50px, 50px)" },
          "50%": { transform: "translate(50px, -50px)" },
          "75%": { transform: "translate(-50px, 50px)" },
        },
      },
    },
  },
  plugins: [],
};
