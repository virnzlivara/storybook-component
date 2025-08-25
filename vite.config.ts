import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // ✅ enables Tailwind v4 in Vite (no postcss.config.js needed)
  ],
});
