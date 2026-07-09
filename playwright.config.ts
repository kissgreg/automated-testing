import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './test',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // disabled to ensure fast CI runs
  retries: 0,
  workers: process.env.CI ? 2 : undefined,
  
  reporter: [
    ['list'],
    [
      'html', 
      { 
        open: 'never',
        outputFolder: 'playwright-report' 
      }
    ],
    [
      'allure-playwright', 
      { 
        detail: true, 
        outputFolder: 'allure-results' 
      }
    ]
  ],

  use: {
    trace: 'retain-on-failure', 
    screenshot: 'only-on-failure',
    video: 'off', // disabled to conserve CI runner disk space - trace viewer provides sufficient info on failed tests
  },

  projects: [
    {
      name: 'End-to-end UI and API tests',
      use: { ...devices['Desktop Chrome'] },
    }
  ],
});