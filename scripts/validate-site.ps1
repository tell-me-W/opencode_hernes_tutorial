$ErrorActionPreference = "Stop"

$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$requiredFiles = @(
  "index.html",
  "styles.css",
  "app.js",
  ".nojekyll",
  "downloads/build-opencode-harness.zip",
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
$part1 = Get-Content -LiteralPath (Join-Path $root "content/01-getting-started.md") -Raw -Encoding UTF8
$part6 = Get-Content -LiteralPath (Join-Path $root "content/06-practical-workflow.md") -Raw -Encoding UTF8
$contentIndex = Get-Content -LiteralPath (Join-Path $root "content/index.md") -Raw -Encoding UTF8

Add-Type -AssemblyName System.IO.Compression.FileSystem

function Get-NormalizedTextHash {
  param([string]$Path)

  $content = [System.IO.File]::ReadAllText($Path).Replace("`r`n", "`n")
  $bytes = [System.Text.Encoding]::UTF8.GetBytes($content)
  $sha256 = [System.Security.Cryptography.SHA256]::Create()
  try {
    return ([System.BitConverter]::ToString($sha256.ComputeHash($bytes))).Replace('-', '')
  }
  finally {
    $sha256.Dispose()
  }
}

function Get-TreeHashMap {
  param([string]$Path)

  $files = @{}
  Get-ChildItem -LiteralPath $Path -File -Recurse | ForEach-Object {
    $relativePath = $_.FullName.Substring($Path.Length + 1).Replace('\', '/')
    if ($relativePath -ne 'agents/openai.yaml') {
      $files[$relativePath] = Get-NormalizedTextHash -Path $_.FullName
    }
  }
  return $files
}

function Test-MatchingTrees {
  param(
    [string]$ExpectedPath,
    [string]$ActualPath
  )

  $expected = Get-TreeHashMap -Path $ExpectedPath
  $actual = Get-TreeHashMap -Path $ActualPath
  $allPaths = @($expected.Keys + $actual.Keys | Sort-Object -Unique)
  foreach ($relativePath in $allPaths) {
    if (-not $expected.ContainsKey($relativePath) -or
        -not $actual.ContainsKey($relativePath) -or
        $expected[$relativePath] -ne $actual[$relativePath]) {
      return $false
    }
  }
  return $true
}

$zipPath = Join-Path $root "downloads/build-opencode-harness.zip"
$extractRoot = Join-Path ([System.IO.Path]::GetTempPath()) ("build-opencode-harness-validation-" + [guid]::NewGuid())
$zipEntries = @()
$phaseSkillsMatch = $false
$zipExcludesOpenAiMetadata = $false

try {
  $archive = [System.IO.Compression.ZipFile]::OpenRead($zipPath)
  try {
    $zipEntries = @($archive.Entries | ForEach-Object { $_.FullName.Replace('\', '/') })
  }
  finally {
    $archive.Dispose()
  }

  [System.IO.Compression.ZipFile]::ExtractToDirectory($zipPath, $extractRoot)
  $sourceSkills = Join-Path $root ".opencode/skills"
  $bundledSkills = Join-Path $extractRoot "build-opencode-harness/assets/harness-template/.opencode/skills"
  $phaseSkillsMatch =
    (Test-MatchingTrees -ExpectedPath (Join-Path $sourceSkills "make-phase") -ActualPath (Join-Path $bundledSkills "make-phase")) -and
    (Test-MatchingTrees -ExpectedPath (Join-Path $sourceSkills "run-phase") -ActualPath (Join-Path $bundledSkills "run-phase"))
  $zipExcludesOpenAiMetadata = -not ($zipEntries | Where-Object { $_ -match '(^|/)agents/openai\.yaml$' })
}
finally {
  if (Test-Path -LiteralPath $extractRoot) {
    Remove-Item -LiteralPath $extractRoot -Recurse -Force
  }
}

function Get-MarkdownSectionHeadings {
  param([string]$Markdown)

  $headings = @()
  $inCodeFence = $false
  foreach ($line in ($Markdown -replace "`r`n", "`n" -split "`n")) {
    $trimmed = $line.Trim()
    if ($trimmed -match '^```') {
      $inCodeFence = -not $inCodeFence
      continue
    }

    if ($inCodeFence) {
      continue
    }

    if ($trimmed -match '^##\s+([^#].+)$') {
      $headings += $Matches[1].Trim()
    }
  }

  return $headings
}

$part6Sections = Get-MarkdownSectionHeadings -Markdown $part6
$localMarkdownLinksRoute = $contentIndex.Contains('(00-introduction.md)') -and $app.Contains('function renderMarkdownLink') -and $app.Contains('const localMarkdown =') -and $app.Contains('href="#') -and $app.Contains('chapterId')
$skillDownloadWorks = $part1.Contains('(downloads/build-opencode-harness.zip)') -and $app.Contains('download>${label}</a>')

$part3CommandsMatch = $app.Contains('python -m py_compile scripts/execute.py scripts/hooks/*.py') -and $app.Contains('powershell -NoProfile -ExecutionPolicy Bypass -File scripts/hooks/check.ps1') -and -not $app.Contains('python -m pytest scripts/test_execute.py -q')

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
  @{ Name = 'Local markdown chapter links route through hash navigation'; Passed = $localMarkdownLinksRoute },
  @{ Name = 'PART 1 links the harness skill ZIP'; Passed = $skillDownloadWorks },
  @{ Name = 'Harness ZIP contains the skill entrypoint'; Passed = $zipEntries -contains 'build-opencode-harness/SKILL.md' },
  @{ Name = 'Harness ZIP contains make-phase'; Passed = $zipEntries -contains 'build-opencode-harness/assets/harness-template/.opencode/skills/make-phase/SKILL.md' },
  @{ Name = 'Harness ZIP contains run-phase'; Passed = $zipEntries -contains 'build-opencode-harness/assets/harness-template/.opencode/skills/run-phase/SKILL.md' },
  @{ Name = 'Bundled phase skills match project skills'; Passed = $phaseSkillsMatch },
  @{ Name = 'Harness ZIP excludes OpenAI metadata'; Passed = $zipExcludesOpenAiMetadata },
  @{ Name = 'Part 3 support panel mirrors install validation commands'; Passed = $part3CommandsMatch },
  @{ Name = 'Right body TOC removed'; Passed = -not $index.Contains('section-links') -and -not $index.Contains('본문 목차') -and -not $app.Contains('sectionLinks') -and -not $styles.Contains('#section-links') },
  @{ Name = 'Part 6 sidebar sections ignore code fences'; Passed = $app.Contains('inCodeFence') -and $part6Sections.Count -eq 5 -and -not ($part6Sections -contains 'Findings') -and -not ($part6Sections -contains 'Summary') }
)

$failed = $checks | Where-Object { -not $_.Passed }
if ($failed.Count -gt 0) {
  foreach ($check in $failed) {
    Write-Error ("Failed check: " + $check.Name)
  }
}

Write-Host "Static site validation passed."
