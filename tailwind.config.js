/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "node_modules/flowbite-react/lib/esm/**/*.js",
  ],
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      primary: "#3490dc", // Replace with your desired color code
      secondary: "#ccc",
      danger: "#e3342f",
    },
  },
  plugins: [require("flowbite/plugin")],
};
