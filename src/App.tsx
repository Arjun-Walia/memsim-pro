import { useState, useEffect } from 'react';
import {
  MemoryStick,
  Cpu,
  Activity,
  Settings2,
  Play,
  Plus,
  ArrowLeft,
  ChevronDown,
  BarChart3,
  RotateCcw,
  CircuitBoard,
  SlidersHorizontal,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AlgorithmType, SimulationResult } from './types';
import { simulate } from './logic/vmm';
import { cn } from './lib/utils';
import LandingPage from './components/LandingPage';

type MobileTab = 'controls' | 'visualizer' | 'telemetry';

export default function App() {
  const [view, setView] = useState<'landing' | 'simulator'>('landing');
  const [mobileTab, setMobileTab] = useState<MobileTab>('visualizer');

  // Simulator state
  const [algorithm, setAlgorithm] = useState<AlgorithmType>('LRU');
  const [frameCount, setFrameCount] = useState<number>(4);
  const [virtualPages, setVirtualPages] = useState<number>(8);
  const [referenceString, setReferenceString] = useState<number[]>([1, 2, 3, 4, 2, 1, 5, 6, 2, 1, 2, 3, 7, 6, 3, 2]);
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(800);

  const currentStepData = simulationResult?.steps[currentStep] || null;
  const history = simulationResult?.steps.slice(0, currentStep + 1).reverse() || [];

  useEffect(() => {
    const result = simulate(referenceString, frameCount, algorithm);
    setSimulationResult(result);
    setCurrentStep(-1);
    setIsPlaying(false);
  }, [algorithm, frameCount, referenceString]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isPlaying && simulationResult && currentStep < simulationResult.steps.length - 1) {
      timer = setTimeout(() => setCurrentStep(prev => prev + 1), playbackSpeed);
    } else {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, simulationResult, playbackSpeed]);

  const handleRunSimulation = () => {
    setCurrentStep(0);
    setIsPlaying(true);
  };

  const handleReset = () => {
    setCurrentStep(-1);
    setIsPlaying(false);
  };

  const updateReferenceString = (val: string) => {
    const arr = val.split(/[,\s]+/).map(n => parseInt(n.trim())).filter(n => !isNaN(n));
    setReferenceString(arr);
  };

  const addRandomReference = () => {
    setReferenceString(prev => [...prev, Math.floor(Math.random() * virtualPages)]);
  };

  if (view === 'landing') {
    return <LandingPage onDeploy={() => setView('simulator')} />;
  }

  // ── Panel: Controls ─────────────────────────────────────────────────────────
  const ControlsPanel = (
    <aside className="flex flex-col overflow-hidden h-full">
      <div className="p-5 border-b border-outline-variant/30 bg-surface-container-low shrink-0">
        <h3 className="text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 text-primary">
          <Settings2 className="w-4 h-4" />
          Sim Specifications
        </h3>
      </div>
      <div className="p-6 flex flex-col gap-6 overflow-y-auto custom-scrollbar flex-1">
        {/* Algorithm */}
        <div className="space-y-3">
          <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block">
            Replacement Policy
          </label>
          <div className="relative">
            <select
              value={algorithm}
              onChange={e => setAlgorithm(e.target.value as AlgorithmType)}
              className="w-full bg-surface border border-outline-variant/30 rounded-none px-4 py-3 text-xs font-bold font-sans outline-none focus:border-primary transition-all cursor-pointer appearance-none"
            >
              <option value="LRU">LRU — Least Recently Used</option>
              <option value="FIFO">FIFO — First In, First Out</option>
              <option value="Optimal">OPT — Theoretical Optimal</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Frame count */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Physical Frames (RAM)</label>
            <span className="text-[11px] font-mono font-bold text-primary">{frameCount}</span>
          </div>
          <input
            type="range" min="2" max="8" value={frameCount}
            onChange={e => setFrameCount(parseInt(e.target.value))}
            className="w-full h-[1px] bg-outline-variant rounded-none appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between text-[9px] text-on-surface-variant/50 font-mono">
            <span>2</span><span>8</span>
          </div>
        </div>

        {/* Virtual pages */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Virtual Page Count</label>
            <span className="text-[11px] font-mono font-bold text-primary">{virtualPages}</span>
          </div>
          <input
            type="range" min="4" max="12" value={virtualPages}
            onChange={e => setVirtualPages(parseInt(e.target.value))}
            className="w-full h-[1px] bg-outline-variant rounded-none appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between text-[9px] text-on-surface-variant/50 font-mono">
            <span>4</span><span>12</span>
          </div>
        </div>

        {/* Reference string */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Reference String</label>
            <button onClick={addRandomReference} title="Add random page" className="text-tertiary hover:opacity-70 transition-opacity flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest">
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>
          <textarea
            value={referenceString.join(', ')}
            onChange={e => updateReferenceString(e.target.value)}
            placeholder="e.g. 1, 2, 3, 4, 2, 1, 5"
            className="w-full h-28 bg-surface-container-low border border-outline-variant/30 px-4 py-3 text-[10px] font-mono focus:ring-1 focus:ring-primary outline-none resize-none"
          />
          <p className="text-[9px] text-on-surface-variant/50">Comma or space separated. Pages must be within 0–{virtualPages - 1}.</p>
        </div>

        {/* Actions */}
        <div className="mt-auto pt-6 border-t border-outline-variant/20 flex flex-col gap-3">
          <button
            onClick={handleRunSimulation}
            disabled={isPlaying || referenceString.length === 0}
            className="w-full h-12 bg-primary hover:bg-zinc-800 disabled:bg-gray-200 disabled:cursor-not-allowed text-on-primary text-[10px] font-bold uppercase tracking-widest rounded-none transition-all active:scale-[0.99] flex items-center justify-center gap-2"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            {isPlaying ? 'Running…' : 'Initialize Trace'}
          </button>
          <button
            onClick={handleReset}
            className="w-full h-11 border border-outline-variant/40 text-on-surface-variant text-[10px] font-bold uppercase tracking-widest rounded-none hover:bg-gray-50 transition-all active:scale-[0.99] flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>
      </div>
    </aside>
  );

  // ── Panel: Visualizer ───────────────────────────────────────────────────────
  const VisualizerPanel = (
    <section className="bg-surface relative flex flex-col min-h-0 overflow-hidden h-full">
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] grid-bg" />

      {/* Header */}
      <div className="p-6 lg:p-8 border-b border-outline-variant/10 relative z-10 shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-headline font-bold text-primary tracking-tight">Memory Address Map</h2>
            <p className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest mt-0.5 opacity-60">Architectural trace of demand paging residency</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <LegendItem color="bg-zinc-900 border-zinc-900" label="Resident" />
            <LegendItem color="bg-success border-success" label="Hit" />
            <LegendItem color="bg-error border-error" label="Fault" />
            <LegendItem color="bg-surface border-outline-variant/30" label="Empty" />
          </div>
        </div>

        {/* Step progress */}
        {simulationResult && (
          <div className="mt-4 flex items-center gap-3">
            <div className="flex-1 h-[2px] bg-outline-variant/20 relative">
              <div
                className="absolute left-0 top-0 h-full bg-primary transition-all duration-300"
                style={{ width: simulationResult.steps.length > 0 ? `${((currentStep + 1) / simulationResult.steps.length) * 100}%` : '0%' }}
              />
            </div>
            <span className="text-[10px] font-mono font-bold text-on-surface-variant shrink-0">
              {Math.max(0, currentStep + 1)}/{simulationResult.steps.length}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8 lg:p-12 relative z-10 custom-scrollbar">
        <div className="max-w-4xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-20">
          {/* Virtual Space */}
          <div className="flex-1 flex flex-col gap-4">
            <div className="text-[10px] font-black text-tertiary uppercase tracking-[0.2em] flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5" />
              Virtual Page Space
            </div>
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: virtualPages }).map((_, i) => {
                const isActive = currentStepData?.reference === i;
                const isResident = !!currentStepData?.frames.includes(i);
                return (
                  <motion.div
                    key={i}
                    layout
                    className={cn(
                      'h-16 border px-4 flex flex-col justify-center transition-all duration-300 truncate',
                      isActive && currentStepData?.fault ? 'bg-error-container border-error text-error' :
                      isActive && currentStepData?.hit   ? 'bg-success-container border-success text-success' :
                      isResident ? 'bg-white border-outline-variant text-on-surface-variant shadow-sm' :
                                   'bg-surface-container border-outline-variant/30 text-on-surface'
                    )}
                  >
                    <span className="text-[8px] font-black uppercase tracking-widest opacity-40">Page {i}</span>
                    <span className="text-xs font-headline font-black tracking-tight mt-0.5 truncate">
                      0x{i.toString(16).padStart(4, '0').toUpperCase()}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Physical Frames */}
          <div className="flex-1 flex flex-col gap-4">
            <div className="text-[10px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2">
              <MemoryStick className="w-3.5 h-3.5" />
              Physical Frame Registers
            </div>
            <div className="flex flex-col gap-3">
              {(currentStepData?.frames ?? Array(frameCount).fill(null)).map((page, i) => (
                <motion.div
                  key={i}
                  layout
                  className={cn(
                    'h-14 border px-5 flex items-center justify-between transition-all duration-300',
                    page !== null
                      ? 'bg-zinc-900 text-white border-zinc-900'
                      : 'bg-surface border-outline-variant/30 border-dashed text-on-surface-variant'
                  )}
                >
                  <div className="flex items-center gap-4 truncate">
                    <span className="text-[9px] font-bold font-mono opacity-50">R_{i.toString().padStart(2, '0')}</span>
                    <div className="w-[1px] h-5 bg-current opacity-20" />
                    <span className="text-xs font-headline font-bold uppercase tracking-wide truncate">
                      {page !== null ? `Page ${page}` : 'Unallocated'}
                    </span>
                  </div>
                  {page !== null && <div className="w-2 h-2 bg-tertiary shadow-[0_0_6px_var(--color-tertiary)] shrink-0" />}
                </motion.div>
              ))}
            </div>

            {/* Diagnostic */}
            <AnimatePresence>
              {currentStepData && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 16 }}
                  className="mt-6 p-6 border border-outline-variant bg-surface-container-lowest relative"
                >
                  <div className="absolute top-0 left-6 -translate-y-1/2 bg-surface-container-lowest px-3 border border-outline-variant text-[9px] font-black uppercase tracking-widest text-tertiary">
                    Trace Diagnostic
                  </div>
                  <div className="flex items-start gap-3">
                    <Activity className={cn('w-5 h-5 flex-shrink-0 mt-0.5', currentStepData.hit ? 'text-tertiary' : 'text-error')} />
                    <div>
                      <p className="text-base font-headline font-black tracking-tight text-primary uppercase">
                        {currentStepData.hit ? 'Cache Hit' : 'Page Fault'}
                      </p>
                      <p className="text-xs text-on-surface-variant font-medium mt-1 leading-relaxed opacity-80">
                        {currentStepData.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Idle state */}
            {!currentStepData && (
              <div className="mt-6 p-6 border border-outline-variant/20 border-dashed text-center">
                <p className="text-[11px] text-on-surface-variant uppercase tracking-widest font-bold opacity-50">
                  Press "Initialize Trace" to begin simulation
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );

  // ── Panel: Telemetry ────────────────────────────────────────────────────────
  const TelemetryPanel = (
    <aside className="flex flex-col overflow-hidden h-full">
      <div className="p-5 border-b border-outline-variant/30 bg-surface-container-low shrink-0">
        <h3 className="text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 text-primary">
          <BarChart3 className="w-4 h-4" />
          Telemetry Stream
        </h3>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col p-6 gap-6">
        {/* Metrics */}
        <div className="flex flex-col gap-4">
          <TelemetryCard
            label="Hit Ratio"
            value={`${(history.filter(h => h.hit).length / Math.max(1, currentStep + 1) * 100).toFixed(1)}%`}
            sub="Cumulative efficiency rating"
          />
          <TelemetryCard
            label="Page Faults"
            value={String(history.filter(h => h.fault).length)}
            sub="Trap interruptions recorded"
            alert={history.filter(h => h.fault).length > 5}
          />
          {simulationResult && currentStep >= 0 && (
            <TelemetryCard
              label="Total Faults (Full Run)"
              value={String(simulationResult.totalFaults)}
              sub={`Over ${simulationResult.steps.length} references`}
            />
          )}
        </div>

        {/* Event log */}
        <div className="flex-1 flex flex-col min-h-0">
          <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-3 block">Event Log</label>
          <div className="flex-1 min-h-[160px] border border-outline-variant/20 bg-surface-container-low p-3 overflow-y-auto custom-scrollbar font-mono text-[10px] space-y-1.5">
            {history.length > 0 ? history.map((step, i) => (
              <div key={i} className="pb-1.5 border-b border-outline-variant/15 last:border-0">
                <span className={cn('font-bold', step.fault ? 'text-error' : 'text-tertiary')}>
                  {step.fault ? '[FAULT] ' : '[HIT]   '}
                </span>
                <span className="text-on-surface">{step.description}</span>
              </div>
            )) : (
              <div className="text-outline italic">… idle — no trace running …</div>
            )}
          </div>
        </div>

        {/* Playback speed */}
        <div className="flex flex-col gap-2 shrink-0">
          <span className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest">Playback Speed</span>
          <div className="grid grid-cols-3 gap-1">
            {([1200, 600, 200] as const).map(speed => (
              <button
                key={speed}
                onClick={() => setPlaybackSpeed(speed)}
                className={cn(
                  'py-2 text-[9px] font-black border transition-all uppercase tracking-widest',
                  playbackSpeed === speed
                    ? 'bg-primary border-primary text-on-primary'
                    : 'bg-white border-outline-variant/30 text-on-surface-variant hover:bg-gray-50'
                )}
              >
                {speed === 1200 ? 'Slow' : speed === 600 ? 'Med' : 'Fast'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="flex flex-col h-screen bg-surface text-on-surface font-sans overflow-hidden">
      {/* Header */}
      <header className="h-14 bg-surface-container-lowest border-b border-outline-variant/30 flex items-center justify-between px-5 md:px-8 shrink-0 z-30">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setView('landing')}
            aria-label="Back to home"
            className="p-1.5 hover:bg-surface-container-low transition-colors rounded-none"
          >
            <ArrowLeft className="w-4 h-4 text-primary" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary flex items-center justify-center">
              <CircuitBoard className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-headline font-black tracking-[0.15em] text-sm text-primary">MEMSIM PRO</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-surface-container border border-outline-variant/20 ml-2">
            <div className="w-1.5 h-1.5 rounded-full bg-success" />
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Simulator Active</span>
          </div>
        </div>

        {/* Algorithm quick badge */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 border border-outline-variant/20 bg-surface-container">
            <SlidersHorizontal className="w-3 h-3 text-on-surface-variant" />
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{algorithm}</span>
            <span className="text-[10px] text-on-surface-variant">·</span>
            <span className="text-[10px] font-bold text-on-surface-variant">{frameCount} frames</span>
          </div>
        </div>
      </header>

      {/* Desktop: 3-column grid | Mobile: single panel based on active tab */}
      <main className="flex-1 min-h-0 overflow-hidden">
        {/* Desktop layout */}
        <div className="hidden lg:grid grid-cols-[280px_1fr_280px] h-full border-t border-outline-variant/10">
          <div className="border-r border-outline-variant/30 bg-surface-container-lowest overflow-hidden">
            {ControlsPanel}
          </div>
          <div className="overflow-hidden">
            {VisualizerPanel}
          </div>
          <div className="border-l border-outline-variant/30 bg-surface-container-lowest overflow-hidden">
            {TelemetryPanel}
          </div>
        </div>

        {/* Mobile / tablet layout */}
        <div className="lg:hidden flex flex-col h-full">
          <div className="flex-1 min-h-0 overflow-hidden">
            {mobileTab === 'controls' && (
              <div className="h-full bg-surface-container-lowest">{ControlsPanel}</div>
            )}
            {mobileTab === 'visualizer' && (
              <div className="h-full">{VisualizerPanel}</div>
            )}
            {mobileTab === 'telemetry' && (
              <div className="h-full bg-surface-container-lowest">{TelemetryPanel}</div>
            )}
          </div>

          {/* Mobile tab bar */}
          <nav className="shrink-0 border-t border-outline-variant/30 bg-surface-container-lowest grid grid-cols-3 h-14">
            {([
              { key: 'controls',   label: 'Controls',   icon: <Settings2 className="w-4 h-4" /> },
              { key: 'visualizer', label: 'Memory Map', icon: <MemoryStick className="w-4 h-4" /> },
              { key: 'telemetry',  label: 'Telemetry',  icon: <BarChart3 className="w-4 h-4" /> },
            ] as const).map(tab => (
              <button
                key={tab.key}
                onClick={() => setMobileTab(tab.key)}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 text-[9px] font-black uppercase tracking-widest transition-colors',
                  mobileTab === tab.key
                    ? 'text-primary border-t-2 border-primary -mt-px bg-surface-container-low'
                    : 'text-on-surface-variant hover:text-primary'
                )}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </main>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={cn('w-2.5 h-2.5 border', color)} />
      <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{label}</span>
    </div>
  );
}

function TelemetryCard({ label, value, sub, alert = false }: { label: string; value: string; sub: string; alert?: boolean }) {
  return (
    <div className={cn('p-5 border-l-4 transition-all', alert ? 'bg-error-container border-error' : 'bg-surface-container border-tertiary')}>
      <div className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant opacity-60 leading-none mb-1.5">{label}</div>
      <div className={cn('text-3xl font-headline font-black tracking-tighter', alert ? 'text-error' : 'text-primary')}>{value}</div>
      <div className="text-[10px] font-medium text-on-surface-variant mt-1 opacity-40">{sub}</div>
    </div>
  );
}
