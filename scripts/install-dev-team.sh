#!/usr/bin/env bash
#
# install-dev-team.sh
# ---------------------------------------------------------------------------
# Installs the "development-team" agents from claude-code-templates
# (https://github.com/davila7/claude-code-templates) into Claude Code,
# either as subagents (~/.claude/agents/*.md), as Skills
# (~/.claude/skills/<name>/SKILL.md), or both.
#
# By default it installs to your USER (global) Claude config so the
# components are available across every project — not just one repo.
#
# Usage:
#   ./install-dev-team.sh              # install agents + skills (global)
#   ./install-dev-team.sh --skills     # skills only
#   ./install-dev-team.sh --agents     # agents only
#   ./install-dev-team.sh --dir PATH   # target a project dir instead of ~
#   ./install-dev-team.sh --replace    # delete agent .md files after making skills
#   ./install-dev-team.sh --help
#
# Requirements: node + npx (Node 18+), network access to npm + GitHub.
# Re-running is safe (idempotent).
# ---------------------------------------------------------------------------
set -euo pipefail

# --- the 8 development-team components ------------------------------------
AGENTS=(
  frontend-developer
  backend-architect
  fullstack-developer
  devops-engineer
  mobile-developer
  ios-developer
  ui-ux-designer
  cli-ui-designer
)
CATEGORY="development-team"

# --- options ---------------------------------------------------------------
TARGET_DIR="$HOME"
DO_AGENTS=1
DO_SKILLS=1
REPLACE=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --agents)       DO_AGENTS=1; DO_SKILLS=0 ;;
    --skills)       DO_AGENTS=1; DO_SKILLS=1 ;;  # agents are fetched first, then converted
    --skills-only)  DO_AGENTS=0; DO_SKILLS=1 ;;  # requires agents already present
    --dir)          shift; TARGET_DIR="${1:?--dir needs a path}" ;;
    --replace)      REPLACE=1 ;;
    -h|--help)
      # print the leading comment header only (stop at first non-comment line)
      awk 'NR==1{next} /^#/{sub(/^# ?/,""); print; next} {exit}' "$0"
      exit 0 ;;
    *) echo "Unknown option: $1" >&2; exit 2 ;;
  esac
  shift
done

CLAUDE_DIR="$TARGET_DIR/.claude"
AGENTS_DIR="$CLAUDE_DIR/agents"
SKILLS_DIR="$CLAUDE_DIR/skills"

info() { printf '\033[1;36m%s\033[0m\n' "$*"; }
ok()   { printf '\033[1;32m✓ %s\033[0m\n' "$*"; }

# --- 1. fetch agents via the official installer ----------------------------
if [[ "$DO_AGENTS" -eq 1 ]]; then
  command -v npx >/dev/null || { echo "npx not found — install Node 18+." >&2; exit 1; }
  list=""
  for a in "${AGENTS[@]}"; do list+="${list:+,}$CATEGORY/$a"; done
  info "Installing ${#AGENTS[@]} agents into $AGENTS_DIR ..."
  npx --yes claude-code-templates@latest --agent "$list" --directory "$TARGET_DIR" --yes
  ok "Agents installed."
fi

# --- 2. convert agents -> skills ------------------------------------------
if [[ "$DO_SKILLS" -eq 1 ]]; then
  [[ -d "$AGENTS_DIR" ]] || { echo "No agents dir at $AGENTS_DIR — run without --skills-only first." >&2; exit 1; }
  info "Converting agents into Skills under $SKILLS_DIR ..."
  for a in "${AGENTS[@]}"; do
    src="$AGENTS_DIR/$a.md"
    [[ -f "$src" ]] || { echo "  skip (missing): $a"; continue; }
    mkdir -p "$SKILLS_DIR/$a"
    # Keep frontmatter + body, but drop the agent-only `tools:` line.
    awk 'BEGIN{c=0} /^---$/{c++} {if(!(c==1 && /^tools:/)) print}' "$src" \
      > "$SKILLS_DIR/$a/SKILL.md"
    echo "  → skills/$a/SKILL.md"
  done
  ok "Skills created."

  if [[ "$REPLACE" -eq 1 ]]; then
    info "Removing source agent files (--replace) ..."
    for a in "${AGENTS[@]}"; do rm -f "$AGENTS_DIR/$a.md"; done
    ok "Agent files removed."
  fi
fi

info "Done. Restart Claude Code (or reload) to pick up new components."
