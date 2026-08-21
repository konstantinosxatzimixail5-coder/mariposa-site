# scripts

## `install-dev-team.sh`

Installs the 8 **development-team** agents from
[claude-code-templates](https://github.com/davila7/claude-code-templates) into
Claude Code — as subagents, as Skills, or both — at the **global** (`~/.claude`)
level so they work across every project.

Components: `frontend-developer`, `backend-architect`, `fullstack-developer`,
`devops-engineer`, `mobile-developer`, `ios-developer`, `ui-ux-designer`,
`cli-ui-designer`.

```bash
./scripts/install-dev-team.sh            # agents + skills, global (~/.claude)
./scripts/install-dev-team.sh --skills   # convert to Skills too
./scripts/install-dev-team.sh --agents   # subagents only
./scripts/install-dev-team.sh --dir .    # install into this project's .claude
./scripts/install-dev-team.sh --replace  # drop the agent .md files after making Skills
./scripts/install-dev-team.sh --help
```

Requires Node 18+ (`npx`) and network access to npm + GitHub. Re-running is safe.
