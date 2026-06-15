# Contributing to Talos 🤝

First off, thank you for taking the time to contribute! Contributions from the engineering community are what make open-source developer operations tools like Talos thrive.

By contributing to Talos, you agree to abide by our standards and follow the guidelines outlined below to ensure high-quality, maintainable, and secure software.

---

## 🗺️ Monorepo Development Guide

Talos is managed as a monorepo using **pnpm workspaces**. It is split into two primary segments:
1.  `packages/sdk`: The TypeScript telemetry capture client.
2.  `apps/web`: The Next.js dashboard and api relays.

### Local Development Environment Setup
1.  **Fork and Clone** the repository:
    ```bash
    git clone https://github.com/your-username/Talos.git
    cd Talos
    ```
2.  **Enable Corepack** to activate the correct package manager:
    ```bash
    corepack enable
    ```
3.  **Install Monorepo Dependencies**:
    ```bash
    corepack pnpm install
    ```
4.  **Setup Environment Variables**:
    ```bash
    cp apps/web/.env.example apps/web/.env.local
    ```
5.  **Build packages & Launch Dev Server**:
    Because the Next.js web application references the local `@mylife-as-miles/talos-sdk` package in the workspace, you must build the SDK first:
    ```bash
    # Build SDK
    corepack pnpm --filter @mylife-as-miles/talos-sdk build

    # Start dev server
    corepack pnpm dev
    ```

---

## 🛠️ Contribution Workflow

### 1. Branch Naming Conventions
Always create a descriptive feature or bugfix branch off `main`. We enforce standard semantic naming prefixes:
*   `feat/` - New features or capabilities (e.g. `feat/slack-integration`)
*   `fix/` - Defect resolution (e.g. `fix/sdk-window-exception-handler`)
*   `docs/` - Documentation updates (e.g. `docs/add-splunk-setup-screenshots`)
*   `chore/` - Tooling, configuration, or dependency updates (e.g. `chore/upgrade-nextjs`)

```bash
git checkout -b feat/your-feature-name
```

### 2. Code Quality & Standards
*   **TypeScript**: We strictly require type safety. Avoid using `any`. Write explicit interfaces and return signatures.
*   **Neubrutalist UI**: Any additions to the dashboard should align with the neubrutalist UI design tokens (black `border-[3px]`, loud flat primary backgrounds like `#d8ff2f`, `#00c2c8`, and shadow displacements like `shadow-[4px_4px_0_#000]`).
*   **Decoupling**: Keep the SDK core decoupled from browser-only APIs where possible, compiling target exports for both browser and Node.js environments.

---

## 🧪 Testing & Verification

Before committing any changes, run the following verification pipeline locally:

### Run TypeScript Verification
Verify that compiler rules, type declarations, and package schemas compile successfully:
```bash
corepack pnpm typecheck
```

### Build Verification
Ensure that both packages build successfully without locking issues:
```bash
corepack pnpm build
```

---

## 📝 Commit Guidelines

We enforce the **Conventional Commits** specification. This ensures a clean, automated changelog generation and version tagging history.

Format commit messages as:
```text
<type>(<scope>): <short description>

[optional body]

[optional footer(s)]
```

### Allowed Types:
*   `feat`: A new user-facing feature.
*   `fix`: A bug resolution.
*   `docs`: Documentation-only changes.
*   `style`: Code styling (white-space, formatting, semicolons - no logic changes).
*   `refactor`: Code changes that neither fix a bug nor add a feature.
*   `perf`: Performance optimization changes.
*   `test`: Adding or correcting tests.
*   `chore`: Workspace infrastructure or dependency configurations.

### Examples:
```text
feat(sdk): add local storage backup for offline client events
fix(web): prevent dashboard crash when reports database is empty
docs(root): update Splunk HEC ingest instructions
```

---

## 🚀 Submitting a Pull Request (PR)

1.  **Push** your branch to your forked remote repository.
2.  Navigate to the upstream repository on GitHub and click **New Pull Request**.
3.  Fill out the PR description with:
    *   *Summary of Changes*: High-level list of adjustments.
    *   *Testing Performed*: How did you verify the changes locally? (e.g. unit tests, manual ingest verification).
    *   *Linked Issues*: Reference any active issue numbers resolved by this PR (e.g. `Closes #45`).
4.  Ensure that all automated CI checks (linters, typecheckers, and test runs) pass.
5.  Wait for review from core SRE developers!

---

## ⚖️ License
By contributing to Talos, you agree that your contributions will be licensed under the project's [MIT License](file:///c:/Users/MILES/Documents/Talos/LICENSE).
