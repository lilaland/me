import { useState, useRef, useCallback } from 'react'

const CONTROLS = [
  { keys: ['↑', '↓', '←', '→'], label: 'D-Pad' },
  { keys: ['Z'],                  label: 'A' },
  { keys: ['X'],                  label: 'B' },
  { keys: ['A'],                  label: 'L' },
  { keys: ['S'],                  label: 'R' },
  { keys: ['Enter'],              label: 'Start' },
  { keys: ['Shift'],              label: 'Select' },
  { keys: ['A', 'S', 'Shift'],   label: '+5000 shells 🐚', cheat: true, note: 'Upgrade Menu only · once per run' },
]

function Key({ k }) {
  return (
    <kbd className="inline-flex items-center justify-center px-1.5 py-0.5 rounded text-xs font-mono bg-lavender-bg border border-lavender-border text-lavender-accent" style={{ minWidth: '1.6rem' }}>
      {k}
    </kbd>
  )
}

export default function GBAEmulator() {
  const iframeRef = useRef(null)
  const [focused, setFocused] = useState(false)

  const focusIframe = useCallback(() => {
    iframeRef.current?.focus()
    setFocused(true)
  }, [])

  return (
    <div className="border border-lavender-border rounded bg-lavender-sidebar mx-8 mt-8 mb-4 overflow-hidden">
      {/* header */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-lavender-border">
        <span className="text-lavender-accent font-bold text-sm">▶</span>
        <span className="text-lavender-text text-sm font-bold">Fish.gba</span>
        <span className="text-lavender-muted text-xs ml-1">— Game Boy Advance</span>
      </div>

      {/* game screen */}
      <div className="p-4">
        {/*
          EmulatorJS must run inside an iframe in a React SPA — official docs:
          "You cannot run it directly on the page."
          Keyboard events only reach the iframe once it has focus. We track focus
          state to show a hint and programmatically focus on wrapper click.
        */}
        <div
          className="relative cursor-pointer"
          style={{ width: 480, margin: '0 auto' }}
          onClick={focusIframe}
        >
          <iframe
            ref={iframeRef}
            src="/emulator.html"
            title="Fish GBA"
            tabIndex={0}
            style={{ width: 480, height: 320, border: 'none', display: 'block' }}
            allow="autoplay; fullscreen"
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
          {/* overlay hint — fades once the iframe has been focused */}
          {!focused && (
            <div
              className="absolute inset-0 flex items-end justify-center pb-3 pointer-events-none"
              style={{ background: 'transparent' }}
            >
              <span className="text-xs text-lavender-muted bg-lavender-sidebar px-2 py-1 rounded border border-lavender-border opacity-80">
                click game to enable keyboard
              </span>
            </div>
          )}
        </div>
      </div>

      {/* controls legend */}
      <div className="px-4 pb-4">
        <div className="border-t border-lavender-border pt-3">
          <p className="text-xs text-lavender-muted mb-2 tracking-wider uppercase">Default controls</p>
          <div className="grid gap-y-1.5 mb-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))' }}>
            {CONTROLS.filter(c => !c.cheat).map(({ keys, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className="flex items-center gap-1">
                  {keys.map(k => <Key key={k} k={k} />)}
                </div>
                <span className="text-lavender-muted text-xs">→</span>
                <span className="text-lavender-text text-xs">{label}</span>
              </div>
            ))}
          </div>
          {CONTROLS.filter(c => c.cheat).map(({ keys, label, note }) => (
            <div key={label} className="flex items-center gap-2 pt-2 border-t border-lavender-border">
              <div className="flex items-center gap-1">
                {keys.map((k, i) => (
                  <span key={k} className="flex items-center gap-1">
                    {i > 0 && <span className="text-lavender-muted text-xs">+</span>}
                    <Key k={k} />
                  </span>
                ))}
              </div>
              <span className="text-lavender-muted text-xs">→</span>
              <span className="text-lavender-keyword text-xs font-bold">{label}</span>
              {note && <span className="text-lavender-muted text-xs">({note})</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
