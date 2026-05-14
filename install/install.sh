#!/usr/bin/env bash
#
# Founder OS for Claude — one-command installer (macOS / Linux)
#
#   curl -fsSL https://raw.githubusercontent.com/aadhib/founder-os-for-claude/main/install/install.sh | bash
#
# WHAT THIS SCRIPT DOES — and nothing else:
#   1. Refuses to run as root (Founder OS never needs elevation).
#   2. Checks that Node.js 18+ and a package runner (npx/pnpm/bun) exist.
#   3. Prints the exact command it is about to run.
#   4. Runs `<runner> @aadhib/founderos@latest install --from-bootstrap`.
#
# It downloads NOTHING else, writes NO files itself, and uses NO temp
# directories. All real work is done by the `founderos` npm package, whose
# source is public and auditable. To inspect before running:
#   curl -fsSL https://raw.githubusercontent.com/aadhib/founder-os-for-claude/main/install/install.sh
#
# Prefer not to pipe to a shell at all? Use the npm path directly:
#   npx @aadhib/@aadhib/founderos@latest install

set -euo pipefail

readonly REPO="aadhib/founder-os-for-claude"
readonly PKG="@aadhib/founderos@latest"

# ── styling ───────────────────────────────────────────────────────────────
if [ -t 1 ]; then
  BOLD=$'\033[1m'; DIM=$'\033[2m'; RESET=$'\033[0m'
  PURPLE=$'\033[38;5;141m'; GREEN=$'\033[38;5;42m'
  RED=$'\033[38;5;203m'; YELLOW=$'\033[38;5;221m'
else
  BOLD=""; DIM=""; RESET=""; PURPLE=""; GREEN=""; RED=""; YELLOW=""
fi

say()  { printf "%s\n" "$1"; }
step() { printf "%s▸%s %s\n" "$PURPLE" "$RESET" "$1"; }
ok()   { printf "%s✓%s %s\n" "$GREEN" "$RESET" "$1"; }
warn() { printf "%s!%s %s\n" "$YELLOW" "$RESET" "$1"; }
die()  { printf "%s✗ %s%s\n" "$RED" "$1" "$RESET" >&2; exit 1; }

banner() {
  printf "\n%s%s" "$PURPLE" "$BOLD"
  cat <<'EOF'
  ╔═══════════════════════════════════════════╗
  ║          F O U N D E R   O S              ║
  ║      the AI operating system for          ║
  ║      founders, CTOs & product builders    ║
  ╚═══════════════════════════════════════════╝
EOF
  printf "%s\n" "$RESET"
}

# ── pre-flight ────────────────────────────────────────────────────────────
refuse_root() {
  if [ "$(id -u 2>/dev/null || echo 1)" = "0" ]; then
    die "Do not run this installer as root or with sudo. Founder OS only writes to your home directory and never needs elevation."
  fi
}

detect_os() {
  case "$(uname -s)" in
    Darwin) echo "macOS" ;;
    Linux)  echo "Linux" ;;
    *)      die "Unsupported OS. On Windows use install.ps1." ;;
  esac
}

have() { command -v "$1" >/dev/null 2>&1; }

# Populates the RUNNER array with the package runner + its subcommand.
RUNNER=()
pick_runner() {
  if have npx;  then RUNNER=(npx --yes); return; fi
  if have pnpm; then RUNNER=(pnpm dlx);  return; fi
  if have bunx; then RUNNER=(bunx);      return; fi
  die "No Node package runner found (need npx, pnpm, or bun). Install Node 18+ from https://nodejs.org and re-run."
}

check_node() {
  if ! have node; then
    die "Node.js not found. Install Node 18+ from https://nodejs.org then re-run."
  fi
  local major
  major="$(node -p 'process.versions.node.split(".")[0]' 2>/dev/null || echo 0)"
  if [ "$major" -lt 18 ]; then
    die "Node $major detected. Founder OS needs Node 18+."
  fi
  ok "Node $(node -v) detected"
}

confirm() {
  # Skip the prompt when --yes is passed or when stdin is not a TTY but the
  # caller explicitly opted in via FOUNDER_OS_YES=1.
  for arg in "$@"; do
    if [ "$arg" = "--yes" ] || [ "$arg" = "-y" ]; then return 0; fi
  done
  if [ "${FOUNDER_OS_YES:-}" = "1" ]; then return 0; fi
  if [ ! -t 0 ]; then
    warn "Non-interactive shell detected. Re-run with --yes to proceed, e.g.:"
    say  "  curl -fsSL https://raw.githubusercontent.com/${REPO}/main/install/install.sh | bash -s -- --yes"
    die  "Aborting — no confirmation possible."
  fi
  printf "%sProceed? [y/N] %s" "$BOLD" "$RESET"
  read -r reply
  case "$reply" in
    [yY]|[yY][eE][sS]) return 0 ;;
    *) die "Cancelled by user." ;;
  esac
}

# ── main ──────────────────────────────────────────────────────────────────
main() {
  banner
  refuse_root

  step "Detecting environment"
  OS="$(detect_os)"
  ok "OS: $OS"
  check_node
  pick_runner
  ok "Package runner: ${RUNNER[*]}"

  echo
  step "This installer will run exactly one command:"
  say "  ${DIM}\$ ${RUNNER[*]} ${PKG} install --from-bootstrap $*${RESET}"
  say "  ${DIM}It writes only to your home directory's AI-tool folders.${RESET}"
  say "  ${DIM}It never uses sudo, never edits system files, never opens network"
  say "  connections beyond the npm registry.${RESET}"
  echo

  confirm "$@"
  echo

  step "Installing Founder OS"
  "${RUNNER[@]}" "$PKG" install --from-bootstrap "$@"

  echo
  ok "${BOLD}Founder OS is installed.${RESET}"
  say "  Next:"
  say "    ${PURPLE}founderos doctor${RESET}            — verify your setup"
  say "    ${PURPLE}founderos doctor --security${RESET} — run the security audit"
  say "    ${PURPLE}founderos list${RESET}              — see installed skills"
  say "    ${PURPLE}founderos uninstall${RESET}         — cleanly remove everything"
  echo
  say "  Docs: ${PURPLE}https://github.com/${REPO}#readme${RESET}"
  echo
}

main "$@"
