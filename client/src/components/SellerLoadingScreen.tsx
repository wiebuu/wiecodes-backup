
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SellerLoadingScreenProps {
  onLoadingComplete: () => void;
}

const LOADING_MESSAGES = [
  'INITIALIZING CREATOR WORKSPACE...',
  'VERIFYING SELLER ACCOUNT...',
  'CONNECTING GITHUB REPOSITORY...',
  'SYNCING MARKETPLACE DATA...',
  'OPTIMIZING TEMPLATE INDEX...',
  'LOADING SALES ANALYTICS...',
  'CHECKING WEEKLY PAYOUT STATUS...',
  'PREPARING CREATOR DASHBOARD...',
  'READY TO SHIP.',
  'ACCESS GRANTED.',
];

const FLOATING_CODE_SNIPPETS = [
  { text: 'const earnings = await payout();', type: 'code' },
  { text: 'git push origin main', type: 'code' },
  { text: 'npm run build', type: 'code' },
  { text: 'pnpm deploy', type: 'code' },
  { text: 'Template Approved', type: 'success' },
  { text: 'Repository Verified', type: 'success' },
  { text: 'SEO Optimized', type: 'success' },
  { text: 'Revenue +₹249', type: 'revenue' },
  { text: 'Build Successful', type: 'success' },
  { text: 'Marketplace Sync Complete', type: 'success' },
  { text: 'Template Published', type: 'success' },
  { text: 'Weekly Payout Ready', type: 'revenue' },
  { text: 'Sales++', type: 'revenue' },
  { text: 'git commit', type: 'code' },
  { text: 'git merge', type: 'code' },
  { text: 'render deploy', type: 'code' },
  { text: 'const seller = create();', type: 'code' },
  { text: 'const template = publish();', type: 'code' },
];

const TERMINAL_LOGS = [
  '> initializing creator workspace...',
  '> github verified',
  '> repository connected',
  '> seo modules loaded',
  '> analytics synchronized',
  '> payout service ready',
  '> awaiting dashboard...',
];

const COMMIT_NODES = [
  { x: 15, y: 50, delay: 0.2 },
  { x: 35, y: 50, delay: 0.4 },
  { x: 55, y: 50, delay: 0.6 },
  { x: 75, y: 50, delay: 0.8 },
  { x: 95, y: 50, delay: 1.0 },
];

const FLOATING_CARDS = [
  { title: 'Templates', value: '36', top: '15%', left: '10%', delay: 0.1 },
  { title: 'Sales', value: '142', top: '25%', right: '12%', delay: 0.3 },
  { title: 'Revenue', value: '₹12,400', bottom: '30%', left: '8%', delay: 0.5 },
  { title: 'Rating', value: '4.9★', top: '50%', right: '10%', delay: 0.7 },
  { title: 'Downloads', value: '680', bottom: '15%', right: '15%', delay: 0.9 },
];

const SellerLoadingScreen: React.FC<SellerLoadingScreenProps> = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [showSweep, setShowSweep] = useState(false);
  const [scaleLogo, setScaleLogo] = useState(false);
  const completedRef = useRef(false);

  useEffect(() => {
    const duration = 4200;
    const interval = 50;
    const steps = duration / interval;
    let step = 0;
    let currentMessageIndex = 0;

    const timer = setInterval(() => {
      step++;
      const newProgress = Math.min((step / steps) * 100, 100);
      setProgress(newProgress);

      const newMessageIndex = Math.min(
        Math.floor((newProgress / 100) * (LOADING_MESSAGES.length - 1)),
        LOADING_MESSAGES.length - 1
      );
      
      if (newMessageIndex !== currentMessageIndex) {
        currentMessageIndex = newMessageIndex;
        setMessageIndex(newMessageIndex);
      }

      if (newProgress >= 100 && !completedRef.current) {
        completedRef.current = true;
        setScaleLogo(true);
        setTimeout(() => {
          onLoadingComplete();
        }, 700);
        clearInterval(timer);
      }
    }, interval);

    setTimeout(() => {
      setShowSweep(true);
    }, 600);

    return () => clearInterval(timer);
  }, [onLoadingComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.9, ease: 'easeInOut' }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-[#050505]"
    >
      {/* Animated film grain */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Soft moving vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(circle at center, transparent 0%, rgba(5,5,5,0.7) 100%)',
        }}
      />

      {/* Blueprint grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* Extremely slow radial gradient */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 30% 40%, rgba(255,255,255,0.02) 0%, transparent 60%)',
          animation: 'slowDrift 30s ease-in-out infinite alternate',
        }}
      />

      {/* Tiny floating dust particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-[2px] h-[2px] bg-white/15 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.6, 0],
              y: [0, -30 - Math.random() * 20],
              x: [0, (Math.random() - 0.5) * 20],
            }}
            transition={{
              duration: 6 + Math.random() * 8,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Centerpiece: Rotating wireframe repository graph */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div
          className="absolute flex h-80 w-80 items-center justify-center"
          style={{ perspective: '1200px' }}
        >
          <motion.div
            animate={{ rotateX: [0, 360], rotateY: [0, 360] }}
            transition={{ duration: 36, repeat: Infinity, ease: 'linear' }}
            className="relative h-56 w-56"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Wireframe cube */}
            {[
              { transform: 'translateZ(80px)', opacity: 0.12 },
              { transform: 'rotateY(180deg) translateZ(80px)', opacity: 0.08 },
              { transform: 'rotateY(90deg) translateZ(80px)', opacity: 0.1 },
              { transform: 'rotateY(-90deg) translateZ(80px)', opacity: 0.1 },
              { transform: 'rotateX(90deg) translateZ(80px)', opacity: 0.06 },
              { transform: 'rotateX(-90deg) translateZ(80px)', opacity: 0.06 },
            ].map((face, i) => (
              <div
                key={i}
                className="absolute inset-0 border border-white/20"
                style={{
                  transform: face.transform,
                  opacity: face.opacity,
                  backfaceVisibility: 'visible',
                }}
              >
                {/* Inner commit nodes */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-wrap gap-6 justify-center items-center">
                  {[...Array(5)].map((_, j) => (
                    <motion.div
                      key={j}
                      className="w-2 h-2 rounded-full bg-white/25"
                      animate={{
                        opacity: [0.2, 0.5, 0.2],
                        scale: [1, 1.4, 1],
                      }}
                      transition={{
                        duration: 2 + j * 0.3,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
            {/* Connection lines */}
            <svg className="absolute inset-0 w-full h-full" style={{ transform: 'translateZ(80px)' }}>
              <line x1="20%" y1="20%" x2="80%" y2="20%" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
              <line x1="80%" y1="20%" x2="80%" y2="80%" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
              <line x1="80%" y1="80%" x2="20%" y2="80%" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
              <line x1="20%" y1="80%" x2="20%" y2="20%" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
              <line x1="20%" y1="20%" x2="50%" y2="50%" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              <line x1="80%" y1="20%" x2="50%" y2="50%" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              <line x1="80%" y1="80%" x2="50%" y2="50%" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              <line x1="20%" y1="80%" x2="50%" y2="50%" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            </svg>
          </motion.div>
        </div>
      </div>

      {/* Floating developer environment elements - FIXED POSITIONS */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Floating code snippets */}
        {FLOATING_CODE_SNIPPETS.map((snippet, i) => (
          <motion.div
            key={i}
            className={`absolute font-mono text-xs sm:text-[13px] tracking-wide ${
              snippet.type === 'success' ? 'text-[#38b26f]/60' :
              snippet.type === 'revenue' ? 'text-[#38b26f]/55' : 'text-white/50'
            }`}
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: [0, 0.6, 0], y: [10, -20] }}
            transition={{
              duration: 6 + Math.random() * 4,
              repeat: Infinity,
              delay: i * 0.4,
              ease: 'easeInOut',
            }}
          >
            {snippet.text}
          </motion.div>
        ))}

        {/* Mini terminal windows */}
        {[
          {
            top: '10%',
            left: '5%',
            content: (
              <div className="flex flex-col gap-1">
                <div className="text-[#38b26f]/60 text-[10px]">✔ Build Successful</div>
                <div className="text-white/35 text-[9px]">Compiled in 1.4s</div>
              </div>
            ),
          },
          {
            top: '12%',
            right: '5%',
            content: (
              <div className="flex flex-col gap-1">
                <div className="text-white/45 text-[10px]">Repository Connected</div>
                <div className="text-[#38b26f]/55 text-[10px]">GitHub Verified</div>
                <div className="text-white/35 text-[9px]">Branch: main</div>
              </div>
            ),
          },
          {
            bottom: '25%',
            left: '5%',
            content: (
              <div className="flex flex-col gap-1">
                <div className="text-white/45 text-[10px]">Weekly Revenue</div>
                <div className="text-[#38b26f]/55 text-sm font-mono">₹3,420</div>
                <div className="text-white/35 text-[10px]">Pending Payout</div>
                <div className="text-[#38b26f]/50 text-[11px] font-mono">₹840</div>
              </div>
            ),
          },
        ].map((terminal, i) => (
          <motion.div
            key={i}
            className="absolute bg-[#080808]/90 border border-white/10 rounded-sm px-3 py-2"
            style={{
              [terminal.top ? 'top' : 'bottom']: terminal.top || terminal.bottom,
              [terminal.left ? 'left' : 'right']: terminal.left || terminal.right,
            }}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: [0, 0.4, 0.3], y: [5, -5] }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              delay: i * 0.6,
              ease: 'easeInOut',
            }}
          >
            {terminal.content}
          </motion.div>
        ))}

        {/* Floating creator metrics cards - FIXED POSITIONS */}
        {[
          { title: 'Templates', value: '36', top: '30%', right: '8%', delay: 0.1 },
          { title: 'Sales', value: '142', top: '45%', left: '8%', delay: 0.3 },
          { title: 'Rating', value: '4.9★', bottom: '35%', right: '8%', delay: 0.5 },
        ].map((card, i) => (
          <motion.div
            key={i}
            className="absolute bg-[#080808]/85 border border-white/8 rounded-sm px-3 py-2"
            style={{
              [card.top ? 'top' : 'bottom']: card.top || card.bottom,
              [card.left ? 'left' : 'right']: card.left || card.right,
            }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{
              opacity: [0, 0.4, 0.3],
              y: [0, -4, 0],
            }}
            transition={{
              duration: 8 + i * 1.5,
              repeat: Infinity,
              delay: card.delay,
              ease: 'easeInOut',
            }}
          >
            <div className="text-[9px] uppercase tracking-[0.3em] text-white/35 mb-1">
              {card.title}
            </div>
            <div className="text-sm font-mono text-[#38b26f]/60">
              {card.value}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Seller Identifier */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6 flex items-center gap-2"
        >
          <span className="w-2 h-2 rounded-full bg-[#38b26f]/70 animate-pulse" />
          <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-[#38b26f]/60">
            Seller Mode
          </span>
        </motion.div>

        {/* WIECODES Text Logo - BIGGER, BETTER FONT */}
        <motion.div
          initial={{ opacity: 0.2 }}
          animate={{ 
            opacity: 1,
            scale: scaleLogo ? 1.05 : 1,
          }}
          transition={{ 
            opacity: { duration: 0.7, ease: 'easeOut' },
            scale: { duration: 0.4, ease: 'easeOut' }
          }}
          className="relative mb-14"
        >
          <h1 className="font-bebas text-7xl font-black tracking-[0.18em] text-white sm:text-8xl md:text-9xl uppercase">
            WIECODES
          </h1>
        </motion.div>

        {/* Simple, Clean Progress Bar */}
        <div className="relative mb-12 h-1 w-72 sm:w-80 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1, ease: 'easeOut' }}
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#38b26f]/70 via-[#38b26f] to-[#38b26f]/70"
          />
        </div>

        {/* Loading messages */}
        <div className="h-9 flex items-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={messageIndex}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.45, ease: 'easeInOut' }}
              className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.45em] text-white/55"
            >
              {LOADING_MESSAGES[messageIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom-left terminal */}
      <div className="absolute bottom-6 left-6 font-mono text-[9px] text-white/25 space-y-1">
        {TERMINAL_LOGS.slice(0, Math.min(Math.floor(progress / 14), TERMINAL_LOGS.length)).map((log, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.15 }}
          >
            {log}
          </motion.div>
        ))}
        <div className="flex items-center gap-1">
          <span>_</span>
          <motion.span
            className="w-1.5 h-3 bg-white/40"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </div>

      {/* Bottom-right system status */}
      <div className="absolute bottom-6 right-6 font-mono text-[9px] text-white/25 space-y-1 text-right">
        <div className="flex items-center justify-end gap-1">
          <span>CONNECTED</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#38b26f]/60" />
        </div>
        <div className="flex items-center justify-end gap-1">
          <span>SECURE</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#38b26f]/55" />
        </div>
        <div className="flex items-center justify-end gap-1">
          <span>VERIFIED</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#38b26f]/55" />
        </div>
        <div className="text-white/20 mt-2">
          UPTIME 100%
        </div>
      </div>

      <style>{`
        @keyframes slowDrift {
          0% { transform: translate(-10px, -10px); }
          100% { transform: translate(10px, 10px); }
        }
      `}</style>
    </motion.div>
  );
};

export default SellerLoadingScreen;

