# Fish

An educational Game Boy Advance game about protecting the oceans, written in C with original artwork and released into the public domain.

[View on GitHub →](https://github.com/lilaland/fish)

---

## About the Game

You play as a fish, and the ocean's health depends on your choices. The aim was to teach ocean conservation through a game people would actually want to play.

---

## How It Was Built

The Game Boy Advance has a 32-bit ARM processor, 256 KB of work RAM, 96 KB of video RAM and no operating system, so everything is C written straight against the hardware.

- **No OS or frameworks**: game logic, rendering and input all go through the GBA's memory-mapped I/O registers
- **Original artwork**: every sprite and background was drawn for the game and converted into GBA tile and palette formats
- **A real ROM**: the build produces a `.gba` file that runs on original hardware and any standard emulator
- **CC0**: public domain, so anyone can read it, build on it or port it

---

## What I Learned

Working this close to the hardware is a different kind of programming: no garbage collector, no standard library to speak of, and no cycles to spare. Fish taught me how graphics work at the register level and how to manage memory with no safety net. And it's satisfying to have made something that runs on a 25-year-old handheld.
