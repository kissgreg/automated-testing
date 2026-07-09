# End-to-end UI and API test framework

### Automated test suite built with **Playwright (TypeScript)**

## 1. Key features

- **UI & API testing:** Handles web UI validation and REST API tests in one framework
- **Reporting:** Grouped page actions and API requests into readable steps to ensure clear hierarchy in test reports
  - **Allure report:** Enhanced contents including attachments
  - **Playwright report:** DOM and network traces to analyze failed runs
- **Environment validation:** `ConfigManager` class to validate environmental configurations before test execution

---

## 2. Tech stack and recommended versions

- **Node version manager:** nvm
- **Runtime:** Node.js v24+ (LTS recommended)
- **Package manager:** NPM v11+
- **Language:** TypeScript v6+
- **Test runner:** Playwright Test v1.61+
- **Reporting:** Allure Playwright, Allure CLI, Playwright HTML Reporter
- **Environment management:** Dotenv

*Note: Local generation and hosting of Allure Reports require **Java 21 (LTS)** installed and configured within the computer's `PATH` and `JAVA_HOME`.*

---

## 3. Local environment setup
Skip this part if Node.js and npm is already installed.
### Follow [this guide](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) to download and install Node.js and npm.

---

## 4. Framework local setup and installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kissgreg/automated-testing.git
   cd automated-testing
   ```

2. **Install project dependencies**
   ```bash
   npm ci
   ```

3. **Configure environment variables**
   
   Create a local .env file as a copy of the example environment file and edit its contents if necessary:
   ```bash
   cp .env.example .env
   ```

---

## 5. Running tests locally

1. **Full test automation suite (headless):**
   ```bash
   npm run test
   ```

2. **Full test automation suite (headed):**
   ```bash
   npm run test:headed
   ```

3. **Generate and open Allure report:**
   ```bash
   npm run report
   ```

4. **Inspect Local Trace Viewer Artifacts (On Failure Only):**
   ```bash
   npx playwright show-report playwright-report
   ```

---

## 6. CI pipeline

The framework contains a continuous integration pipeline in `.github/workflows/tests.yml` executed by GitHub Actions.

On every `push` or `pull_request` to the `main` branch the runner:
1. Starts an ephemeral `ubuntu-latest` virtual environment.
2. Sets up Node.js context and activates the `~/.npm` cache layer (minimizing dependency retrieval overhead).
3. Installs dependencies using `npm ci`.
4. Installs an isolated Playwright Chromium binary with required OS-level packages.
5. Puts target web urls into the process environment context and executes the test suite.
6. Generates the updated Allure report.
7. Deploys the static web output to [GitHub Pages](https://kissgreg.github.io/automated-testing).

### Accessing the report
Once the pipeline finishes, the report is available [here](https://kissgreg.github.io/automated-testing).

---

## 7. Project structure

```text
├── .github/
│   └── workflows/
│       └── tests.yml                    # CI pipeline
├── src/
│   ├── config/
│   │   └── config-manager.ts            # Environment validation and gateway constraints
│   └── pages/                           # Page objects
│       ├── base-page.ts
│       ├── guru99/
│       │   └── guru99.page.ts
│       ├── html-editor/
│       │   └── html-editor.page.ts
│       └── sauce-demo/
│           ├── sauce-checkout.page.ts
│           ├── sauce-inventory.page.ts
│           └── sauce-login.page.ts
├── test/
│   ├── api/
│   │   └── api.spec.ts                  # REST contract & payload schema verification tests
│   ├── e2e/
│   │   ├── guru99.spec.ts               # Guru99 home and testing course pages tests
│   │   ├── html-editor.spec.ts          # Rich Text Editor tests
│   │   └── sauce-demo.spec.ts           # Swag Labs online store web application tests
│   └── resources/
│       └── credential.json              # Test user credentials
├── .env.example                         # Template for local runtime environmental variables
├── .gitignore                           # List of untracked files and directories
├── package-lock.json                    # Locked dependency tree
├── package.json                         # Project dependencies and script tasks
├── playwright.config.ts                 # Configuration of core framework execution constraints
└── tsconfig.json                        # TypeScript compilation parameters and absolute path aliases
```