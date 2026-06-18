/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{jsx,js}'],
  theme: {
    extend: {
      colors: {
        lavender: {
          bg:        '#faf6ff',   // editor — pale lavender cream
          sidebar:   '#f0e8fc',   // explorer — soft lavender
          titlebar:  '#e8ddf8',   // title bar — dusky lavender
          statusbar: '#9b7fe8',   // status bar — medium purple
          border:    '#ddd0f0',   // dividers — light lavender
          hover:     '#ece4fa',   // hover — barely-there tint
          active:    '#ddd0f0',   // selected item — soft lavender
          tabBorder: '#7c5cbf',   // active tab accent — vivid purple
          text:      '#2d1b5e',   // primary text — deep purple
          muted:     '#9585bc',   // comments / line numbers — muted purple
          accent:    '#6040a8',   // headings — rich purple
          keyword:   '#8b35c0',   // links / keywords — vivid purple
        }
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      }
    }
  },
  plugins: [],
}
