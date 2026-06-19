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

Write-HarnessOk "pre_phase ok: $($context.phase)"
