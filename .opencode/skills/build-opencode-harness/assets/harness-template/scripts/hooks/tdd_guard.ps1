param(
    [string]$ContextPath
)

. "$PSScriptRoot\Harness.Common.ps1"

$implementationSuffixes = @(".js", ".jsx", ".ts", ".tsx", ".java", ".kt", ".py", ".go", ".rs", ".cs", ".ps1")
$testHints = @("test", "spec", "__tests__", "tests")

function Test-HarnessTestPath {
    param([string]$Path)

    $lowered = $Path.ToLowerInvariant()
    foreach ($hint in $testHints) {
        if ($lowered.Contains($hint)) {
            return $true
        }
    }
    return $false
}

$files = Get-HarnessChangedFiles
$implementationFiles = @()
$testFiles = @()

foreach ($file in $files) {
    $extension = [System.IO.Path]::GetExtension($file)
    if (Test-HarnessTestPath -Path $file) {
        $testFiles += $file
    } elseif ($implementationSuffixes -contains $extension) {
        $implementationFiles += $file
    }
}

if ($implementationFiles.Count -gt 0 -and $testFiles.Count -eq 0) {
    Write-Error "BLOCKED: implementation files changed but no test files changed."
    foreach ($file in $implementationFiles) {
        Write-Error "- $file"
    }
    exit 1
}

Write-HarnessOk "tdd_guard ok"
