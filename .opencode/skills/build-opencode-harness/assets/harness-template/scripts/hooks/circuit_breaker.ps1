param(
    [Parameter(Mandatory = $true)]
    [string]$ContextPath
)

. "$PSScriptRoot\Harness.Common.ps1"

$limit = 5
$context = Read-HarnessContext -Path $ContextPath
$taskDir = [string]$context.task_dir
$statePath = Join-Path $taskDir "state.json"

if ([string]::IsNullOrWhiteSpace($taskDir) -or -not (Test-Path -LiteralPath $statePath)) {
    Write-HarnessOk "circuit_breaker ok"
    exit 0
}

$state = Get-Content -Raw -LiteralPath $statePath | ConvertFrom-Json
$failures = @($state.failures)
if ($failures.Count -eq 0) {
    Write-HarnessOk "circuit_breaker ok"
    exit 0
}

$current = $failures[-1]
$same = @($failures | Where-Object { $_.command -eq $current.command -and $_.hook -eq $current.hook })

if ($same.Count -ge $limit) {
    Block-Harness "BLOCKED: same failure repeated too often. Change strategy before retrying."
}

Write-HarnessOk "circuit_breaker ok"
