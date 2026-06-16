#!/usr/bin/env bash
# Bootstrap dev environment: Node.js, pnpm, then project dependencies.
# Usage: bash scripts/setup-env.sh [--yes]
#   --yes  Skip confirmation (use after the user already approved install).

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

MIN_NODE_MAJOR=20
MIN_NODE_PATCH=19
PNPM_VERSION="9.15.9"
AUTO_YES=false

for arg in "$@"; do
  case "$arg" in
    --yes|-y) AUTO_YES=true ;;
    -h|--help)
      echo "Usage: bash scripts/setup-env.sh [--yes]"
      echo "Checks/installs Node.js (>=${MIN_NODE_MAJOR}.${MIN_NODE_PATCH}), pnpm ${PNPM_VERSION}, then runs pnpm install."
      exit 0
      ;;
  esac
done

info()  { printf '\033[36m→\033[0m %s\n' "$*"; }
ok()    { printf '\033[32m✓\033[0m %s\n' "$*"; }
warn()  { printf '\033[33m!\033[0m %s\n' "$*"; }
fail()  { printf '\033[31m✗\033[0m %s\n' "$*" >&2; exit 1; }

confirm() {
  if $AUTO_YES; then return 0; fi
  printf '%s [y/N] ' "$1"
  read -r reply
  case "$reply" in
    y|Y|yes|YES) return 0 ;;
    *) fail "Cancelled." ;;
  esac
}

node_version_ok() {
  if ! command -v node >/dev/null 2>&1; then
    return 1
  fi
  local ver major minor patch
  ver="$(node -p "process.versions.node")"
  major="${ver%%.*}"
  local rest="${ver#*.}"
  minor="${rest%%.*}"
  rest="${rest#*.}"
  patch="${rest%%-*}"
  patch="${patch%%+*}"
  if [[ "$major" -gt "$MIN_NODE_MAJOR" ]]; then return 0; fi
  if [[ "$major" -lt "$MIN_NODE_MAJOR" ]]; then return 1; fi
  if [[ "$minor" -gt "$MIN_NODE_PATCH" ]]; then return 0; fi
  if [[ "$minor" -lt "$MIN_NODE_PATCH" ]]; then return 1; fi
  [[ "${patch:-0}" -ge 0 ]]
}

install_node() {
  info "Node.js >= ${MIN_NODE_MAJOR}.${MIN_NODE_PATCH} is required (Vite 7)."
  confirm "Install Node.js now?"

  if command -v brew >/dev/null 2>&1; then
    info "Installing Node.js via Homebrew…"
    brew install node@22 || brew install node
    if [[ -d "$(brew --prefix node@22 2>/dev/null)/bin" ]]; then
      export PATH="$(brew --prefix node@22)/bin:$PATH"
    fi
  elif command -v nvm >/dev/null 2>&1; then
    info "Installing Node.js via nvm…"
    # shellcheck disable=SC1090
    source "${NVM_DIR:-$HOME/.nvm}/nvm.sh"
    nvm install 22
    nvm use 22
  elif command -v fnm >/dev/null 2>&1; then
    info "Installing Node.js via fnm…"
    eval "$(fnm env)"
    fnm install 22
    fnm use 22
  else
    fail "Node.js not found. Install manually: https://nodejs.org/ (LTS 22+) or install Homebrew / nvm / fnm, then re-run: bash scripts/setup-env.sh"
  fi

  command -v node >/dev/null 2>&1 || fail "Node install finished but 'node' is still not on PATH."
  node_version_ok || fail "Node is installed but version is too old: $(node -v). Need >= ${MIN_NODE_MAJOR}.${MIN_NODE_PATCH}."
  ok "Node $(node -v)"
}

install_pnpm() {
  info "pnpm ${PNPM_VERSION} is required."
  confirm "Install pnpm now?"

  if command -v corepack >/dev/null 2>&1; then
    info "Enabling pnpm via corepack…"
    corepack enable
    corepack prepare "pnpm@${PNPM_VERSION}" --activate
  elif command -v npm >/dev/null 2>&1; then
    info "Installing pnpm globally via npm…"
    npm install -g "pnpm@${PNPM_VERSION}"
  else
    fail "Cannot install pnpm — npm not found after Node install."
  fi

  command -v pnpm >/dev/null 2>&1 || fail "pnpm install finished but 'pnpm' is still not on PATH."
  ok "pnpm $(pnpm -v)"
}

install_deps() {
  info "Installing project dependencies (pnpm install)…"
  pnpm install
  ok "Dependencies installed."
}

echo ""
info "Playable Builder Kit — environment setup"
info "Project: $ROOT"
echo ""

PLAN=()
if ! node_version_ok; then
  PLAN+=("Node.js >= ${MIN_NODE_MAJOR}.${MIN_NODE_PATCH}")
fi
if ! command -v pnpm >/dev/null 2>&1; then
  PLAN+=("pnpm ${PNPM_VERSION}")
fi
if [[ ! -d node_modules ]] || [[ ! -f node_modules/.modules.yaml ]] 2>/dev/null; then
  PLAN+=("project dependencies (pnpm install)")
fi

if [[ ${#PLAN[@]} -eq 0 ]]; then
  ok "Environment ready — Node $(node -v), pnpm $(pnpm -v), dependencies present."
  exit 0
fi

info "Will set up:"
for item in "${PLAN[@]}"; do
  printf '  • %s\n' "$item"
done
echo ""

if ! node_version_ok; then
  install_node
else
  ok "Node $(node -v)"
fi

if ! command -v pnpm >/dev/null 2>&1; then
  install_pnpm
else
  ok "pnpm $(pnpm -v)"
fi

if [[ ! -d node_modules ]] || [[ ! -f node_modules/.modules.yaml ]] 2>/dev/null; then
  confirm "Run pnpm install for this project?"
  install_deps
else
  ok "node_modules present"
fi

echo ""
ok "Setup complete. Next: pnpm dev"
