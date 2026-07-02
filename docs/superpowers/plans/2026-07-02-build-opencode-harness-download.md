# build-opencode-harness ZIP Download Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a directly downloadable `build-opencode-harness.zip` to the tutorial's PART 1 page.

**Architecture:** Package the existing `.opencode/skills/build-opencode-harness/` directory as a static site artifact under `downloads/`. Extend the existing PowerShell site validator to inspect the link, renderer behavior, ZIP structure, excluded metadata, and bundled phase skills.

**Tech Stack:** Static HTML/JavaScript, Markdown content, PowerShell validation, ZIP archive

---

### Task 1: Add failing download validation

**Files:**
- Modify: `scripts/validate-site.ps1`
- Test: `scripts/validate-site.ps1`

- [ ] **Step 1: Add assertions for the ZIP contract**

Add `downloads/build-opencode-harness.zip` to `$requiredFiles`. Load PART 1 and assert that it links to the archive. Assert that `app.js` recognizes local ZIP links and emits a `download` attribute. Open the ZIP with `System.IO.Compression.ZipFile`, then assert:

```powershell
$zipEntries -contains 'build-opencode-harness/SKILL.md'
$zipEntries -contains 'build-opencode-harness/assets/harness-template/.opencode/skills/make-phase/SKILL.md'
$zipEntries -contains 'build-opencode-harness/assets/harness-template/.opencode/skills/run-phase/SKILL.md'
-not ($zipEntries -match 'agents/openai.yaml')
```

Extract the two bundled phase skills to a temporary directory and compare their file paths and SHA-256 hashes with `.opencode/skills/make-phase/` and `.opencode/skills/run-phase/`, excluding `agents/openai.yaml`.

- [ ] **Step 2: Run validation and verify RED**

Run:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/validate-site.ps1
```

Expected: FAIL because `downloads/build-opencode-harness.zip` and its PART 1 link do not exist.

### Task 2: Create the archive and page link

**Files:**
- Create: `downloads/build-opencode-harness.zip`
- Modify: `content/01-getting-started.md`
- Modify: `app.js`

- [ ] **Step 1: Generate the ZIP from the approved skill source**

Copy `.opencode/skills/build-opencode-harness/` into a temporary `build-opencode-harness/` directory and create:

```powershell
Compress-Archive -LiteralPath "$temp/build-opencode-harness" -DestinationPath 'downloads/build-opencode-harness.zip'
```

The source no longer contains `agents/openai.yaml`, so the generated archive must not contain it.

- [ ] **Step 2: Add the PART 1 download link**

Place this directly after the four-layer introduction in `content/01-getting-started.md`:

```markdown
[build-opencode-harness skill 다운로드 (.zip)](downloads/build-opencode-harness.zip)
```

- [ ] **Step 3: Render local ZIP links as downloads**

Before the external-link fallback in `renderMarkdownLink`, add:

```javascript
if (/^(?:\.\.\/)?downloads\/[A-Za-z0-9._-]+\.zip$/.test(href)) {
  return `<a href="${escapeHtml(href)}" download>${label}</a>`;
}
```

- [ ] **Step 4: Run validation and verify GREEN**

Run:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/validate-site.ps1
```

Expected: `Static site validation passed.`

### Task 3: Final artifact verification

**Files:**
- Verify: `downloads/build-opencode-harness.zip`
- Verify: `content/01-getting-started.md`
- Verify: `app.js`

- [ ] **Step 1: Check the repository diff**

Run:

```powershell
git diff --check
git status --short
```

Expected: no whitespace errors; existing user-owned changes remain present.

- [ ] **Step 2: Re-run the complete site validator**

Run:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/validate-site.ps1
```

Expected: `Static site validation passed.` with exit code 0.
