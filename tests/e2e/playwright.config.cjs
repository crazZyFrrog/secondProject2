const path = require("path");
const { defineConfig, devices } = require("@playwright/test");

const dir = __dirname;
const root = path.join(dir, "..", "..");

module.exports = defineConfig({
  testDir: dir,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: "http://127.0.0.1:5173",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: [
    {
      command: "npm run dev:be:e2e",
      cwd: root,
      url: "http://127.0.0.1:8000/health",
      timeout: 180_000,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: "npm run dev:fe:e2e",
      cwd: root,
      url: "http://127.0.0.1:5173",
      timeout: 180_000,
      reuseExistingServer: !process.env.CI,
    },
  ],
});
