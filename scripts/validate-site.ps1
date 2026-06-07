$ErrorActionPreference = "Stop"

$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$requiredFiles = @(
  "index.html",
  "styles.css",
  "app.js",
  ".nojekyll",
  ".github/workflows/pages.yml",
  "content/index.md",
  "content/00-introduction.md",
  "content/01-getting-started.md",
  "content/02-project-knowledge.md",
  "content/03-harness-setup.md",
  "content/04-phase-workflow.md",
  "content/05-safety-design.md",
  "content/06-practical-workflow.md"
)

$missing = @()
foreach ($file in $requiredFiles) {
  $path = Join-Path $root $file
  if (-not (Test-Path -LiteralPath $path)) {
    $missing += $file
  }
}

if ($missing.Count -gt 0) {
  Write-Error ("Missing required site files: " + ($missing -join ", "))
}

$index = Get-Content -LiteralPath (Join-Path $root "index.html") -Raw -Encoding UTF8
$styles = Get-Content -LiteralPath (Join-Path $root "styles.css") -Raw -Encoding UTF8
$app = Get-Content -LiteralPath (Join-Path $root "app.js") -Raw -Encoding UTF8
$workflow = Get-Content -LiteralPath (Join-Path $root ".github/workflows/pages.yml") -Raw -Encoding UTF8

$checks = @(
  @{ Name = 'Course title landmark'; Passed = $index.Contains('site-title') },
  @{ Name = 'Left navigation landmark'; Passed = $index.Contains('course-nav') },
  @{ Name = 'Center article landmark'; Passed = $index.Contains('lecture-body') },
  @{ Name = 'Right support panel landmark'; Passed = $index.Contains('chapter-support') },
  @{ Name = 'Three-column desktop grid'; Passed = $styles.Contains('grid-template-columns: 296px minmax(0, 1fr) 276px') },
  @{ Name = 'Chapter metadata'; Passed = $app.Contains('00-introduction.md') -and $app.Contains('06-practical-workflow.md') },
  @{ Name = 'Markdown renderer'; Passed = $app.Contains('function renderMarkdown') },
  @{ Name = 'Left nested section navigation'; Passed = $app.Contains('function extractChapterSections') -and $app.Contains('subchapter-list') },
  @{ Name = 'Nested section navigation styles'; Passed = $styles.Contains('.subchapter-list') -and $styles.Contains('.subchapter-link') },
  @{ Name = 'Right body TOC removed'; Passed = -not $index.Contains('section-links') -and -not $index.Contains('본문 목차') -and -not $app.Contains('sectionLinks') -and -not $styles.Contains('#section-links') },
  @{ Name = 'GitHub Pages deployment'; Passed = $workflow.Contains('actions/deploy-pages') }
)

$failed = $checks | Where-Object { -not $_.Passed }
if ($failed.Count -gt 0) {
  foreach ($check in $failed) {
    Write-Error ("Failed check: " + $check.Name)
  }
}

Write-Host "Static site validation passed."
