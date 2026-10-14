# Eden

**The controller is the instrument.**

Eden turns the [PreSonus Atom SQ](https://www.presonus.com/products/Atom-SQ) MIDI controller into a groovebox. It's a Python app that drives the pads, lights and screen over MIDI, so you can sequence and play from the controller without opening a DAW.

![The Atom SQ with its pads lit pink and yellow, in front of a laptop showing Eden's web interface](/images/projects/eden.jpg)

<!-- YouTube embed goes here once video is uploaded -->

---

## What It Does

- **16-track session view**: launch and manage clips across a session, no host application needed
- **16/32-step drum sequencer**: a playhead scrolls across the pads as it plays
- **RGB pad feedback**: SysEx messages light the pads to show what's playing, what's muted and where the playhead is
- **The built-in screen**: Eden writes to the controller's display and uses it as the instrument's readout
- **Sample playback**: trigger and layer samples from the pads
- **Tempo**: change the BPM while it plays
- **Mute and solo per track**: from the pads, no mouse

---

## How It's Built

Python 3.11+, structured to stay predictable under real-time MIDI:

- **Immutable state**: the whole app state is one frozen `AppState` dataclass, and nothing is changed in place
- **Events, reducers, a renderer**: events come in, reducers return a new state, and the renderer pushes it to the hardware
- **103 tests that need no hardware**: the suite runs without the controller plugged in, so development and CI don't need the gear

---

## Stack

Python 3.11+ · MIDI / SysEx · pytest

[View on GitHub →](https://github.com/lilaland/eden)
