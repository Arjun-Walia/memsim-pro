# MemSim Pro

**A visual, interactive Virtual Memory Paging Simulator built with React + TypeScript.**

MemSim Pro lets you step through page replacement algorithms (LRU, FIFO, Optimal) in real time, watching how physical memory frames fill up, how page faults occur, and which pages get evicted — all rendered in a brutalist, engineering-dashboard aesthetic.

---

## Table of Contents

- [What It Does](#what-it-does)
- [How It Works](#how-it-works)
  - [Core Simulation Engine](#core-simulation-engine)
  - [Supported Algorithms](#supported-algorithms)
  - [Simulation Data Flow](#simulation-data-flow)
- [Architecture](#architecture)
  - [Project Structure](#project-structure)
  - [Key Files Explained](#key-files-explained)
  - [Type System](#type-system)
  - [Component Map](#component-map)
- [UI Layout](#ui-layout)
  - [Landing Page](#landing-page)
  - [Simulator View](#simulator-view)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [License](#license)

---

## What It Does

MemSim Pro simulates **demand paging** — the mechanism operating systems use to manage physical memory (RAM) when running programs that reference more pages than can fit in memory at once.

You provide:
1. A **reference string** — a sequence of virtual page numbers the CPU wants to access (e.g., `1, 2, 3, 4, 2, 1, 5, 6`)
2. A **frame count** — how many physical RAM frames are available (e.g., `4`)
3. A **replacement algorithm** — the policy used to decide which page to evict when memory is full

The simulator then walks through each memory access step-by-step, showing you:
- Which page was requested
- Whether it was a **hit** (already in RAM) or a **fault** (not in RAM, must be loaded)
- Which page was **evicted** (if any)
- The full state of all physical frames after each step
- Running hit ratio and fault count telemetry

---

## How It Works

### Core Simulation Engine

The simulation engine lives in [`src/logic/vmm.ts`](src/logic/vmm.ts) (Virtual Memory Manager). It is a pure function:

```typescript
function simulate(
  references: number[],   // e.g. [1, 2, 3, 4, 2, 1, 5, 6, 2, 1]
  frameCount: number,     // e.g. 4
  algorithm: AlgorithmType // 'LRU' | 'FIFO' | 'Optimal'
): SimulationResult
```

For each page reference, the engine:

1. **Checks for a hit** — Is the page already in one of the physical frames?
   - **Yes → Hit.** For LRU, update the page's last-access timestamp.
   - **No → Fault.** The page must be loaded into a frame.

2. **On a fault, checks for an empty frame** — Is there a free slot?
   - **Yes →** Load the page into the empty frame.
   - **No → Eviction required.** Select a victim page using the chosen algorithm.

3. **Records the step** — Captures the full frame state, hit/fault flag, evicted page, and a human-readable description.

### Supported Algorithms

| Algorithm | Strategy | How Victim Is Selected |
|-----------|----------|----------------------|
| **LRU** (Least Recently Used) | Evicts the page that hasn't been accessed for the longest time | Tracks per-frame `accessTimes[]`; picks the frame with the smallest (oldest) access timestamp |
| **FIFO** (First-In First-Out) | Evicts the page that was loaded earliest | Tracks per-frame `loadTimes[]`; picks the frame with the smallest (oldest) load timestamp |
| **Optimal** | Evicts the page that won't be needed for the longest time in the future | Scans the remaining reference string for each resident page; evicts the one whose next use is farthest away (or never used again) |

> **Note:** The Optimal algorithm requires future knowledge of the reference string — it's a theoretical benchmark, not implementable in real OS kernels. It represents the best-possible eviction strategy.

### Simulation Data Flow

```
User Input                    Simulation Engine                  UI Rendering
─────────────                 ─────────────────                  ────────────
referenceString ──┐
frameCount ───────┤──► simulate() ──► SimulationResult ──► App state
algorithm ────────┘                        │
                                           ├── steps[] ──────► Step-by-step playback
                                           ├── totalFaults ──► Telemetry cards
                                           ├── totalHits ────► Hit ratio display
                                           └── hitRatio ─────► Percentage metric
```

The simulation runs **eagerly** — every time `algorithm`, `frameCount`, or `referenceString` changes, the full simulation is re-computed via a `useEffect`. Playback is then driven by a timer that increments `currentStep`.

---

## Architecture

### Project Structure

```
memsim-pro/
├── index.html                 # Vite HTML entry point
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
├── vite.config.ts             # Vite + React + TailwindCSS v4 plugin config
│
└── src/
    ├── main.tsx               # React DOM entry — mounts <App />
    ├── index.css              # Global styles, design tokens, Tailwind theme
    ├── types.ts               # TypeScript interfaces for simulation data
    ├── App.tsx                 # Main app: navigation + full simulator UI
    │
    ├── components/
    │   └── LandingPage.tsx    # Marketing/hero landing page component
    │
    ├── lib/
    │   └── utils.ts           # cn() utility — merges Tailwind classes
    │
    └── logic/
        └── vmm.ts             # Core simulation engine (pure function)
```

### Key Files Explained

| File | Purpose |
|------|---------|
| **`vmm.ts`** | The simulation brain. A single `simulate()` function that takes inputs and returns a complete `SimulationResult` with every step pre-computed. No side effects, no state — fully deterministic. |
| **`types.ts`** | Defines `AlgorithmType`, `SimulationStep`, and `SimulationResult`. The step interface captures the page reference, frame snapshot, hit/fault status, evicted page, and description. |
| **`App.tsx`** | The simulator view. Manages all state (algorithm, frame count, reference string, playback position). Renders a 3-column layout: control panel, visualization canvas, telemetry sidebar. Also contains inline `LegendItem` and `TelemetryCard` sub-components. |
| **`LandingPage.tsx`** | A full marketing-style landing page with hero section, feature grid ("Core Capabilities"), and integration ecosystem section. Navigates to the simulator via the `onDeploy` callback. |
| **`index.css`** | Design system definition using TailwindCSS v4's `@theme` directive. Defines the full color palette (primary, surface, error, success, tertiary), typography (Inter for body, Manrope for headlines), and custom scrollbar/grid-background utilities. |
| **`utils.ts`** | Single `cn()` helper combining `clsx` and `tailwind-merge` for conditional class composition. |

### Type System

```typescript
// The three available page replacement algorithms
type AlgorithmType = 'LRU' | 'FIFO' | 'Optimal';

// A single step in the simulation trace
interface SimulationStep {
  reference: number;            // The virtual page being accessed
  frames: (number | null)[];    // Snapshot of all physical frames after this step
  fault: boolean;               // True if this access caused a page fault
  hit: boolean;                 // True if the page was already resident
  evictedPage: number | null;   // Which page was evicted (null if none)
  description: string;          // Human-readable explanation of what happened
}

// The complete result returned by simulate()
interface SimulationResult {
  steps: SimulationStep[];      // Ordered list of every simulation step
  totalFaults: number;          // Total page faults across all steps
  totalHits: number;            // Total cache hits across all steps
  hitRatio: number;             // Hit percentage (0–100)
}
```

### Component Map

```
<App>
 ├── view === 'landing'
 │    └── <LandingPage onDeploy />
 │         ├── NavItem (×4)
 │         ├── Hero section with MetricItem cards
 │         ├── FeatureCard (×3) — bento grid
 │         ├── EcoCol (×3) — integration ecosystem
 │         └── FooterLink (×4)
 │
 └── view === 'simulator'
      ├── Header bar (back button, status, shell link)
      ├── Left Sidebar — SIM_SPECIFICATIONS
      │    ├── Algorithm selector (dropdown)
      │    ├── Frame count slider (2–8)
      │    ├── Virtual pages slider (4–12)
      │    ├── Reference string editor (textarea)
      │    ├── [INITIALIZE_TRACE] button
      │    └── [SYNC_RESETS] button
      │
      ├── Center Canvas — Memory_Address_Map
      │    ├── Legend (Active, Hit, Fault, Empty)
      │    ├── VP_SPACE_DUMP — virtual page grid
      │    ├── HW_FRAME_REGS — physical frame list
      │    └── Trace_Diagnostic overlay (animated)
      │
      └── Right Sidebar — TELEMETRY_STREAM
           ├── TelemetryCard: Trace_Hit_Yield (%)
           ├── TelemetryCard: Absolute_Fault_Count
           ├── Event_Trace_Ledger (scrollable log)
           └── Temporal_Resolution speed selector
```

---

## UI Layout

### Landing Page

The landing page acts as a marketing entry point with a brutalist, technical aesthetic:

- **Hero Section** — Split layout: left side has the main heading ("Determined Memory State Simulation") with a "Deploy Workspace" CTA; right side shows a diagnostic visualization panel with real-time metrics overlay.
- **Core Capabilities** — Three feature cards describing Architectural Fidelity, Algorithmic Precision, and Real-time Telemetry.
- **Integration Ecosystem** — Three-column section describing hypothetical tool integrations (GDB bridge, LLVM instrumentation, custom MMU modules) with a visual IPC bridge diagram.
- **Footer** — Dark footer with links to manual, security audit, API spec, and license.

Clicking **"DEPLOY WORKSPACE"** or **"INITIALIZE_SYS"** transitions to the simulator.

### Simulator View

A full-screen, 3-column dashboard:

| Column | Width | Content |
|--------|-------|---------|
| **Left** | 300px | Control panel — configure algorithm, frame count, virtual pages, reference string. Run/reset buttons. |
| **Center** | Flex | Main visualization — virtual page grid (color-coded by state) and physical frame registers. An animated diagnostic overlay appears after each step. |
| **Right** | 300px | Telemetry — live hit ratio, fault count, timestamped event log, playback speed controls (LOW/MED/MAX). |

**Color coding in the visualization:**

| Color | Meaning |
|-------|---------|
| Dark/Black (`bg-zinc-900`) | Page is currently resident in a physical frame |
| Green (`bg-success`) | Current access was a cache hit |
| Red (`bg-error`) | Current access triggered a page fault |
| Light/Empty (`bg-surface`) | Frame is unoccupied |

**Playback system:**
- Press **INITIALIZE_TRACE** to start auto-stepping from the beginning
- Steps advance automatically at the selected speed (1200ms / 600ms / 200ms intervals)
- Press **SYNC_RESETS** to reset to the initial state
- The simulation re-runs automatically whenever you change the algorithm, frame count, or reference string

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19 | UI framework |
| **TypeScript** | 5.8 | Type safety |
| **Vite** | 6.x | Build tool and dev server |
| **TailwindCSS** | 4.x | Utility-first CSS (v4 with `@theme` tokens) |
| **Motion** (Framer Motion) | 12.x | Layout animations and transitions |
| **Recharts** | 3.x | Chart library (imported but not actively used in current build) |
| **Lucide React** | 0.546 | Icon set |
| **clsx + tailwind-merge** | — | Conditional class name composition |

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** (comes with Node)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd memsim-pro

# Install dependencies
npm install
```

### Development

```bash
# Start the dev server on port 3000
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
# Create a production build
npm run build

# Preview the production build locally
npm run preview
```

### Other Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server (port 3000, HMR enabled) |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run clean` | Remove the `dist/` directory |
| `npm run lint` | Run TypeScript type checking (`tsc --noEmit`) |

---

## Configuration

### Design Tokens

All design tokens are defined in [`src/index.css`](src/index.css) using TailwindCSS v4's `@theme` directive:

```css
@theme {
  --color-primary: #000000;        /* Black — headings, buttons, frames */
  --color-surface: #f9f9f9;        /* Light gray — main background */
  --color-tertiary: #23308e;       /* Deep blue — accent, indicators */
  --color-error: #ba1a1a;          /* Red — page faults */
  --color-success: #15803d;        /* Green — cache hits */
  --font-sans: "Inter", ...;       /* Body text */
  --font-headline: "Manrope", ...; /* Headlines and labels */
}
```

### Vite Config

The Vite configuration ([`vite.config.ts`](vite.config.ts)) includes:
- `@vitejs/plugin-react` — React JSX transform
- `@tailwindcss/vite` — TailwindCSS v4 integration
- Path alias `@` mapped to project root
- Optional `GEMINI_API_KEY` environment variable passthrough
- Configurable HMR via `DISABLE_HMR` env flag

---

## License

© 2026 Architectural Ledger Systems Lab. All rights reserved.
