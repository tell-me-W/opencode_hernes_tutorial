param(
    [Parameter(Mandatory = $true)]
    [string]$ContextPath
)

. "$PSScriptRoot\Harness.Common.ps1"

$context = Read-HarnessContext -Path $ContextPath
$phaseFile = [string]$context.phase_file

if ([string]::IsNullOrWhiteSpace($phaseFile) -or -not (Test-Path -LiteralPath $phaseFile)) {
    Block-Harness "BLOCKED: missing phase file $phaseFile"
}

$text = Get-Content -Raw -LiteralPath $phaseFile
$requiredHeadings = @("# Goal", "# Inputs", "# Instructions", "# Done Criteria", "# Verification")
$missing = @($requiredHeadings | Where-Object { $text -notlike "*$_*" })

if ($missing.Count -gt 0) {
    Block-Harness "BLOCKED: phase $phaseFile missing headings: $($missing -join ', ')"
}

Write-HarnessOk "validate_phase ok: $($context.phase)"
