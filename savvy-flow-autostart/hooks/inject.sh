#!/bin/sh
# Inject the installed savvy-flow SKILL.md as session context.
SKILL=$(ls -d "$HOME"/.claude/plugins/cache/*/savvy-flow/*/skills/savvy-flow/SKILL.md 2>/dev/null | sort -V | tail -n 1)
[ -n "$SKILL" ] || exit 0

BODY=$(awk 'NR==1 && /^---$/ {fm=1; next} fm && /^---$/ {fm=0; next} !fm' "$SKILL" \
  | sed 's/^Task from the user: \$ARGUMENTS$/Task from the user: each request the user makes in this session./')

HEADER="savvy-flow is active for this whole session. Apply the playbook below to every task the user gives, without a /savvy-flow command. Worker agents are listed as savvy-flow:savvy-<tier>."

jq -n --arg ctx "$HEADER

$BODY" '{hookSpecificOutput: {hookEventName: "SessionStart", additionalContext: $ctx}}'
