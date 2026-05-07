import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  CircuitBoard,
  Layers,
  Brain,
  BarChart3,
  MemoryStick,
  Menu,
  X,
  Play,
} from 'lucide-react';
import { cn } from '../lib/utils';

interface LandingPageProps {
  onDeploy: () => void;
}


export default function LandingPage({ onDeploy }: LandingPageProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-surface font-sans selection:bg-tertiary selection:text-on-tertiary">
      {/* Navbar */}
      <nav className="bg-surface-container-lowest w-full flex justify-between items-center px-6 md:px-10 h-16 shrink-0 sticky top-0 z-50 border-b border-outline-variant/10">
        <div className="flex items-center gap-8">
          <button onClick={() => scrollTo('hero')} className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-primary flex items-center justify-center">
              <CircuitBoard className="w-4 h-4 text-white" />
            </div>
            <span className="font-headline font-black tracking-[0.15em] text-base text-primary">MEMSIM PRO</span>
          </button>
          <div className="hidden md:flex gap-6 items-center">
            {[
              { label: 'Features', id: 'features' },
              { label: 'Algorithms', id: 'algorithms' },
              { label: 'How It Works', id: 'how-it-works' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="text-on-surface-variant hover:text-primary transition-colors font-sans text-[11px] font-bold tracking-widest uppercase"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onDeploy}
            className="hidden md:flex bg-primary text-on-primary font-sans text-[11px] font-bold tracking-widest uppercase px-6 py-2 rounded-none hover:bg-zinc-800 transition-colors items-center gap-2"
          >
            <Play className="w-3 h-3 fill-current" />
            Launch Simulator
          </button>
          <button
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
            className="md:hidden p-2 text-on-surface hover:bg-surface-container-low transition-colors"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="md:hidden fixed inset-x-0 top-16 z-40 bg-surface-container-lowest border-b border-outline-variant/20 shadow-lg"
          >
            <div className="flex flex-col p-6 gap-1">
              {[
                { label: 'Features', id: 'features' },
                { label: 'Algorithms', id: 'algorithms' },
                { label: 'How It Works', id: 'how-it-works' },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className="text-left text-on-surface-variant hover:text-primary font-sans text-sm font-bold tracking-widest uppercase py-3 border-b border-outline-variant/10 transition-colors"
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={onDeploy}
                className="mt-4 bg-primary text-on-primary font-sans text-sm font-bold tracking-widest uppercase px-6 py-3 hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
              >
                <Play className="w-3 h-3 fill-current" />
                Launch Simulator
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-grow flex flex-col w-full">
        {/* Hero */}
        <section id="hero" className="w-full min-h-[90vh] bg-surface flex flex-col relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-20 grid-bg" />
          <div className="flex-grow grid grid-cols-1 lg:grid-cols-12 relative z-10">
            {/* Left text */}
            <div className="lg:col-span-5 flex flex-col justify-center px-8 sm:px-12 lg:px-24 py-16 bg-surface-container-lowest border-r border-outline-variant/20">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[10px] font-black text-tertiary uppercase tracking-[0.3em] mb-6"
              >
                Virtual Memory Simulator
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="font-headline text-[3rem] sm:text-[3.5rem] leading-[1.1] font-extralight text-primary mb-6 tracking-tighter"
              >
                Determined<br />
                <strong className="font-bold">Memory State<br />Simulation</strong>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="font-sans text-base text-on-surface-variant mb-10 max-w-sm leading-relaxed"
              >
                Execute, analyze, and compare virtual memory paging algorithms step by step. Watch exactly how LRU, FIFO, and Optimal handle page faults in real time.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
              >
                <button
                  onClick={onDeploy}
                  className="bg-primary text-on-primary font-sans text-[11px] font-bold tracking-widest uppercase px-8 py-4 hover:bg-zinc-800 transition-colors rounded-none flex items-center gap-2"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Deploy Workspace
                </button>
                <button
                  onClick={() => scrollTo('features')}
                  className="text-tertiary font-sans text-[11px] font-bold tracking-widest uppercase flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  See Features <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
              {/* Quick stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-10 pt-8 border-t border-outline-variant/20 grid grid-cols-3 gap-4"
              >
                {[
                  { label: 'Algorithms', value: '3' },
                  { label: 'Max Frames', value: '8' },
                  { label: 'Step-by-step', value: '✓' },
                ].map(s => (
                  <div key={s.label}>
                    <div className="font-headline font-black text-2xl text-primary">{s.value}</div>
                    <div className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant mt-1">{s.label}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right: Technical Visualization Monolith */}
            <div className="lg:col-span-7 bg-gray-100 relative flex flex-col min-h-[380px]">
              <div className="h-16 border-b border-outline-variant/20 flex items-center px-8 bg-surface-container-low shrink-0">
                <span className="font-sans text-[10px] tracking-widest uppercase text-on-surface-variant">DIAGNOSTIC_RENDER_VP_01</span>
              </div>
              <div className="flex-grow relative bg-[#eeeeee] flex items-center justify-center p-12 overflow-hidden">
                <div
                  className="w-full h-full relative border border-outline-variant/20 shadow-2xl"
                  style={{
                    backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB7gZ5Q9WkZo0I-WTtIgbdRT0wmrBHFNLgfgbyl0CpZTHPxdzBDt8z98gETFzkI6J93-NkhjAifed11jlLJSxp7RgvsOgB1_v-xyvfVP-jteuZ-vVzzDrcPmlTUIekje6GZPT2_Rd9fBlF4CQnhuRh-gnwmyMpiTTv5m7JELHtPxUg79T-SDuSm9KJyCCn3ikupIEmbLNyXICY_wcQl6XcIX4vT0tYQT3olRFZvHZy5gdhekOcguTE_vM6BmTyDGqo5uIAFD_dzTMx2')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <div className="absolute inset-0 bg-primary/20 mix-blend-color" />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="absolute bottom-8 right-8 bg-surface-container-lowest p-6 border border-outline-variant/20 max-w-xs backdrop-blur-sm"
                  >
                    <div className="font-sans text-[10px] tracking-widest uppercase text-tertiary mb-4 font-bold">REALTIME_METRICS</div>
                    <div className="space-y-4">
                      <MetricItem label="PAGE_FAULTS" value="1,402" />
                      <MetricItem label="TLB_HIT_RATE" value="94.2%" />
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-24 px-8 sm:px-12 lg:px-24 bg-surface-container border-t border-outline-variant/20">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16">
              <span className="font-sans text-[11px] text-tertiary font-bold tracking-widest uppercase mb-4 block">CORE_CAPABILITIES</span>
              <h2 className="font-headline text-3xl font-light text-primary leading-tight">
                Engineered for absolute fidelity in<br /><strong className="font-bold">system-level analysis.</strong>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FeatureCard
                icon={<Layers className="w-8 h-8" />}
                title="Architectural Fidelity"
                desc="Simulate page table hierarchies and physical frame registers precisely aligned with real operating system memory management units."
                tag="SYS_DEF_V2"
              />
              <FeatureCard
                icon={<Brain className="w-8 h-8" />}
                title="Algorithmic Precision"
                desc="Choose between LRU, FIFO, and Optimal replacement strategies. Observe deterministic step-by-step outcomes for any reference string."
                tag="EXEC_ENV"
              />
              <FeatureCard
                icon={<BarChart3 className="w-8 h-8" />}
                title="Real-time Telemetry"
                desc="Track hit ratio, fault count, and a timestamped event log as the simulation plays. Control playback speed from slow to maximum."
                tag="METRICS_STREAM"
              />
            </div>
          </div>
        </section>

        {/* Algorithms */}
        <section id="algorithms" className="py-24 px-8 sm:px-12 lg:px-24 bg-surface-container-lowest border-t border-outline-variant/20">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16 border-l-4 border-tertiary pl-8">
              <span className="font-sans text-[11px] text-tertiary font-bold tracking-widest uppercase mb-4 block">REPLACEMENT_POLICIES</span>
              <h2 className="font-headline text-4xl font-light text-primary tracking-tight">
                Three algorithms.<br /><strong className="font-bold">One simulator.</strong>
              </h2>
              <p className="font-sans text-base text-on-surface-variant mt-6 max-w-2xl leading-relaxed">
                Compare the behavior and efficiency of the three most fundamental page replacement strategies, side by side.
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 border border-outline-variant/20 overflow-hidden">
              <AlgoCol tag="LRU" title="Least Recently Used" badge="Most Common" active
                desc="Evicts the page that has not been accessed for the longest time. Tracks per-frame access timestamps — the most practical real-world policy." />
              <AlgoCol tag="FIFO" title="First In, First Out" badge="Simplest"
                desc="Evicts the page that was loaded into memory earliest, regardless of how frequently or recently it has been accessed since." />
              <AlgoCol tag="OPT" title="Optimal" badge="Best Possible"
                desc="Evicts the page whose next use is farthest in the future. Requires future knowledge — a theoretical lower bound on faults." />
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-24 px-8 sm:px-12 lg:px-24 bg-surface-container border-t border-outline-variant/20 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-5 grid-bg" style={{ backgroundSize: '32px 32px' }} />
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="mb-16">
              <span className="font-sans text-[11px] text-tertiary font-bold tracking-widest uppercase mb-4 block">WORKFLOW</span>
              <h2 className="font-headline text-3xl font-light text-primary tracking-tight">How it works</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border border-outline-variant/20 overflow-hidden">
              {[
                { step: '01', title: 'Configure', desc: 'Set physical frame count (2–8), virtual page range, and the replacement algorithm.' },
                { step: '02', title: 'Input', desc: 'Enter your reference string manually or append random page numbers one at a time.' },
                { step: '03', title: 'Simulate', desc: 'Press Initialize Trace to begin auto-playback. Control the step speed: LOW, MED, or MAX.' },
                { step: '04', title: 'Analyze', desc: 'Watch the event log, hit ratio, and fault count update live with every single step.' },
              ].map((item, i) => (
                <div key={item.step} className={cn('p-8 flex flex-col gap-3 bg-surface-container-lowest', i < 3 && 'border-b sm:border-b-0 sm:border-r border-outline-variant/20')}>
                  <span className="font-headline font-black text-4xl text-outline-variant/30">{item.step}</span>
                  <h3 className="font-headline font-bold text-lg text-primary">{item.title}</h3>
                  <p className="font-sans text-sm text-on-surface-variant leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-12 flex justify-center">
              <button
                onClick={onDeploy}
                className="bg-primary text-on-primary font-sans text-[11px] font-bold tracking-widest uppercase px-10 py-4 hover:bg-zinc-800 transition-colors rounded-none flex items-center gap-3"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Start Simulating Now
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-zinc-900 text-white w-full px-8 md:px-10 py-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-t border-zinc-800 pt-8">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-6 h-6 bg-white flex items-center justify-center">
                <CircuitBoard className="w-3.5 h-3.5 text-black" />
              </div>
              <span className="font-headline font-black tracking-[0.15em] text-sm">MEMSIM PRO</span>
            </div>
            <p className="font-sans text-[11px] font-medium tracking-wide uppercase text-zinc-500 leading-relaxed">
              A virtual memory paging simulator.<br />Built for students and systems engineers.
            </p>
          </div>
          <div className="flex flex-col items-start md:items-end gap-3">
            <div className="flex gap-6 flex-wrap">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="font-sans text-[10px] font-medium tracking-widest uppercase text-zinc-500 hover:text-white transition-colors">GitHub</a>
              <button onClick={() => scrollTo('features')} className="font-sans text-[10px] font-medium tracking-widest uppercase text-zinc-500 hover:text-white transition-colors">Features</button>
              <button onClick={() => scrollTo('algorithms')} className="font-sans text-[10px] font-medium tracking-widest uppercase text-zinc-500 hover:text-white transition-colors">Algorithms</button>
              <button onClick={onDeploy} className="font-sans text-[10px] font-medium tracking-widest uppercase text-zinc-500 hover:text-white transition-colors">Launch App</button>
            </div>
            <p className="font-sans text-[10px] text-zinc-600">© 2026 MemSim Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function MetricItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-baseline border-b border-outline-variant/20 pb-2">
      <span className="font-sans text-[10px] text-on-surface-variant font-bold uppercase">{label}</span>
      <span className="font-headline font-black text-xl text-primary">{value}</span>
    </div>
  );
}

function FeatureCard({ icon, title, desc, tag }: { icon: React.ReactNode; title: string; desc: string; tag: string }) {
  return (
    <div className="bg-surface-container-lowest p-10 border border-outline-variant/20 flex flex-col hover:bg-white transition-colors group cursor-default">
      <div className="text-primary mb-8 transition-transform group-hover:scale-110 duration-500">{icon}</div>
      <h3 className="font-headline font-bold text-xl mb-4 text-primary">{title}</h3>
      <p className="font-sans text-sm text-on-surface-variant leading-relaxed mb-8 flex-grow">{desc}</p>
      <div className="border-t border-outline-variant/20 pt-4 mt-auto">
        <span className="font-sans text-[10px] tracking-widest uppercase text-tertiary font-bold">{tag}</span>
      </div>
    </div>
  );
}

function AlgoCol({ tag, title, desc, badge, active = false }: { tag: string; title: string; desc: string; badge: string; active?: boolean }) {
  return (
    <div className={cn(
      'p-10 border-b lg:border-b-0 lg:border-r border-outline-variant/20 flex flex-col gap-4 transition-colors last:border-0',
      active ? 'bg-surface-container-low' : 'bg-surface hover:bg-gray-50'
    )}>
      <div className="flex items-center justify-between">
        <span className="font-headline font-black text-2xl text-primary">{tag}</span>
        <span className="text-[9px] font-black uppercase tracking-widest text-tertiary border border-tertiary/30 bg-tertiary/5 px-2 py-1">{badge}</span>
      </div>
      <h3 className="font-headline font-bold text-base text-primary">{title}</h3>
      <p className="font-sans text-[13px] text-on-surface-variant leading-relaxed flex-grow">{desc}</p>
    </div>
  );
}
