# Opencode Harness Tutorial Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy a GitHub Pages-ready static tutorial site based on `content/*.md`.

**Architecture:** The site is a dependency-free static app. `index.html` provides the shell, `styles.css` provides the reference-inspired three-column UI, `app.js` loads and renders Markdown content, and GitHub Actions publishes the repository to Pages.

**Tech Stack:** HTML, CSS, browser JavaScript, PowerShell validation, GitHub Actions Pages.

---

### Task 1: Static Site Validation

**Files:**
- Create: `scripts/validate-site.ps1`

- [ ] **Step 1: Write the failing validation script**

Create a PowerShell script that requires `index.html`, `styles.css`, `app.js`, `.github/workflows/pages.yml`, `.nojekyll`, and all seven content chapters.

- [ ] **Step 2: Run validation to verify it fails**

Run: `powershell -ExecutionPolicy Bypass -File scripts/validate-site.ps1`
Expected: FAIL because the static site files do not exist yet.

### Task 2: Site Shell And Content App

**Files:**
- Create: `index.html`
- Create: `styles.css`
- Create: `app.js`
- Create: `.nojekyll`

- [ ] **Step 1: Add the HTML shell**

Create the three-column application frame with left navigation, center article, and right chapter support panel.

- [ ] **Step 2: Add the JavaScript app**

Define chapter metadata for `content/index.md` and `content/00-introduction.md` through `content/06-practical-workflow.md`. Fetch Markdown, render the supported syntax, update navigation, and populate the right support panel.

- [ ] **Step 3: Add the CSS**

Style the site to match the supplied reference: warm sidebar, orange current states, centered readable article, sticky side panels, and responsive collapse.

- [ ] **Step 4: Run validation**

Run: `powershell -ExecutionPolicy Bypass -File scripts/validate-site.ps1`
Expected: FAIL until the workflow file is added.

### Task 3: GitHub Actions Pages Deployment

**Files:**
- Create: `.github/workflows/pages.yml`

- [ ] **Step 1: Add Pages workflow**

Create a workflow for pushes to `main` using `actions/configure-pages`, `actions/upload-pages-artifact`, and `actions/deploy-pages`.

- [ ] **Step 2: Run validation**

Run: `powershell -ExecutionPolicy Bypass -File scripts/validate-site.ps1`
Expected: PASS.

### Task 4: Visual Verification And Deploy

**Files:**
- No new files.

- [ ] **Step 1: Serve locally**

Run a local static server from the repository root.

- [ ] **Step 2: Inspect desktop and mobile**

Open the local URL and verify that the three-column layout, content rendering, and responsive behavior work.

- [ ] **Step 3: Commit and push**

Commit the site and push `main` to `origin/main` so GitHub Actions starts deployment.

## Self Review

- The plan covers the requested layout, title, content source, and GitHub Actions deployment.
- There are no `TBD` or `TODO` placeholders.
- Each file has a single clear responsibility.
