import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

declare const process: { env: Record<string, string | undefined> };

const isVercel = !!process.env.VERCEL;

export default defineConfig({
  resolve: {
    alias: {
      "#": "/src",
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    // Only include Cloudflare plugin when NOT building on Vercel
    ...(isVercel ? [] : [cloudflare()]),
  ],
});
