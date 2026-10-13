# lightlaland

**A lighting desk that listens to the record.**

lightlaland turns two 250W beam-curtain bars into a light show that follows a vinyl DJ set. It listens to the mix through a mic or an audio interface, locks onto the beat, and drives both bars over Art-Net. The control page is modelled on an old piece of lighting hardware (rubber keys, a teal VFD, a green radar screen) and runs on a Mac, an iPad or a phone.

![The Show screen: the magic sheet in room view, both curtains crossing on the disco balls](/images/projects/lightlaland.jpg)

---

## What It Does

- **Follows the music**: tracks tempo and phase from the kick drum, so it keeps up with pitch-fader drift and platter nudges, and spots breakdowns and drops as they happen
- **32 scenes in four moods**: groove, break, drop and ambient (rain, thunderstorms with lightning, Halloween, campfire, aurora and more); auto mode picks them as the track moves
- **Palettes**: five-colour palettes, from presets or generated from one or two colours on a colour wheel
- **Scene maker**: edit any scene's movement, beams, LED strip, whites and effects while it plays on the lights
- **Perform mode**: big, hit-able pads for an iPad in the booth
- **Magic sheet**: a 3D radar view of the room from the corner, showing where each curtain of beams lands, the LED side's wash, and the disco balls throwing specks when a curtain hits them

---

## How It's Built

- **Reverse-engineered with a webcam**: the bars came with a channel chart that contradicted itself, so a probe script stepped through the DMX channels while a webcam watched the light, and worked out the real 84-channel map and the motor's speed curve
- **Beam safety**: the bars ended up mounted sideways on the walls, 8 ft up, so a beam pointed slightly low goes straight into the crowd. The engine tracks every position the head could physically be in, given the measured motor speed, and only lights the beams when all of them point at the walls and ceiling. A test plays every scene against a simulated head that moves faster than assumed and fails on any beam lit pointing low
- **Beat tracking**: kick-band spectral flux, autocorrelation for tempo, a comb filter for phase and a phase-locked loop to follow the DJ, tested against a simulated two-record mix with a crossfade and a pitch ride
- **Smooth motion**: the motor speed follows the move, so slow sweeps glide instead of jumping two degrees at a time
- **No frameworks**: a hand-rolled Art-Net sender, a 40 fps Python engine, and the whole UI in a single HTML file drawn on canvas

![A beam-curtain bar lit cyan on the floor next to a laptop running an early version of the control page](/images/projects/lightlaland-first-test.jpg)

*First light: a bar on the floor before it was mounted, running an early version of the control page.*

---

## Stack

Python · numpy · sounddevice · Art-Net / DMX512 · HTML canvas · OpenCV

[View on GitHub →](https://github.com/lilaland/lightlaland)
