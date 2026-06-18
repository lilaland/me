# Fish

An educational Game Boy Advance video game about protecting the oceans — written entirely in C, with original artwork, and released into the public domain.

[View on GitHub →](https://github.com/lilaland/fish)

---

## About the Game

Fish is a GBA game built around ocean conservation as its central theme. You play as a fish navigating an environment where the ocean's health depends on your choices — an attempt to make environmental education feel interactive and fun rather than didactic.

The game was designed to be accessible and genuinely playable, not just a technical demo. Every sprite, background, and animation was created as original artwork made specifically for the project.

---

## How It Was Built

Building for the Game Boy Advance means working within strict constraints: a 32-bit ARM processor, 256KB of work RAM, 96KB of video RAM, and no operating system to lean on. Everything is written in C against the GBA hardware directly.

Key aspects of the build:

- **No OS, no frameworks** — all game logic, rendering, and input handling is written against GBA memory-mapped I/O registers directly
- **Original artwork** — all sprites and backgrounds were created from scratch, converted into GBA-compatible tile and palette formats for the hardware
- **ROM output** — the build produces a `.gba` ROM file that runs on original hardware and any standard emulator
- **CC0 licensed** — released fully into the public domain; anyone can read it, build on it, or port it

---

## What I Learned

Working this close to the hardware is a different kind of programming. There's no garbage collector, no standard library in the usual sense, and no margin for wasted cycles. Building Fish taught me how graphics pipelines work at the register level, how to manage memory without any safety net, and how satisfying it is to ship something that runs on a 20-year-old piece of hardware you can hold in your hand.

---

The game is playable below ↓
