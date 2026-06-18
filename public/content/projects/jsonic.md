# JSonic

A clipboard-aware JSON analyzer and differ that lives in your Mac toolbar — always one click away, never in the way.

---

## What It Does

JSonic is a lightweight macOS menu bar utility built for anyone who spends their day staring at API responses, log output, or config files. Copy a JSON blob to your clipboard, open JSonic, and instantly get:

- **Formatted, syntax-highlighted JSON** — no more squinting at a single-line blob
- **Diff view** — paste two JSON objects and see exactly what changed, field by field
- **Validation** — know immediately if your JSON is malformed and where it broke

The core idea is friction removal. You shouldn't have to open a browser tab, paste into an online tool, or switch to a dedicated app. JSonic sits in your toolbar and handles it in one keystroke.

---

## How to Use It

1. Copy any JSON to your clipboard
2. Click the JSonic icon in the Mac menu bar
3. Your JSON is automatically loaded, formatted, and ready to inspect

For diffing:
1. Paste your first JSON into the left pane
2. Paste your second JSON into the right pane
3. Differences are highlighted inline

---

## Status

JSonic is currently in early development and not yet publicly released. The repository exists at [github.com/lilaland/jsonic](https://github.com/lilaland/jsonic) — watch it for updates.

---

## Stack

Swift · macOS · AppKit / SwiftUI · Menu bar application architecture
