# Eden

**The controller is the instrument.**

Eden transforms the [PreSonus Atom SQ](https://www.presonus.com/products/Atom-SQ) MIDI controller into a fully standalone groovebox — no DAW, no laptop tethering, no software middleman. If you've ever wanted to just pick up a pad controller and play without booting Ableton, this is the answer.

<!-- YouTube embed goes here once video is uploaded -->

---

## What It Does

Eden gives the Atom SQ a complete performance environment, running entirely in software it controls via MIDI:

- **16-track session view** — manage and trigger clips across a full session without a host application
- **16/32-step drum sequencer** — program rhythms with a visual playhead that scrolls across the pads in real time
- **RGB pad control** — full color feedback via MIDI SysEx messages; the hardware lights up to reflect what's playing, what's muted, and where the playhead is
- **OLED display manipulation** — write to the controller's built-in screen directly, turning it into an instrument readout
- **Audio sample playback** — trigger and layer samples from the pads
- **BPM control** — set and modify tempo on the fly
- **Mute / Solo per track** — shape your mix in performance without touching a mouse

---

## How It's Built

Eden is written in Python 3.11+ with an architecture designed to stay predictable under the constraints of real-time MIDI:

- **Immutable state** — the entire application state is represented as a frozen `AppState` dataclass; nothing mutates in place, making bugs from unexpected state changes structurally impossible
- **Event / Reducer / Renderer pipeline** — inspired by functional UI patterns: events come in, reducers produce a new state, the renderer reflects it to the hardware; clean separation between logic and output
- **103 hardware-independent tests** — the full test suite runs without any MIDI hardware connected, enabling development and CI without needing physical gear

---

## Stack

Python 3.11+ · MIDI / SysEx · Immutable state architecture · pytest

[View on GitHub →](https://github.com/lilaland/eden)
