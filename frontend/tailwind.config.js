/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{html,tsx,ts}"],
	theme: {
		extend: {
			colors: {
				light: "#FFC7F9",
				medium: "#79468A",
				dark: "#140428",
				glow: "#DC78FF",
			},
			animation: {
				"infinite-scroll": "infinite-scroll 1s linear infinite",
			},
			keyframes: {
				"infinite-scroll": {
					from: { transform: "translateX(0)" },
					to: { transform: "translateX(100%)" },
				},
			},
		},
	},
	plugins: [],
};
