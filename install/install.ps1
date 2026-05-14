<#
  Founder OS for Claude — one-command installer (Windows / PowerShell)

    irm https://raw.githubusercontent.com/aadhib/founder-os-for-claude/main/install/install.ps1 | iex

  WHAT THIS SCRIPT DOES — and nothing else:
    1. Refuses to run elevated (Founder OS never needs Administrator).
    2. Checks that Node.js 18+ and a package runner (npx/pnpm/bun) exist.
    3. Prints the exact command it is about to run.
    4. Runs `<runner> founder-os@latest install --from-bootstrap`.

  It downloads NOTHING else, writes NO files itself, and uses NO temp
  directories. All real work is done by the `founder-os` npm package, whose
  source is public and auditable.

  Prefer not to pipe to a shell? Use the npm path directly:
    npx founder-os@latest install
#>

[CmdletBinding()]
param(
  [switch]$Yes,
  [switch]$DryRun,
  [switch]$Force
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

$Repo = 'aadhib/founder-os-for-claude'
$Pkg  = 'founder-os@latest'

function Write-Step($m) { Write-Host "> $m" -ForegroundColor Magenta }
function Write-Ok($m)   { Write-Host "OK $m" -ForegroundColor Green }
function Write-Warn($m) { Write-Host "!  $m" -ForegroundColor Yellow }
function Write-Die($m)  { Write-Host "x  $m" -ForegroundColor Red; exit 1 }

function Show-Banner {
  Write-Host ''
  Write-Host '  ===========================================' -ForegroundColor Magenta
  Write-Host '          F O U N D E R   O S              '   -ForegroundColor Magenta
  Write-Host '      the AI operating system for          '   -ForegroundColor Magenta
  Write-Host '      founders, CTOs and product builders  '   -ForegroundColor Magenta
  Write-Host '  ===========================================' -ForegroundColor Magenta
  Write-Host ''
}

function Test-Command($name) {
  return [bool](Get-Command $name -ErrorAction SilentlyContinue)
}

function Assert-NotElevated {
  try {
    $id = [System.Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object System.Security.Principal.WindowsPrincipal($id)
    if ($principal.IsInRole([System.Security.Principal.WindowsBuiltInRole]::Administrator)) {
      Write-Die 'Do not run this installer as Administrator. Founder OS only writes to your user profile and never needs elevation.'
    }
  } catch {
    # If the check itself fails, continue — we are not elevating anything.
  }
}

function Get-Runner {
  if (Test-Command npx)  { return @('npx', '--yes') }
  if (Test-Command pnpm) { return @('pnpm', 'dlx') }
  if (Test-Command bunx) { return @('bunx') }
  Write-Die 'No Node package runner found (need npx, pnpm, or bun). Install Node 18+ from https://nodejs.org and re-run.'
}

function Assert-Node {
  if (-not (Test-Command node)) {
    Write-Die 'Node.js not found. Install Node 18+ from https://nodejs.org then re-run.'
  }
  $major = [int](node -p "process.versions.node.split('.')[0]")
  if ($major -lt 18) { Write-Die "Node $major detected. Founder OS needs Node 18+." }
  Write-Ok "Node $(node -v) detected"
}

function Confirm-Proceed {
  if ($Yes) { return }
  if ($env:FOUNDER_OS_YES -eq '1') { return }
  $reply = Read-Host 'Proceed? [y/N]'
  if ($reply -notmatch '^(y|yes)$') { Write-Die 'Cancelled by user.' }
}

# -- main --------------------------------------------------------------------
Show-Banner
Assert-NotElevated

Write-Step 'Detecting environment'
Write-Ok 'OS: Windows'
Assert-Node
$runner = Get-Runner
Write-Ok "Package runner: $($runner -join ' ')"

# Build the forwarded argument list from explicit, known switches only.
$forward = @('install', '--from-bootstrap')
if ($Yes)    { $forward += '--yes' }
if ($DryRun) { $forward += '--dry-run' }
if ($Force)  { $forward += '--force' }

Write-Host ''
Write-Step 'This installer will run exactly one command:'
Write-Host "  $($runner -join ' ') $Pkg $($forward -join ' ')" -ForegroundColor DarkGray
Write-Host '  It writes only to your user profile''s AI-tool folders.' -ForegroundColor DarkGray
Write-Host '  It never elevates, never edits system files, never opens network' -ForegroundColor DarkGray
Write-Host '  connections beyond the npm registry.' -ForegroundColor DarkGray
Write-Host ''

Confirm-Proceed
Write-Host ''

Write-Step 'Installing Founder OS'
$exe  = $runner[0]
$args = @()
if ($runner.Length -gt 1) { $args += $runner[1..($runner.Length - 1)] }
$args += $Pkg
$args += $forward
& $exe @args
if ($LASTEXITCODE -ne 0) { Write-Die "Installer exited with code $LASTEXITCODE" }

Write-Host ''
Write-Ok 'Founder OS is installed.'
Write-Host '  Next:'
Write-Host '    founder-os doctor            - verify your setup'    -ForegroundColor Magenta
Write-Host '    founder-os doctor --security - run the security audit' -ForegroundColor Magenta
Write-Host '    founder-os list              - see installed skills' -ForegroundColor Magenta
Write-Host '    founder-os uninstall         - cleanly remove everything' -ForegroundColor Magenta
Write-Host ''
Write-Host "  Docs: https://github.com/$Repo#readme" -ForegroundColor Magenta
Write-Host ''
