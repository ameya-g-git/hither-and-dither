import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		proxy: {
			"/api": {
				target: "http://127.0.0.1:4001",
				changeOrigin: true,
				secure: false, // Set to false if you're not using HTTPS
				rewrite: (path) => path.replace(/^\/api/, ""), // Remove /api prefix if your Flask route is not prefixed
			},
		},
		headers: {
			"X-Content-Type-Options": "nosniff", // Protects from improper scripts runnings
			"X-Frame-Options": "DENY", // Stops your site being used as an iframe
		},
	},
});
