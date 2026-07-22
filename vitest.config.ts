import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    // Vercel sets NODE_ENV=production during builds; force test so React
    // resolves the development build (React.act) for Testing Library.
    env: {
      NODE_ENV: "test",
    },
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    css: false,
    testTimeout: 15_000,
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.{test,spec}.{ts,tsx}",
        "src/test/**",
        "src/lib/nomis/types.ts",
        "src/components/ui/**",
        "src/app/layout.tsx",
        "src/app/globals.css",
      ],
    },
  },
});
