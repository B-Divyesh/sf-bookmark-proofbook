import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/extension',
  timeout: 30_000,
  workers: 1,
  webServer: {
    command: 'npm run build:site && node scripts/serve-site.mjs',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: false,
  },
});
