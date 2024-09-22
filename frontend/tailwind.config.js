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
				float: "float 5s ease-in-out var(--delay, 0ms) infinite",
			},
			keyframes: {
				"infinite-scroll": {
					from: { transform: "translateX(0)" },
					to: { transform: "translateX(100%)" },
				},
				float: {
					"0%, 100%": { transform: "translateY(0)" },
					"50%": { transform: "translateY(1rem)" },
				},
			},
		},
	},
	plugins: [],
};
