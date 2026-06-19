param()

$required = @(
    "Harness.Common.ps1",
    "pre_phase.ps1",
    "validate_phase.ps1",
    "post_phase.ps1",
    "dangerous_cmd_guard.ps1",
    "tdd_guard.ps1",
    "circuit_breaker.ps1"
)

foreach ($file in $required) {
    $path = Join-Path $PSScriptRoot $file
    if (-not (Test-Path -LiteralPath $path)) {
        Write-Error "BLOCKED: missing hook file $file"
        exit 1
    }
}

foreach ($script in Get-ChildItem -LiteralPath $PSScriptRoot -Filter "*.ps1") {
    $tokens = $null
    $errors = $null
    [System.Management.Automation.PSParser]::Tokenize((Get-Content -Raw -LiteralPath $script.FullName), [ref]$errors) | Out-Null
    if ($errors.Count -gt 0) {
        Write-Error "BLOCKED: PowerShell syntax error in $($script.Name): $($errors[0].Message)"
        exit 1
    }
}

$successDir = Join-Path (Split-Path -Parent $PSScriptRoot) "success"
$antBuild = Join-Path $successDir "ant_build.ps1"
if (-not (Test-Path -LiteralPath $antBuild)) {
    Write-Error "BLOCKED: missing success hook ant_build.ps1"
    exit 1
}

foreach ($script in Get-ChildItem -LiteralPath $successDir -Filter "*.ps1") {
    $tokens = $null
    $errors = $null
    [System.Management.Automation.PSParser]::Tokenize((Get-Content -Raw -LiteralPath $script.FullName), [ref]$errors) | Out-Null
    if ($errors.Count -gt 0) {
        Write-Error "BLOCKED: PowerShell syntax error in $($script.Name): $($errors[0].Message)"
        exit 1
    }
}

. "$PSScriptRoot\Harness.Common.ps1"
Write-HarnessOk "check ok: PowerShell hooks and success hooks are present and parseable"
