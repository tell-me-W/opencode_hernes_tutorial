param(
    [Parameter(Mandatory = $true)]
    [string]$ContextPath
)

. "$PSScriptRoot\..\hooks\Harness.Common.ps1"

$context = Read-HarnessContext -Path $ContextPath

if (-not (Test-Path -LiteralPath "build.xml")) {
    Block-Harness "BLOCKED: build.xml not found. Ant build cannot run."
}

$ant = Get-Command ant -ErrorAction SilentlyContinue
if (-not $ant) {
    Block-Harness "BLOCKED: ant executable not found. Install Ant or add it to PATH."
}

$target = $env:HARNESS_ANT_TARGET
if ([string]::IsNullOrWhiteSpace($target)) {
    & $ant.Source
} else {
    & $ant.Source $target
}

if ($LASTEXITCODE -ne 0) {
    Block-Harness "BLOCKED: Ant build failed after phase $($context.phase). Fix the build before continuing."
}

Write-HarnessOk "success ant_build ok: Ant build passed"
