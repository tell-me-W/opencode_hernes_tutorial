param(
    [Parameter(Mandatory = $true)]
    [string]$ContextPath
)

. "$PSScriptRoot\Harness.Common.ps1"

$context = Read-HarnessContext -Path $ContextPath

Write-HarnessOk "post_phase ok: $($context.phase)"
