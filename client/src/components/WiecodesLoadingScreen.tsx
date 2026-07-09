import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WiecodesLoadingScreenProps {
  onLoadingComplete: () => void;
}

const LOADING_MESSAGES = [
  'Initializing Wiecodes',
  'Loading Premium Templates',
  'Syncing Weekend Competitions',
  'Connecting to Community',
  'Preparing Your Workspace',
];

const TERMINAL_LOGS = [
  '> wiecodes system boot',
  '> loading template library',
  '> syncing weekend challenges',
  '> connecting seller network',
  '> wiecodes workspace ready',
];

const CODE_SNIPPETS = [
  'const wiecodes = init()',
  'export default Template',
  '<WeekendChallenge />',
  'await fetch("/api/templates")',
  'wiecodes.build()',
];

const DURATION_MS = 3800;
const TICK_MS = 40;

const WiecodesLoadingScreen: React.FC<WiecodesLoadingScreenProps> = ({
  onLoadingComplete,
}) => {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [visibleLogs, setVisibleLogs] = useState<string[]>([]);
  const [activeSnippet, setActiveSnippet] = useState(0);
  const completedRef = useRef(false);

  useEffect(() => {
    completedRef.current = false;
    const steps = DURATION_MS / TICK_MS;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const pct = Math.min((step / steps) * 100, 100);
      setProgress(pct);

      const idx = Math.min(
        Math.floor((pct / 100) * LOADING_MESSAGES.length),
        LOADING_MESSAGES.length - 1
      );
      setMessageIndex(idx);

      const logIdx = Math.min(
        Math.floor((pct / 100) * TERMINAL_LOGS.length),
        TERMINAL_LOGS.length - 1
      );
      setVisibleLogs(TERMINAL_LOGS.slice(0, logIdx + 1));

      if (pct >= 100 && !completedRef.current) {
        completedRef.current = true;
        clearInterval(timer);
        setTimeout(onLoadingComplete, 600);
      }
    }, TICK_MS);

    return () => clearInterval(timer);
  }, [onLoadingComplete]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSnippet((prev) => (prev + 1) % CODE_SNIPPETS.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  const displayProgress = Math.floor(progress);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-[#030303]"
    >
      {/* Noise texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Soft radial lighting */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_45%,rgba(255,255,255,0.04)_0%,transparent_70%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_100%,rgba(255,255,255,0.02)_0%,transparent_60%)]" />

      {/* Grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* Wireframe UI fragments */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.12 }}
        transition={{ delay: 0.4, duration: 1.2 }}
        className="pointer-events-none absolute left-8 top-8 h-24 w-32 border border-white/20"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.08 }}
        transition={{ delay: 0.6, duration: 1.2 }}
        className="pointer-events-none absolute right-12 top-16 h-16 w-48 border border-white/15"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ delay: 0.8, duration: 1.2 }}
        className="pointer-events-none absolute bottom-20 left-16 h-20 w-20 border border-white/15"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.07 }}
        transition={{ delay: 1, duration: 1.2 }}
        className="pointer-events-none absolute bottom-12 right-8 h-28 w-36 border border-white/12"
      />

      {/* Floating code snippets */}
      <AnimatePresence mode="wait">
        {[0, 1, 2].map((offset) => {
          const snippetIdx = (activeSnippet + offset) % CODE_SNIPPETS.length;
          const positions = [
            'left-[8%] top-[22%]',
            'right-[10%] top-[38%]',
            'left-[12%] bottom-[28%]',
          ];
          return (
            <motion.div
              key={`${offset}-${snippetIdx}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 0.18, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 1.4, ease: 'easeOut' }}
              className={`pointer-events-none absolute font-mono text-[10px] tracking-wide text-white/40 sm:text-xs ${positions[offset]}`}
            >
              {CODE_SNIPPETS[snippetIdx]}
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Terminal logs — bottom left */}
      <div className="absolute bottom-8 left-8 hidden font-mono text-[10px] leading-relaxed text-white/25 sm:block">
        {visibleLogs.map((log, i) => (
          <motion.div
            key={log}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
          >
            {log}
          </motion.div>
        ))}
        <span className="ml-0.5 inline-block h-3 w-[6px] animate-pulse bg-white/40" />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center px-6">
        {/* 3D wireframe cube + wordmark */}
        <div className="relative mb-10 flex items-center justify-center">
          {/* Rotating geometric structure */}
          <div
            className="absolute flex h-48 w-48 items-center justify-center sm:h-56 sm:w-56"
            style={{ perspective: '900px' }}
          >
            <motion.div
              animate={{ rotateX: [0, 360], rotateY: [0, 360] }}
              transition={{
                duration: 24,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="relative h-28 w-28 sm:h-32 sm:w-32"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Wireframe cube faces */}
              {[
                { transform: 'translateZ(56px)', opacity: 0.15 },
                { transform: 'rotateY(180deg) translateZ(56px)', opacity: 0.1 },
                { transform: 'rotateY(90deg) translateZ(56px)', opacity: 0.12 },
                { transform: 'rotateY(-90deg) translateZ(56px)', opacity: 0.12 },
                { transform: 'rotateX(90deg) translateZ(56px)', opacity: 0.08 },
                { transform: 'rotateX(-90deg) translateZ(56px)', opacity: 0.08 },
              ].map((face, i) => (
                <div
                  key={i}
                  className="absolute inset-0 border border-white"
                  style={{
                    transform: face.transform,
                    opacity: face.opacity,
                    backfaceVisibility: 'visible',
                  }}
                />
              ))}
              {/* Inner monolith */}
              <div
                className="absolute inset-[30%] border border-white/30 bg-white/[0.02]"
                style={{ transform: 'translateZ(28px)' }}
              />
            </motion.div>
          </div>

          {/* Wordmark */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative text-center"
          >
            <h1 className="font-bebas text-7xl font-black tracking-[0.18em] text-white sm:text-8xl md:text-9xl">
              WIECODES
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mt-2 font-mono text-[10px] uppercase tracking-[0.45em] text-white/40 sm:text-xs"
            >
              Templates. Competitions. Craft.
            </motion.p>
          </motion.div>
        </div>

        {/* Progress section */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.8 }}
          className="w-full max-w-md"
        >
          {/* Status message */}
          <div className="mb-5 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-white/35 sm:text-xs">
            <AnimatePresence mode="wait">
              <motion.span
                key={messageIndex}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.35 }}
              >
                {LOADING_MESSAGES[messageIndex]}
              </motion.span>
            </AnimatePresence>
            <span className="tabular-nums text-white/60">
              {displayProgress}
              <span className="text-white/30">%</span>
            </span>
          </div>

          {/* Thin progress line */}
          <div className="relative h-px w-full bg-white/10">
            <motion.div
              className="absolute left-0 top-0 h-px bg-white"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.05 }}
            />
            {/* Animated cursor on progress line */}
            <motion.div
              className="absolute top-1/2 h-2 w-px -translate-y-1/2 bg-white"
              style={{ left: `${Math.min(progress, 99)}%` }}
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>

        {/* Blinking cursor beneath progress */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 flex items-center gap-1 font-mono text-[10px] text-white/20"
        >
          <span>system.init</span>
          <span className="inline-block h-[11px] w-[5px] animate-pulse bg-white/50" />
        </motion.div>
      </div>

      <div className="absolute bottom-8 right-8 font-mono text-[9px] uppercase tracking-[0.3em] text-white/15">
        wie
      </div>
    </motion.div>
  );
};

export default WiecodesLoadingScreen;
