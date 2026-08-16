# VibeOps

**Local-first vibe coding project tracker.**

Dark, focused dashboard for tracking side projects / vibe-coding experiments.  
Everything stays on your machine — nothing leaves the box.

---

## Features

- **Work on this Now** – claim up to 3 projects as your current focus
- **Rotting detector** – surfaces projects untouched for 7+ days
- **In Flight** – live counts of Exploring / Building / Testing
- Priority system: **Now / Next / Later**
- Stages: Exploring → Building → Testing → Live → Paused → Archived
- Project detail drawer (edit next action, change stage/priority, activity log)
- Fully client-side with **localStorage** persistence
- Beautiful dark UI matching the original design language

---

## Quick start with Docker (recommended)

```bash
# Clone or copy this folder to your Linux box
cd vibeops

# Build & run
docker compose up -d --build

# Open
xdg-open http://localhost:3001   # or just visit in browser
```

The app listens on **port 3001** (matching the original “hermes:3001” vibe).

### Useful commands

```bash
docker compose logs -f          # follow logs
docker compose down             # stop
docker compose up -d --build    # rebuild after code changes
```

---

## Local development (without Docker)

Requires Node 20+.

```bash
npm install
npm run dev          # http://localhost:3001
```

```bash
npm run build
npm run preview      # production build preview
```

---

## Data

All data lives in the browser’s `localStorage` under the key `vibeops-storage`.

- Clear data: open DevTools → Application → Local Storage → delete the key  
- Export: you can copy the JSON from localStorage if you want a backup

No backend, no accounts, no telemetry.

---

## Project structure

```
src/
├── components/
│   ├── Sidebar.tsx
│   ├── Header.tsx
│   ├── StatusCards.tsx
│   ├── ProjectList.tsx
│   └── ProjectDrawer.tsx
├── store/
│   └── useProjectStore.ts      # Zustand + persist
├── types/
│   └── index.ts
├── lib/
│   └── utils.ts
├── App.tsx
└── index.css                   # Tailwind v4 + design tokens
```

---

## Customization

Design tokens live in `src/index.css` under `@theme`.  
Change the purple accent or surface colors there.

---

## License

MIT — do whatever you want with it.
