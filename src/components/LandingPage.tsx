import React from 'react';
import { motion } from 'motion/react';
import { 
  ArrowRight, 
  CircuitBoard, 
  Layers, 
  Brain, 
  BarChart3, 
  Bug, 
  Network, 
  MemoryStick, 
  Sliders, 
  Terminal,
  Code2
} from 'lucide-react';
import { cn } from '../lib/utils';

interface LandingPageProps {
  onDeploy: () => void;
}

export default function LandingPage({ onDeploy }: LandingPageProps) {
  return (
    <div className="flex flex-col min-h-screen bg-surface font-sans selection:bg-tertiary selection:text-on-tertiary">
      {/* TopNavBar */}
      <nav className="bg-surface-container-lowest text-on-surface w-full flex justify-between items-center px-10 h-16 shrink-0 sticky top-0 z-50 border-b border-outline-variant/10">
        <div className="flex items-center gap-8">
          <span className="font-headline font-black tracking-[0.2em] text-lg text-primary">VM_SIMULATOR_CORE</span>
          <div className="hidden md:flex gap-6 items-center">
            <NavItem label="ARCHITECTURES" />
            <NavItem label="ALGORITHMS" />
            <NavItem label="PAGE_TABLES" />
            <NavItem label="TELEMETRY" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-on-surface-variant hover:bg-surface-container-low transition-colors p-2 flex items-center justify-center">
            <Sliders className="w-5 h-5" />
          </button>
          <button className="text-on-surface-variant hover:bg-surface-container-low transition-colors p-2 flex items-center justify-center">
            <Terminal className="w-5 h-5" />
          </button>
          <button 
            onClick={onDeploy}
            className="bg-primary text-on-primary font-sans text-[11px] font-bold tracking-widest uppercase px-6 py-2 ml-4 rounded-none hover:bg-zinc-800 transition-colors"
          >
            INITIALIZE_SYS
          </button>
        </div>
      </nav>

      {/* Main Content Canvas */}
      <main className="flex-grow flex flex-col w-full relative">
        {/* Hero Section: Architectural Grid */}
        <section className="w-full min-h-[90vh] bg-surface flex flex-col relative overflow-hidden">
          {/* Grid Lines (Decorative) */}
          <div className="absolute inset-0 pointer-events-none opacity-20 grid-bg"></div>
          
          <div className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-0 relative z-10">
            {/* Left: Typography & Value */}
            <div className="lg:col-span-5 flex flex-col justify-center px-12 lg:px-24 py-20 bg-surface-container-lowest border-r border-outline-variant/20">
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="font-headline text-[4rem] leading-[1.1] font-extralight text-primary mb-8 tracking-tighter"
              >
                Determined<br />
                <strong className="font-bold">Memory State<br />Simulation</strong>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="font-sans text-base text-on-surface-variant mb-12 max-w-sm leading-relaxed"
              >
                A rigorous environment for executing, analyzing, and optimizing complex virtual memory paging structures and replacement algorithms.
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-6"
              >
                <button 
                  onClick={onDeploy}
                  className="bg-primary text-on-primary font-sans text-[11px] font-bold tracking-widest uppercase px-8 py-4 hover:bg-zinc-800 transition-colors rounded-none"
                >
                  DEPLOY WORKSPACE
                </button>
                <a className="text-tertiary font-sans text-[11px] font-bold tracking-widest uppercase flex items-center gap-2 hover:opacity-80 transition-opacity" href="#">
                  VIEW_SPECIFICATION <ArrowRight className="w-4 h-4" />
                </a>
              </motion.div>
            </div>
            
            {/* Right: Technical Visualization Monolith */}
            <div className="lg:col-span-7 bg-gray-100 relative flex flex-col">
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
                  <div className="absolute inset-0 bg-primary/20 mix-blend-color"></div>
                  
                  {/* Overlaid UI Elements for 'Pro' feel */}
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

        {/* Value Prop Section: Bento Grid */}
        <section className="py-32 px-12 lg:px-24 bg-surface-container border-t border-outline-variant/20">
          <div className="max-w-7xl mx-auto">
            <div className="mb-20">
              <span className="font-sans text-[11px] text-tertiary font-bold tracking-widest uppercase mb-4 block">CORE_CAPABILITIES</span>
              <h2 className="font-headline text-3xl font-light text-primary leading-tight">
                Engineered for absolute fidelity in<br /><strong className="font-bold">system-level analysis.</strong>
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<Layers className="w-8 h-8" />}
                title="Architectural Fidelity"
                desc="Simulate deeply nested page tables, TLB hierarchies, and distinct memory access latencies precisely aligned with modern hardware constraints."
                tag="SYS_DEF_V2"
              />
              <FeatureCard 
                icon={<Brain className="w-8 h-8" />}
                title="Algorithmic Precision"
                desc="Deploy exact implementations of LRU, FIFO, Clock, and optimal replacement strategies, observing deterministic outcomes."
                tag="EXEC_ENV"
              />
              <FeatureCard 
                icon={<BarChart3 className="w-8 h-8" />}
                title="Real-time Telemetry"
                desc="Extract granular execution traces. Analyze per-instruction memory footprints and fault distributions without abstraction layers."
                tag="METRICS_STREAM"
              />
            </div>
          </div>
        </section>

        {/* Integration Ecosystem Section */}
        <section className="w-full bg-surface-container-lowest border-t border-outline-variant/20 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-5 grid-bg" style={{ backgroundSize: '32px 32px' }}></div>
          <div className="max-w-7xl mx-auto px-12 lg:px-24 py-32 relative z-10">
            <div className="mb-16 border-l-4 border-tertiary pl-8">
              <span className="font-sans text-[11px] text-tertiary font-bold tracking-widest uppercase mb-4 block">ECOSYSTEM_TOPOLOGY</span>
              <h2 className="font-headline text-4xl font-light text-primary tracking-tight">Advanced Integration<br /><strong className="font-bold">Ecosystem</strong></h2>
              <p className="font-sans text-base text-on-surface-variant mt-6 max-w-2xl leading-relaxed">
                Seamlessly interface the core simulation engine with external toolchains. Connect industry-standard debuggers, custom compiler toolchains, and proprietary kernel modules.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 border border-outline-variant/20 bg-surface shadow-sm overflow-hidden">
              <EcoCol 
                port="01" 
                label="DEBUG_I/F" 
                icon={<Bug className="w-8 h-8" />}
                title="GDB/LLDB Bridge"
                desc="Attach debuggers directly to simulated space. Set hardware breakpoints on page table entries."
              />
              <EcoCol 
                port="02" 
                label="COMPILER_I/F" 
                icon={<Network className="w-8 h-8" />}
                title="LLVM Instrumentation"
                desc="Inject custom memory profiling probes at compile time. Stream memory access patterns directly."
                active
              />
              <EcoCol 
                port="03" 
                label="KERNEL_I/F" 
                icon={<MemoryStick className="w-8 h-8" />}
                title="Custom MMU Modules"
                desc="Load proprietary memory management unit logic as shared libraries. Validate experimental structures."
              />
            </div>

            {/* Visual Bridge */}
            <div className="mt-8 bg-surface-container border border-outline-variant/20 p-8 md:p-12 flex items-center justify-center relative overflow-hidden h-80">
              <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 1px, transparent 12px)' }}></div>
              <div className="relative z-10 flex items-center gap-8 md:gap-16">
                 <div className="flex flex-col items-center gap-4">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Compiler</span>
                    <div className="w-20 h-20 border border-outline-variant/30 flex items-center justify-center bg-gray-50"><Terminal className="w-8 h-8 text-black opacity-30" /></div>
                 </div>
                 <div className="flex-1 h-[2px] w-48 bg-tertiary relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1.5 bg-white border border-tertiary text-[10px] font-bold tracking-widest uppercase whitespace-nowrap">IPC_BRIDGE</div>
                 </div>
                 <div className="flex flex-col items-center gap-4">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Sim_Core</span>
                    <div className="w-20 h-20 bg-primary flex items-center justify-center"><CircuitBoard className="w-8 h-8 text-white" /></div>
                 </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-zinc-900 text-white w-full p-12 px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-12 border-t border-zinc-800 pt-12">
          <div>
            <span className="font-headline font-light text-zinc-500 text-sm block mb-8 uppercase tracking-widest">ARCHITECTURAL_LEDGER_SYSTEMS_LAB</span>
            <p className="font-sans text-[10px] font-medium tracking-[0.1em] uppercase text-zinc-600">
              © 2026 ARCHITECTURAL_LEDGER_SYSTEMS_LAB. ALL_RIGHTS_RESERVED.
            </p>
          </div>
          <div className="flex justify-end gap-6 flex-wrap">
            <FooterLink label="MANUAL_V1" />
            <FooterLink label="SECURITY_AUDIT" />
            <FooterLink label="API_SPEC" />
            <FooterLink label="LICENSE" />
          </div>
        </div>
      </footer>
    </div>
  );
}

function NavItem({ label }: { label: string }) {
  return (
    <a className="text-on-surface-variant hover:text-primary transition-colors font-sans text-[11px] font-bold tracking-widest uppercase" href="#">
      {label}
    </a>
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
      <p className="font-sans text-sm text-on-surface-variant leading-relaxed mb-8 flex-grow">
        {desc}
      </p>
      <div className="border-t border-outline-variant/20 pt-4 mt-auto">
        <span className="font-sans text-[10px] tracking-widest uppercase text-tertiary font-bold">{tag}</span>
      </div>
    </div>
  );
}

function EcoCol({ port, label, icon, title, desc, active = false }: { port: string; label: string; icon: React.ReactNode; title: string; desc: string; active?: boolean }) {
  return (
    <div className={cn(
      "p-10 border-b lg:border-b-0 lg:border-r border-outline-variant/20 flex flex-col transition-colors",
      active ? "bg-surface-container-low" : "bg-surface hover:bg-gray-50"
    )}>
      <div className="font-sans text-[10px] tracking-widest uppercase text-tertiary mb-8 font-bold">PORT_{port} / {label}</div>
      <div className="text-primary mb-6">{icon}</div>
      <h3 className="font-headline font-bold text-lg mb-3">{title}</h3>
      <p className="font-sans text-[13px] text-on-surface-variant leading-relaxed flex-grow">
        {desc}
      </p>
    </div>
  );
}

function FooterLink({ label }: { label: string }) {
  return (
    <a className="font-sans text-[10px] font-medium tracking-[0.1em] uppercase text-zinc-500 hover:text-white transition-colors" href="#">
      {label}
    </a>
  );
}
