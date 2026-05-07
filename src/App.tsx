import { useState, useEffect } from 'react';
import { 
  MemoryStick, 
  Cpu, 
  Activity, 
  Settings2, 
  Play, 
  RotateCcw,
  Plus,
  Info,
  ArrowLeft,
  Terminal as TerminalIcon,
  ChevronDown,
  BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { AlgorithmType, SimulationResult } from './types';
import { simulate } from './logic/vmm';
import { cn } from './lib/utils';
import LandingPage from './components/LandingPage';

export default function App() {
  // Navigation State
  const [view, setView] = useState<'landing' | 'simulator'>('landing');

  // Simulator State
  const [algorithm, setAlgorithm] = useState<AlgorithmType>('LRU');
  const [frameCount, setFrameCount] = useState<number>(4);
  const [virtualPages, setVirtualPages] = useState<number>(8);
  const [referenceString, setReferenceString] = useState<number[]>([1, 2, 3, 4, 2, 1, 5, 6, 2, 1, 2, 3, 7, 6, 3, 2]);
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(800);

  // Derived
  const currentStepData = simulationResult?.steps[currentStep] || null;
  const history = simulationResult?.steps.slice(0, currentStep + 1).reverse() || [];
  
  // Effects
  useEffect(() => {
    const result = simulate(referenceString, frameCount, algorithm);
    setSimulationResult(result);
    setCurrentStep(-1);
    setIsPlaying(false);
  }, [algorithm, frameCount, referenceString]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && simulationResult && currentStep < simulationResult.steps.length - 1) {
      timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, playbackSpeed);
    } else {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, simulationResult, playbackSpeed]);

  // Handlers
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
    const nextRef = Math.floor(Math.random() * 10); // Limited for demo
    setReferenceString([...referenceString, nextRef]);
  };

  if (view === 'landing') {
    return <LandingPage onDeploy={() => setView('simulator')} />;
  }

  return (
    <div className="flex flex-col h-screen bg-surface text-on-surface font-sans overflow-hidden">
      {/* Simulator Header */}
      <header className="h-16 bg-surface-container-lowest border-b border-outline-variant/30 flex items-center justify-between px-10 shrink-0 z-30">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setView('landing')}
              className="p-1.5 hover:bg-surface-container-low transition-colors rounded-none"
            >
              <ArrowLeft className="w-4 h-4 text-primary" />
            </button>
            <span className="font-headline font-black tracking-[0.15em] text-sm text-primary">WORKSPACE_INSTANCE_02</span>
          </div>
          <div className="hidden lg:flex items-center gap-6">
             <div className="flex items-center gap-2 px-3 py-1 bg-surface-container border border-outline-variant/20">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sys_Status:</span>
                <span className="text-[10px] font-bold text-tertiary uppercase tracking-widest">Online_Validated</span>
             </div>
          </div>
        </div>
        <div className="flex items-center gap-6 text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">
          <span className="cursor-pointer hover:text-primary transition-colors">Documentation</span>
          <span className="cursor-pointer hover:text-primary transition-colors">Help_Center</span>
          <div className="w-[1px] h-4 bg-outline-variant/30" />
          <div className="flex items-center gap-2 bg-primary text-on-primary px-4 py-1.5 cursor-pointer hover:bg-zinc-800 transition-colors">
            <TerminalIcon className="w-3 h-3" />
            <span>SHELL_I/F</span>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <main className="flex-1 grid grid-cols-[300px_1fr_300px] gap-0 p-0 min-h-0 bg-surface">
        {/* Left Sidebar: Control Ledger */}
        <aside className="border-r border-outline-variant/30 bg-surface-container-lowest flex flex-col overflow-hidden">
          <div className="p-6 border-b border-outline-variant/30 bg-surface-container-low shrink-0">
            <h3 className="text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 text-primary">
              <Settings2 className="w-4 h-4" />
              SIM_SPECIFICATIONS
            </h3>
          </div>
          <div className="p-8 flex flex-col gap-8 overflow-y-auto custom-scrollbar flex-1">
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block">Replacement_Policy</label>
              <div className="relative group">
                <select 
                  value={algorithm}
                  onChange={(e) => setAlgorithm(e.target.value as AlgorithmType)}
                  className="w-full bg-surface border border-outline-variant/30 rounded-none px-4 py-3 text-xs font-bold font-sans outline-none focus:border-primary transition-all cursor-pointer appearance-none"
                >
                  <option value="LRU">LRU (Longest Unused)</option>
                  <option value="FIFO">FIFO (Temporal Queue)</option>
                  <option value="Optimal">OPT (Theoretical Optimal)</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Physical_RAM_Units</label>
                <span className="text-[11px] font-mono font-bold text-primary">{frameCount}</span>
              </div>
              <input 
                type="range" 
                min="2" 
                max="8" 
                value={frameCount}
                onChange={(e) => setFrameCount(parseInt(e.target.value))}
                className="w-full h-[1px] bg-outline-variant rounded-none appearance-none cursor-pointer accent-primary"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Virtual_Addressing_Max</label>
                <span className="text-[11px] font-mono font-bold text-primary">{virtualPages}</span>
              </div>
              <input 
                type="range" 
                min="4" 
                max="12" 
                value={virtualPages}
                onChange={(e) => setVirtualPages(parseInt(e.target.value))}
                className="w-full h-[1px] bg-outline-variant rounded-none appearance-none cursor-pointer accent-primary"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Access_Buffer_Ref</label>
                <button onClick={addRandomReference} className="text-tertiary hover:opacity-80 transition-opacity">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <textarea 
                value={referenceString.join(', ')}
                onChange={(e) => updateReferenceString(e.target.value)}
                className="w-full h-32 bg-surface-container-low border border-outline-variant/30 px-4 py-4 text-[10px] font-mono focus:ring-1 focus:ring-primary outline-none resize-none"
              />
            </div>

            <div className="mt-auto pt-8 border-t border-outline-variant/20 flex flex-col gap-4">
              <button 
                onClick={handleRunSimulation}
                disabled={isPlaying}
                className="w-full h-12 bg-primary hover:bg-zinc-800 disabled:bg-gray-200 text-on-primary text-[10px] font-bold uppercase tracking-widest rounded-none transition-all active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                INITIALIZE_TRACE
              </button>
              <button 
                onClick={handleReset}
                className="w-full h-12 border border-outline-variant/40 text-on-surface-variant text-[10px] font-bold uppercase tracking-widest rounded-none hover:bg-gray-50 transition-all active:scale-[0.99]"
              >
                SYNC_RESETS
              </button>
            </div>
          </div>
        </aside>

        {/* Visualizer Frame */}
        <section className="bg-surface relative flex flex-col min-h-0 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] grid-bg"></div>
          
          <div className="p-10 border-b border-outline-variant/10 flex items-center justify-between relative z-10 shrink-0">
             <div className="flex flex-col">
               <h3 className="text-xl font-headline font-bold text-primary tracking-tight">Memory_Address_Map</h3>
               <p className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest mt-1 opacity-60">Architectural trace of demand paging residency</p>
             </div>
             <div className="flex gap-4">
               <LegendItem color="bg-zinc-900 border-zinc-900" label="Active_Resident" />
               <LegendItem color="bg-success border-success" label="Cache_Hit" />
               <LegendItem color="bg-error border-error" label="Access_Fault" />
               <LegendItem color="bg-surface border-outline-variant/30" label="Frame_Empty" />
             </div>
          </div>

          <div className="flex-1 overflow-y-auto p-12 relative z-10 custom-scrollbar">
            <div className="max-w-4xl mx-auto flex flex-col lg:flex-row gap-20 items-stretch h-full">
               {/* Virtual Space Column */}
               <div className="flex-1 flex flex-col gap-6">
                 <div className="text-[10px] font-black text-tertiary uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <Cpu className="w-3.5 h-3.5" />
                    VP_SPACE_DUMP
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                   {Array.from({ length: virtualPages }).map((_, i) => {
                     const isActive = currentStepData?.reference === i;
                     const isResident = !!currentStepData?.frames.includes(i);
                     return (
                       <motion.div 
                        key={i}
                        layout
                        className={cn(
                          "h-20 border px-5 flex flex-col justify-center transition-all duration-300 relative group truncate",
                          isActive && currentStepData.fault ? "bg-error-container border-error text-error" :
                          isActive && currentStepData.hit ? "bg-success-container border-success text-success" :
                          isResident ? "bg-white border-outline-variant text-on-surface-variant shadow-sm" :
                          "bg-surface-container border-outline-variant/30 text-on-surface"
                        )}
                       >
                         <span className="text-[8px] font-black uppercase tracking-widest opacity-40">Entry_ID: {i}</span>
                         <span className="text-sm font-headline font-black tracking-tight mt-1 whitespace-nowrap overflow-hidden text-ellipsis">PAGE_ADDR_{i.toString(16).padStart(4, '0').toUpperCase()}</span>
                       </motion.div>
                     );
                   })}
                 </div>
               </div>

               {/* Physical Frame Column */}
               <div className="flex-1 flex flex-col gap-6">
                  <div className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <MemoryStick className="w-3.5 h-3.5" />
                    HW_FRAME_REGS
                 </div>
                 <div className="flex flex-col gap-4">
                    {currentStepData?.frames.map((page, i) => (
                      <motion.div 
                        key={i}
                        layout
                        className={cn(
                          "h-16 border px-6 flex items-center justify-between transition-all duration-300",
                          page !== null ? "bg-zinc-900 text-white border-zinc-900" : "bg-surface border-outline-variant/30 border-dashed text-on-surface-variant"
                        )}
                      >
                         <div className="flex items-center gap-4 truncate">
                           <span className="text-[9px] font-bold font-mono opacity-50">#R_{i.toString().padStart(2, '0')}</span>
                           <div className="w-[1px] h-6 bg-current opacity-20" />
                           <span className="text-xs font-headline font-bold uppercase tracking-wide truncate">
                             {page !== null ? `DATA_SECT_PAGE_${page}` : 'NOT_INITIALIZED'}
                           </span>
                         </div>
                         {page !== null && (
                            <div className="w-2 h-2 bg-tertiary shadow-[0_0_8px_var(--color-tertiary)]" />
                         )}
                      </motion.div>
                    )) || Array.from({ length: frameCount }).map((_, i) => (
                      <div key={i} className="h-16 border border-outline-variant/30 border-dashed bg-surface flex items-center px-6 text-[11px] font-medium text-on-surface">
                        PENDING_RESIDENCY_FRAME_{i}
                      </div>
                    ))}
                 </div>

                 {/* Diagnostic Overlay */}
                 <AnimatePresence>
                   {currentStepData && (
                     <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="mt-20 p-8 border border-outline-variant bg-surface-container-lowest relative"
                     >
                       <div className="absolute top-0 left-8 -translate-y-1/2 bg-surface-container-lowest px-4 border border-outline-variant text-[9px] font-black uppercase tracking-widest text-tertiary">Trace_Diagnostic</div>
                       <div className="flex items-start gap-4">
                          <Activity className={cn("w-5 h-5 flex-shrink-0 mt-1", currentStepData.hit ? "text-tertiary" : "text-error")} />
                          <div>
                            <span className="text-xl font-headline font-black tracking-tight text-primary uppercase">{currentStepData.hit ? 'Instruction_Cache_Hit' : 'Page_Residency_Fault'}</span>
                            <p className="text-xs text-on-surface-variant font-medium mt-2 leading-relaxed opacity-80">{currentStepData.description.toUpperCase()}</p>
                          </div>
                       </div>
                     </motion.div>
                   )}
                 </AnimatePresence>
               </div>
            </div>
          </div>
        </section>

        {/* Right Sidebar: Telemetry Logs */}
        <aside className="border-l border-outline-variant/30 bg-surface-container-lowest flex flex-col overflow-hidden">
          <div className="p-6 border-b border-outline-variant/30 bg-surface-container-low shrink-0">
            <h3 className="text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 text-primary">
              <BarChart3 className="w-4 h-4" />
              TELEMETRY_STREAM
            </h3>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col p-8 gap-8">
            <div className="flex flex-col gap-6">
               <TelemetryCard 
                label="Trace_Hit_Yield" 
                value={`${(history.filter(h => h.hit).length / (currentStep + 1) * 100 || 0).toFixed(1)}%`}
                sub="Cumulative efficiency rating"
               />
               <TelemetryCard 
                label="Absolute_Fault_Count" 
                value={String(history.filter(h => h.fault).length)}
                sub="Trap interruptions recorded"
                alert={history.filter(h => h.fault).length > 5}
               />
            </div>

            <div className="mt-4 flex-1 flex flex-col min-h-0 min-h-0">
               <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-4">Event_Trace_Ledger</label>
               <div className="flex-1 border border-outline-variant/20 bg-surface-container-low p-4 overflow-y-auto custom-scrollbar font-mono text-[10px] space-y-2 selection:bg-primary selection:text-white">
                 {history.length > 0 ? history.map((step, i) => (
                   <div key={i} className="pb-2 border-b border-outline-variant/20 last:border-0 truncate">
                      <span className="text-outline mr-2">[{new Date().toTimeString().split(' ')[0]}]</span>
                      <span className={cn("font-bold", step.fault ? "text-error" : "text-tertiary")}>
                        {step.fault ? 'ERR_FAULT:' : 'SUC_HIT:'}
                      </span>
                      <span className="text-on-surface ml-1">{step.description.toUpperCase()}</span>
                   </div>
                 )) : (
                   <div className="text-outline italic">... IDLE_STREAM ...</div>
                 )}
               </div>
            </div>

            <div className="flex flex-col gap-3">
               <span className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest">Temporal_Resolution</span>
               <div className="grid grid-cols-3 gap-1">
                 {[1200, 600, 200].map(speed => (
                   <button 
                    key={speed}
                    onClick={() => setPlaybackSpeed(speed)}
                    className={cn(
                      "py-2 text-[8px] font-black border transition-all",
                      playbackSpeed === speed ? "bg-primary border-primary text-on-primary" : "bg-white border-outline-variant/30 text-on-surface-variant hover:bg-gray-50"
                    )}
                   >
                     {speed > 800 ? 'LOW' : speed > 400 ? 'MED' : 'MAX'}
                   </button>
                 ))}
               </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={cn("w-2.5 h-2.5 border", color)} />
      <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{label}</span>
    </div>
  );
}

function TelemetryCard({ label, value, sub, alert = false }: { label: string; value: string; sub: string; alert?: boolean }) {
  return (
    <div className={cn(
      "p-6 border-l-4 transition-all",
      alert ? "bg-error-container border-error" : "bg-surface-container border-tertiary"
    )}>
      <div className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant opacity-60 leading-none mb-2">{label}</div>
      <div className={cn("text-3xl font-headline font-black tracking-tighter", alert ? "text-error" : "text-primary")}>{value}</div>
      <div className="text-[10px] font-medium text-on-surface-variant mt-2 opacity-40">{sub.toUpperCase()}</div>
    </div>
  );
}
