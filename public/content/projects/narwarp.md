# Narwarp

A fork of the [Warp Terminal](https://www.warp.dev/) with local LLM integration and an Obsidian knowledge base connection — all of it cloud-free, all of it private.

---

## The Problem

Warp is a genuinely great terminal. Its AI features are useful. But those features route your terminal context — commands, output, file paths — to the cloud. For certain work environments, that's a non-starter. And even where it's technically fine, there's something uncomfortable about a terminal that phones home.

Narwarp solves this by replacing the cloud AI layer with a locally-running LLM, and connecting it to an Obsidian vault so the AI has access to your personal knowledge base — runbooks, notes, project context, whatever you've accumulated.

---

## What It Enables

- **Local AI in the terminal** — ask questions about commands, get explanations, debug output, all without leaving the terminal and without a single byte leaving your machine
- **Obsidian integration** — the LLM has access to your Obsidian knowledge base, so it can surface your own notes, documentation, and runbooks as context when answering questions
- **Privacy by default** — no API keys, no cloud calls, no data leaving your machine; the model runs locally and the knowledge base is local
- **Warp UX, kept** — built on Warp's existing terminal experience, so you keep the block-based interface, command history, and ergonomics you already use

---

## Approach

Narwarp is a fork of the Warp Terminal codebase, modified to route AI inference to a local LLM runtime (such as Ollama or llama.cpp) rather than Warp's cloud backend. The Obsidian connection is handled by reading from the local vault directory and embedding relevant notes into the LLM context at query time.

The project is currently private while in active development.
