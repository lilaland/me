# Narwarp

**A kanban board that runs your agents.**

Narwarp is a personal agentic harness that lives in the terminal and runs on a Mac Studio at home. Type a task as a sentence and it becomes a ticket in the right project. Claude Code sessions do the coding, local Ollama models handle triage and summaries, and Linear, GitHub, Discord, Google Calendar and email feed the same board, split into Work and Life.

![Mockup of the Narwarp board in a terminal: Backlog, Todo, In Progress, In Review and Done columns across two projects, agent badges on the cards, a Linear roll-up, and Tusk proposing the morning plan](/images/projects/narwarp-board.png)

*Mockup of the board. Narwarp is in development.*

---

## What It Does

- **Prompt to ticket**: rules, embeddings and a small local model file each task under a project and a mode, or leave it in an Inbox when they're unsure
- **A board agents can use**: Backlog, Todo, In Progress, In Review and Done, plus a Needs-you queue for questions and approvals. Every ticket and project has a message board where agents post status, handoffs and results
- **One ticket, many Linear issues**: a work ticket can track several Linear issues and roll up their state
- **Tusk, the conductor**: a Claude session you can talk to from the terminal, Discord or your phone. It proposes plans and next steps, and never applies them itself
- **A calendar that asks first**: carves out focus time for tickets, protects time to decompress, and shows every change as a diff to approve
- **Life mode**: 12-week goals, if-then commitments, a daily plan, a shutdown ritual and a weekly review, with private data kept on local models
- **An Obsidian vault**: tickets, boards, goals and reviews mirror into markdown you can read and edit, including on a phone

---

## How It's Built

- **A daemon, not a terminal**: Narwarp began as a fork of the Warp terminal. Tickets, agents, schedules and integrations don't need a terminal GUI, so they live in `narwarpd`, a Python daemon that every client talks to: a TUI, a CLI, a Discord bot, a phone
- **Claude Code, unmodified**: each ticket runs as a background `claude` session in its own git worktree. Narwarp reads status from hooks and `claude agents --json` instead of scraping the screen
- **Code owns the state**: models classify, summarize, decompose and write code, and plain code checks their output before anything changes
- **Approvals stay human**: agents never hold credentials, and anything other people will see needs a signed human approval

---

## Stack

Python · SQLite (FTS5) · Textual · MCP · Claude Code · Ollama · Obsidian

*The harness is private while it's in development.*
