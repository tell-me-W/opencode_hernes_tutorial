param(
    [Parameter(Mandatory = $true)]
    [string]$ContextPath
)

. "$PSScriptRoot\Harness.Common.ps1"

$context = Read-HarnessContext -Path $ContextPath
$commands = @($context.commands)
$patterns = @(
    "\brm\s+-rf\b",
    "\bgit\s+reset\s+--hard\b",
    "\bgit\s+push\b.*\s--force\b",
    "\bshutdown\b",
    "\bformat\b",
    "(?i)\bdrop\s+database\b",
    "(?i)\btruncate\s+table\b",
    "(?i)\bRemove-Item\b.*\b-Recurse\b.*\b-Force\b",
    "(?i)\bStop-Computer\b",
    "(?i)\bRestart-Computer\b",
    "(?i)\bFormat-Volume\b"
)

$blocked = @()
foreach ($command in $commands) {
    foreach ($pattern in $patterns) {
        if ($command -match $pattern) {
            $blocked += $command
            break
        }
    }
}

if ($blocked.Count -gt 0) {
    Write-Error "BLOCKED: dangerous command requires explicit user approval."
    foreach ($command in $blocked) {
        Write-Error $command
    }
    exit 1
}

Write-HarnessOk "dangerous_cmd_guard ok"
