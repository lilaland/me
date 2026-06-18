# Lila Nicpon — Personal Portfolio

VS Code-themed single-page portfolio. React 18 + Vite 5 + Tailwind CSS v3.

Repo: [github.com/lilaland/me](https://github.com/lilaland/me)

## Run locally

```bash
npm install
npm run dev
```

## Edit content

All page content lives in `public/content/` as Markdown files. Edit them directly and redeploy — no rebuild needed for content-only changes.

- `public/content/README.md` — landing page
- `public/content/experience/` — work history
- `public/content/projects/` — project writeups
- `public/content/contact.md` — contact info

## Add photos

1. Drop images into `public/photos/<folder-name>/`
2. Update `src/data/photoFolders.js`:

```js
export const photoFolders = [
  { name: 'travel', images: ['tokyo.jpg', 'paris.jpg'] },
  { name: 'misc',   images: ['dog.jpg'] },
]
```

## Deploy

Deploys automatically on push to `main` via GitHub Actions (`.github/workflows/deploy.yml`).

To deploy manually:

```bash
npm run deploy
```
