$ErrorActionPreference = "Stop"

$requiredFiles = @(
  "index.html",
  "styles.css",
  "app.js",
  "README.md",
  ".github/workflows/pages.yml"
)

$requiredChapters = @(
  "intro",
  "prerequisites",
  "opencode-concepts",
  "skill-install",
  "result-tree",
  "project-brain",
  "project-brain-templates",
  "agents-md",
  "phase-workflow",
  "phase-design-lab",
  "runner",
  "safety-hooks",
  "harness-skill",
  "review-skill",
  "troubleshooting",
  "practice",
  "facilitator-guide",
  "team-rollout"
)

$requiredMarkers = @(
  "SESSION-INTRO-2H",
  "OpenCode searches these locations",
  "permission.skill",
  "COPY-PREFLIGHT",
  "PRD-WORKSHEET",
  "PHASE-DESIGN-LAB",
  "TROUBLESHOOTING-ORDER",
  "FACILITATOR-RUNBOOK"
)

foreach ($file in $requiredFiles) {
  if (-not (Test-Path -LiteralPath $file)) {
    throw "Missing required file: $file"
  }
}

$html = Get-Content -LiteralPath "index.html" -Raw
$css = Get-Content -LiteralPath "styles.css" -Raw
$app = Get-Content -LiteralPath "app.js" -Raw
$workflow = Get-Content -LiteralPath ".github/workflows/pages.yml" -Raw

foreach ($chapter in $requiredChapters) {
  if (-not $app.Contains("id: `"$chapter`"")) {
    throw "Missing curriculum chapter: $chapter"
  }
}

foreach ($marker in $requiredMarkers) {
  if (-not $app.Contains($marker)) {
    throw "Missing curriculum content marker: $marker"
  }
}

$matches = [regex]::Matches($html, 'href="#([^"]+)"')
foreach ($match in $matches) {
  $anchor = $match.Groups[1].Value
  if (-not $html.Contains("id=`"$anchor`"") -and -not $app.Contains("id: `"$anchor`"")) {
    throw "Broken internal anchor: #$anchor"
  }
}

if (-not $html.Contains("OpenCode Harness Tutorial")) {
  throw "HTML title is missing the tutorial name"
}

if (-not $css.Contains("--accent") -or -not $css.Contains("@media")) {
  throw "CSS must define theme tokens and responsive behavior"
}

if (-not $workflow.Contains("actions/deploy-pages@v4")) {
  throw "GitHub Pages workflow must deploy with deploy-pages@v4"
}

Write-Host "Site validation passed."
