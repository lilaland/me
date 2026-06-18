# Portfolio Site — Build Prompt

## Pre-flight checklist

Before running the prompt:
1. Create a new empty folder (e.g. `~/Documents/lila-site/`)
2. Drop `resume.pdf` in it
3. Open Claude Code in that folder and paste the prompt below
4. After the build: drop `lila.jpg` into `public/images/` and `fish.gba` into `public/roms/`

Assets to collect:
- [ ] `resume.pdf` — updated resume (agent reads this to write all content)
- [ ] `lila.jpg` / `lila.png` — your photo, goes in `public/images/`
- [ ] `fish.gba` — the Fish ROM, goes in `public/roms/`
- [ ] Eden YouTube demo URL
- [ ] LinkedIn URL
- [ ] Project screenshots (optional, go in `public/images/projects/`)
- [ ] Photo gallery images (optional, go in `public/photos/[subfolder]/`)

Post-build setup:
- In GitHub repo settings for `lilaland/me`: set custom domain to `lila.nicpon.com`, enable Pages from `gh-pages` branch
- Ask dad to update the `elijah` CNAME record on `nicpon.com` → rename to `lila`, keep value `lilaland.github.io`

---

## The Prompt

Paste everything below this line into Claude Code in the new project folder.

---

You are building a personal portfolio site for Lila Nicpon from scratch.
The resume is at ./resume.pdf — read it first before writing any code.
Also fetch the GitHub profile at https://github.com/lilaland and
read the READMEs / descriptions of repos: eden, jsonic, fish, narwarp.
Use all of this to populate the markdown content files with real information.

# STACK
- React 18 + Vite 5
- Tailwind CSS v3
- react-markdown + remark-gfm + rehype-highlight for markdown rendering
- EmulatorJS (CDN) for the GBA game
- No router — single-page app, navigation is purely state-driven
- No backend — 100% static, deploys to GitHub Pages with a custom domain

# VISUAL DESIGN
VS Code dark theme but lavender instead of gray. Exact layout:

  [ TitleBar          — filename centered, fake macOS traffic-light dots left ]
  [ ActivityBar | FileExplorer sidebar  | EditorArea                         ]
  [    (48px)   |     (~240px)          |   (remaining width)                ]
  [ StatusBar         — bottom, 22px tall                                    ]

Tailwind color palette — add this to tailwind.config.js under theme.extend.colors:

  lavender: {
    bg:         '#1a1625',   // editor background
    sidebar:    '#14101f',   // explorer background
    titlebar:   '#0f0c18',   // title bar
    statusbar:  '#7c5cbf',   // bottom status bar
    border:     '#332851',   // dividers/lines
    hover:      '#2a2040',   // hover on tree items
    active:     '#3d2f6e',   // selected file in tree
    tabBorder:  '#9d7fe8',   // top border of active tab
    text:       '#e2d9f3',   // primary text
    muted:      '#7a6d9a',   // comments, breadcrumb, line numbers
    accent:     '#b39ddb',   // headings, highlights
    keyword:    '#c792ea',   // links, keywords in markdown
  }

Font: monospace everywhere.
  fontFamily: { mono: ['ui-monospace','SFMono-Regular','Menlo','Consolas','monospace'] }

Custom scrollbars site-wide (in index.css):
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: #14101f; }
  ::-webkit-scrollbar-thumb { background: #332851; border-radius: 3px; }

# PROJECT STRUCTURE
  /
  ├── public/
  │   ├── content/             ← all .md files fetched at runtime
  │   │   ├── README.md
  │   │   ├── experience/
  │   │   │   ├── lockchain.md
  │   │   │   └── internships/
  │   │   │       ├── mongodb.md
  │   │   │       ├── kudelski_security.md
  │   │   │       ├── newfields.md
  │   │   │       └── gatech.md
  │   │   ├── projects/
  │   │   │   ├── eden.md
  │   │   │   ├── jsonic.md
  │   │   │   ├── fish.md
  │   │   │   └── narwarp.md
  │   │   └── contact.md
  │   ├── images/              ← lila.jpg + project screenshots
  │   │   └── projects/
  │   ├── photos/              ← photo gallery subfolders
  │   └── roms/
  │       └── fish.gba
  ├── src/
  │   ├── main.jsx
  │   ├── App.jsx
  │   ├── index.css
  │   ├── context/
  │   │   └── EditorContext.jsx
  │   ├── data/
  │   │   └── fileTree.js
  │   └── components/
  │       ├── TitleBar.jsx
  │       ├── ActivityBar.jsx
  │       ├── FileExplorer.jsx
  │       ├── FileTreeItem.jsx
  │       ├── EditorArea.jsx
  │       ├── TabBar.jsx
  │       ├── Breadcrumb.jsx
  │       ├── MarkdownViewer.jsx
  │       ├── GBAEmulator.jsx
  │       └── PhotoGallery.jsx
  ├── index.html
  ├── vite.config.js
  ├── tailwind.config.js
  ├── postcss.config.js
  └── package.json

# STATE MANAGEMENT
Single context in src/context/EditorContext.jsx:

  const EditorContext = createContext()

  export function EditorProvider({ children }) {
    const [openFiles, setOpenFiles] = useState(['README.md'])
    const [activeFile, setActiveFile] = useState('README.md')
    const [sidebarOpen, setSidebarOpen] = useState(true)

    function openFile(path) {
      if (!openFiles.includes(path)) setOpenFiles(prev => [...prev, path])
      setActiveFile(path)
    }
    function closeFile(path) {
      const next = openFiles.filter(f => f !== path)
      setOpenFiles(next)
      if (activeFile === path) setActiveFile(next[next.length - 1] ?? null)
    }

    return (
      <EditorContext.Provider value={{ openFiles, activeFile, sidebarOpen,
        openFile, closeFile, setActiveFile,
        toggleSidebar: () => setSidebarOpen(v => !v) }}>
        {children}
      </EditorContext.Provider>
    )
  }

  export const useEditor = () => useContext(EditorContext)

# FILE TREE DATA (src/data/fileTree.js)
Hardcoded structure — no runtime filesystem scanning needed:

  export const fileTree = [
    { name: 'README.md', path: 'README.md', type: 'file' },
    { name: 'experience', type: 'folder', children: [
      { name: 'lockchain.md', path: 'experience/lockchain.md', type: 'file' },
      { name: 'internships', type: 'folder', children: [
        { name: 'mongodb.md', path: 'experience/internships/mongodb.md', type: 'file' },
        { name: 'kudelski_security.md', path: 'experience/internships/kudelski_security.md', type: 'file' },
        { name: 'newfields.md', path: 'experience/internships/newfields.md', type: 'file' },
        { name: 'gatech.md', path: 'experience/internships/gatech.md', type: 'file' },
      ]},
    ]},
    { name: 'projects', type: 'folder', children: [
      { name: 'eden.md', path: 'projects/eden.md', type: 'file' },
      { name: 'jsonic.md', path: 'projects/jsonic.md', type: 'file' },
      { name: 'fish.md', path: 'projects/fish.md', type: 'file' },
      { name: 'narwarp.md', path: 'projects/narwarp.md', type: 'file' },
    ]},
    { name: 'photos', type: 'folder', path: 'photos', isGallery: true, children: [] },
    { name: 'contact.md', path: 'contact.md', type: 'file' },
  ]

# SUBAGENT EXECUTION STRATEGY
You must parallelize this build using subagents. Follow these phases exactly.

---
## PHASE 1 — Launch both agents simultaneously before doing anything else.

### Agent "foundation"
Build the entire project scaffold. Create every file listed in the project
structure. For components, write the full implementation of:
- package.json (deps: react@^18, react-dom@^18, react-markdown@^9,
  remark-gfm@^4, rehype-highlight@^7, highlight.js@^11;
  devDeps: vite@^5, @vitejs/plugin-react@^4, tailwindcss@^3,
  autoprefixer, postcss)
- vite.config.js: base '/', @vitejs/plugin-react plugin
- tailwind.config.js: full lavender palette + mono font as above,
  content: ['./index.html','./src/**/*.{jsx,js}']
- postcss.config.js: tailwindcss + autoprefixer
- index.html: mounts #root, title "Lila Nicpon"
- src/main.jsx: renders <EditorProvider><App /></EditorProvider>
- src/index.css: Tailwind directives + scrollbar styles + body background lavender.bg
- src/context/EditorContext.jsx: exactly as specified above
- src/data/fileTree.js: exactly as specified above
- src/App.jsx: three-column layout using flex. Renders TitleBar at top,
  then a flex row with ActivityBar + (FileExplorer if sidebarOpen) + EditorArea,
  then StatusBar at bottom. Wire Ctrl+B keyboard shortcut to toggleSidebar.
- src/components/TitleBar.jsx: 38px tall, titlebar bg. Left: three colored circles
  (red #ff5f57, yellow #ffbd2e, green #28c840) spaced 8px apart. Center: active
  filename from useEditor(). Right: empty. All in flex justify-between items-center px-4.
- src/components/ActivityBar.jsx: 48px wide, sidebar bg, flex-col items-center py-3 gap-4.
  Two SVG icons: Files (folder icon) and an optional future slot. Clicking Files calls
  toggleSidebar. The active/hovered icon gets accent color, otherwise muted color.
- src/components/StatusBar.jsx: 22px, statusbar bg, flex justify-between items-center
  px-3, text-xs text-white. Left: "Lila Nicpon". Right: "UTF-8  Markdown".
- src/components/FileExplorer.jsx: sidebar bg, 240px wide, flex-none, overflow-y-auto.
  Header reads "EXPLORER" in muted color, text-xs tracking-widest, px-4 py-2.
  Renders fileTree using FileTreeItem recursively. Clicking a file calls openFile.
- src/components/FileTreeItem.jsx: recursive component. File items: flex items-center
  gap-1 px-2 py-0.5 text-sm cursor-pointer hover:bg-lavender-hover. Show a file icon
  SVG. Active file gets bg-lavender-active text-lavender-text. Folder items: same
  style but with a chevron (▶/▼) that toggles isOpen state, and renders children
  when open indented by pl-4. Default folders: experience open, others collapsed.
- src/components/TabBar.jsx: flex row, bg slightly darker than editor. Each tab:
  flex items-center gap-2 px-4 py-1 text-sm cursor-pointer border-r border-lavender-border.
  Active tab: bg-lavender-bg, border-t-2 border-lavender-tabBorder, text-lavender-text.
  Inactive: bg-lavender-sidebar text-lavender-muted. X button on each tab: text-xs,
  shows on hover, calls closeFile. Overflow-x-auto if many tabs.
- src/components/Breadcrumb.jsx: 28px tall, flex items-center px-4 text-xs
  text-lavender-muted. Splits activeFile path by '/' and renders with ' > ' separator.
  Last segment gets text-lavender-text.
- src/components/EditorArea.jsx: flex-col flex-1 bg-lavender-bg overflow-hidden.
  Renders TabBar, then Breadcrumb, then the content viewer below in flex-1 overflow-y-auto.
  Content routing logic:
    - No active file → centered empty state: "No file open" in muted text
    - photos folder selected (path === 'photos') → <PhotoGallery />
    - path ends in .md → fetch /content/{path} then render <MarkdownViewer content={text} />
    - if path === 'projects/fish.md' → render MarkdownViewer AND below it <GBAEmulator />
- src/components/MarkdownViewer.jsx: see full spec below
- src/components/GBAEmulator.jsx: see full spec below
- src/components/PhotoGallery.jsx: see full spec below

### Agent "content"
After reading resume.pdf and fetching GitHub repos, write all markdown files.
Write them to public/content/. Use real information from the resume and GitHub.
Do not use placeholder text — extract actual job titles, dates, descriptions,
and tech stacks from the source material.

README.md structure:
- Hero image: ![Lila](/images/lila.jpg) — center it with HTML if needed
- Name as H1, a 2-3 sentence bio in first person
- "Currently" section: latest role
- "Tech" section: brief grouped list (languages, infra, etc.)
- Warm, personal tone — this is the landing page

experience/lockchain.md:
- Emphasize rapid career progression (multiple role jumps, key achievements)
- Use actual role titles, dates, and bullet-point achievements from resume
- This is the most important experience file — make it detailed

experience/internships/*.md:
- One file per internship, each with role, company, date range, 3-5 achievements

projects/eden.md:
- Include YouTube embed: use raw HTML iframe for the YouTube URL
  <iframe width="560" height="315" src="https://www.youtube.com/embed/VIDEO_ID"
  frameborder="0" allowfullscreen></iframe>
- Description, tech stack, what problem it solved

projects/jsonic.md:
- Mac toolbar JSON analysis helper
- Description, how to use it, tech stack

projects/fish.md:
- Educational GBA game
- Description, how it was built, what you learned
- End with: "The game is playable below ↓"

projects/narwarp.md:
- Cloud-free Warp fork + local LLM + Obsidian integration
- Description of the workflow it enables

contact.md:
- Email: lila@nicpon.com
- LinkedIn: [their URL]
- A brief "get in touch" note

---
## PHASE 2 — After Phase 1 is complete, launch these three agents simultaneously.

### Agent "viewers"
Implement the three content viewer components fully.

MarkdownViewer.jsx:
- Props: { content: string }
- Uses ReactMarkdown with remarkGfm plugin and rehypeHighlight plugin
- Custom components object for styled rendering:
  - h1/h2/h3: text-lavender-accent font-bold mb-3, appropriate sizes
  - p: text-lavender-text leading-relaxed mb-4
  - a: text-lavender-keyword underline decoration-dotted hover:decoration-solid
  - code (inline): bg-lavender-border px-1 rounded text-lavender-accent font-mono text-sm
  - pre (block): bg-[#0d0a1a] border border-lavender-border rounded p-4 mb-4 overflow-x-auto
  - blockquote: border-l-4 border-lavender-accent pl-4 text-lavender-muted italic mb-4
  - ul/ol: text-lavender-text mb-4 pl-6 space-y-1 with list-disc/list-decimal
  - table: full-width border-collapse, th: bg-lavender-active, td/th: border border-lavender-border px-3 py-1
  - img: max-w-full rounded my-4
  - hr: border-lavender-border my-6
- Line number gutter: wrap the entire viewer in a div with a left gutter showing line numbers.
  Count lines by splitting rendered content. Numbers right-aligned in muted color, 40px wide.
  (Implement as a CSS counter trick or a pre-pass that counts \n characters in content.)
- Outer wrapper: px-8 py-6 max-w-3xl

GBAEmulator.jsx:
- Centered in the editor area, below the fish.md markdown content
- Add a divider line and heading "▶ Play Fish" in accent color above the emulator
- Implementation:
  useEffect(() => {
    window.EJS_player = '#gba-player'
    window.EJS_core = 'gba'
    window.EJS_gameUrl = '/roms/fish.gba'
    window.EJS_pathtodata = 'https://cdn.emulatorjs.org/stable/data/'
    window.EJS_color = '#7c5cbf'
    window.EJS_defaultControls = true
    const script = document.createElement('script')
    script.src = 'https://cdn.emulatorjs.org/stable/data/loader.js'
    document.body.appendChild(script)
    return () => document.body.removeChild(script)
  }, [])
  return <div id="gba-player" style={{ width: '480px', height: '320px', margin: '2rem auto' }} />
- Wrap in a div with border border-lavender-border rounded p-4 bg-lavender-sidebar

PhotoGallery.jsx:
- Shows images from public/photos/ — since these are public assets, accept a prop
  `folders` defaulting to [] with shape [{ name: string, images: string[] }]
- For now render a placeholder state: centered text in muted color reading
  "Drop photos into public/photos/ — add folder names to src/data/photoFolders.js"
- Create src/data/photoFolders.js with export const photoFolders = [] so it's ready to fill in
- When folders have content: CSS columns-3 gap-2 masonry layout, each image
  is a rounded img with hover:scale-105 transition, clicking opens a lightbox modal
- Lightbox: simple overlay with the full image, click outside or Escape to close

### Agent "deploy-config"
Set up everything needed to deploy to GitHub Pages at lila.nicpon.com.

1. vite.config.js — confirm base is '/' (custom subdomain means root path)

2. Create deploy.sh:
   #!/bin/bash
   npm run build
   cd dist
   echo "lila.nicpon.com" > CNAME
   git init
   git add .
   git commit -m "deploy"
   git push -f git@github.com:lilaland/me.git main:gh-pages

3. Add to package.json scripts:
   "deploy": "bash deploy.sh",
   "build": "vite build",
   "dev": "vite",
   "preview": "vite preview"

4. Create .github/workflows/deploy.yml for automatic deploy on push to main:
   name: Deploy
   on:
     push:
       branches: [main]
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: actions/setup-node@v4
           with: { node-version: '20' }
         - run: npm ci
         - run: npm run build
         - uses: peaceiris/actions-gh-pages@v4
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist
             cname: lila.nicpon.com

5. Create public/CNAME with contents: lila.nicpon.com

6. Create a README.md at project root (not in public/) explaining:
   - How to run locally (npm install && npm run dev)
   - How to add photos (drop in public/photos/subfolder/, update src/data/photoFolders.js)
   - How to deploy (auto on push to main via GitHub Actions, or npm run deploy)
   - How to edit content (edit files in public/content/, re-deploy)
   - Repo: github.com/lilaland/me

---
## PHASE 3 — After all Phase 2 agents complete, you handle integration yourself.

1. Run `npm install` and fix any dependency issues
2. Run `npm run build` — fix every import/syntax error until it succeeds
3. Run `npm run dev` and verify:
   - Site loads with README.md pre-selected and displayed
   - File explorer shows the correct tree, folders expand/collapse
   - Clicking any .md file opens it as a tab and renders the markdown
   - fish.md shows the GBA emulator section below the markdown
   - Tabs can be closed with the X button
   - Ctrl+B toggles the sidebar
   - TitleBar shows the active filename
   - Breadcrumb shows the correct path
4. Fix any visual issues to match the lavender VS Code spec above
5. Report what's working and what still needs real assets (lila.jpg, fish.gba)
