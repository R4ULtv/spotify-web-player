/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        spotify: {
          "light-green": "#24ff71",
          green: "#1ED760",
          black: "#121212",
        },
      },
      inset: {
        "1/8": "12.5%",
        "1/16": "6.25%",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
        "6xl": "3rem",
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
