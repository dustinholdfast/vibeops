# VibeOps

**Local-first vibe coding project tracker.**

Dark, focused dashboard for tracking side projects / vibe-coding experiments.  
Everything stays on your machine — nothing leaves the box.

---

## Features

- **Work on this Now** – claim projects as current focus (soft limit of 3 slots, with clear warning when exceeded)
- **Rotting detector** – surfaces projects untouched for 7+ days
- **In Flight** – live counts of Exploring / Building / Testing
- Priority system: **Now / Next / Later**
- Stages: Exploring → Building → Testing → Live → Paused → Archived
- Health: On track / At risk / Blocked
- Target dates with overdue / due-today / due-soon signals
- Project detail drawer (edit next action, stage, priority, health, target date, **progress**, **live & repo URLs**, activity log, touch)
- **Export / Import** JSON for backups and moving data between machines
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
npm run typecheck
npm test             # runs deadline / health pure tests
```

---

## Data

All data lives in the browser’s `localStorage` under the key `vibeops-storage`.

- **Export**: use the Export button in the header (downloads a versioned JSON snapshot)
- **Import**: use the Import button and choose a previously exported JSON file (replaces current data after confirmation)
- Clear data: open DevTools → Application → Local Storage → delete the key, or use Import with an empty `projects` array

No backend, no accounts, no telemetry.

---

## Project structure

```
src/
├── components/
│   ├── Sidebar.tsx
│   ├── Header.tsx          # search, add, export/import
│   ├── StatusCards.tsx     # Now / Rotting / In Flight / Needs Attention
│   ├── ProjectList.tsx
│   └── ProjectDrawer.tsx   # full edit surface including progress + links
├── store/
│   └── useProjectStore.ts  # Zustand + persist + export/import
├── types/
│   └── index.ts
├── lib/
│   ├── utils.ts
│   └── deadline.test.ts
├── App.tsx
└── index.css               # Tailwind v4 + design tokens
```

---

## Customization

Design tokens live in `src/index.css` under `@theme`.  
Change the purple accent or surface colors there.

The soft “Now” limit is controlled by `MAX_NOW_SLOTS` in `src/store/useProjectStore.ts`.

---

## License

MIT — do whatever you want with it.
