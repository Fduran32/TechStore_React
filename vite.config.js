import { configDefaults, defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  base: "/TechStore_React/",
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.js"],
    include: ["src/**/*.test.{js,jsx}"],
    // Las pruebas *.browser.test.jsx corren aparte en Chromium: npm run test:browser
    exclude: [...configDefaults.exclude, "src/**/*.browser.test.{js,jsx}"],
    clearMocks: true,
  },
});
