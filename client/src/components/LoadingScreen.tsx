import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

interface WeekendStats {
  totalParticipants: number;
  totalCompetitionsHosted: number;
  totalWinnersRewarded: number;
  totalProjectsSubmitted: number;
  totalStarsAwarded: number;
  currentCompetitionWeek: number;
  participantsOnline: number;
  challengesLoaded: number;
  solutionsSubmitted: number;
}

const loadingMessages = [
  'Initializing Coding Arena...',
  'Loading This Week\'s Challenge...',
  'Matching Innovators...',
  'Compiling Solutions...',
  'Verifying Code...',
  'Unlocking Competition Hub...'
];

const ranks = [
  { name: 'CODER', color: 'text-blue-400', border: 'border-blue-400/50' },
  { name: 'CHALLENGER', color: 'text-purple-400', border: 'border-purple-400/50' },
  { name: 'INNOVATOR', color: 'text-cyan-400', border: 'border-cyan-400/50' },
  { name: 'CHAMPION', color: 'text-yellow-400', border: 'border-yellow-400/50' }
];

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(loadingMessages[0]);
  const [currentRank, setCurrentRank] = useState(ranks[0]);
  const [showAchievement, setShowAchievement] = useState(false);
  const [streak, setStreak] = useState(0);
  const [hasCalledComplete, setHasCalledComplete] = useState(false);
  const [stats, setStats] = useState<WeekendStats | null>(null);
  
  // Fetch stats on mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/competitions/stats/overview");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error("Failed to fetch weekend stats:", err);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const duration = 3500;
    const interval = 50;
    const steps = duration / interval;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const newProgress = Math.min((step / steps) * 100, 100);
      setProgress(newProgress);

      // Update message
      const messageIndex = Math.floor((newProgress / 100) * loadingMessages.length);
      if (messageIndex < loadingMessages.length) {
        setCurrentMessage(loadingMessages[messageIndex]);
      }

      // Update rank
      const rankIndex = Math.floor((newProgress / 100) * ranks.length);
      if (rankIndex < ranks.length && currentRank !== ranks[rankIndex]) {
        setCurrentRank(ranks[rankIndex]);
        setShowAchievement(true);
        setTimeout(() => setShowAchievement(false), 800);
      }

      // Update streak
      const newStreak = Math.floor((newProgress / 100) * 7);
      if (newStreak !== streak) {
        setStreak(newStreak);
      }

      if (newProgress >= 100 && !hasCalledComplete) {
        clearInterval(timer);
        setHasCalledComplete(true);
        setTimeout(onLoadingComplete, 500);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []); // Remove all dependencies to prevent re-running

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black overflow-hidden"
    >
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(#0066ff 1px, transparent 1px), linear-gradient(90deg, #0066ff 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            animation: 'gridMove 20s linear infinite'
          }}
        />
      </div>

      {/* Hexagonal pattern background */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <pattern id="hexagons" width="10" height="17.32" patternUnits="userSpaceOnUse">
            <polygon points="5,0 10,2.89 10,8.66 5,11.55 0,8.66 0,2.89" fill="none" stroke="#8b5cf6" strokeWidth="0.1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#hexagons)" />
        </svg>
      </div>

      {/* Matrix particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-xs font-mono text-cyan-400 opacity-40"
            initial={{
              y: '-100%',
              x: `${Math.random() * 100}%`
            }}
            animate={{
              y: '100%'
            }}
            transition={{
              duration: 5 + Math.random() * 10,
              repeat: Infinity,
              ease: 'linear',
              delay: Math.random() * 5
            }}
          >
            {String.fromCharCode(65 + Math.floor(Math.random() * 26))}
          </motion.div>
        ))}
      </div>

      {/* HUD corners */}
      <div className="absolute top-4 left-4 w-32 h-32 border-l-2 border-t-2 border-blue-500/50" />
      <div className="absolute top-4 right-4 w-32 h-32 border-r-2 border-t-2 border-purple-500/50" />
      <div className="absolute bottom-4 left-4 w-32 h-32 border-l-2 border-b-2 border-purple-500/50" />
      <div className="absolute bottom-4 right-4 w-32 h-32 border-r-2 border-b-2 border-blue-500/50" />

      {/* Stats panels */}
      <div className="absolute top-8 left-8 space-y-4">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="bg-black/50 border border-cyan-500/30 p-4 rounded backdrop-blur-sm"
        >
          <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Total Participants</p>
          <p className="text-2xl font-bold text-cyan-400 font-bebas">
            {stats?.totalParticipants.toLocaleString() || "10"}
          </p>
        </motion.div>
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-black/50 border border-blue-500/30 p-4 rounded backdrop-blur-sm"
        >
          <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Challenges Loaded</p>
          <p className="text-2xl font-bold text-blue-400 font-bebas">
            {stats?.challengesLoaded || "0"}
          </p>
        </motion.div>
      </div>

      <div className="absolute top-8 right-8 space-y-4">
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-black/50 border border-purple-500/30 p-4 rounded backdrop-blur-sm"
        >
          <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Solutions Submitted</p>
          <p className="text-2xl font-bold text-purple-400 font-bebas">
            {stats?.solutionsSubmitted.toLocaleString() || "0"}
          </p>
        </motion.div>
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-black/50 border border-yellow-500/30 p-4 rounded backdrop-blur-sm"
        >
          <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Competitions Hosted</p>
          <p className="text-2xl font-bold text-yellow-400 font-bebas">
            {stats?.totalCompetitionsHosted || "0"}
          </p>
        </motion.div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', bounce: 0.4 }}
          className="mb-12"
        >
          <div className="relative">
            <h1 className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 font-bebas tracking-tight">
              WIECODES
            </h1>
            <p className="text-3xl md:text-5xl font-bold text-white/90 -mt-4 text-center tracking-widest font-bebas">
              WEEKEND
            </p>
            {/* Glow */}
            <div className="absolute inset-0 blur-3xl opacity-50 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 -z-10" />
          </div>
        </motion.div>

        {/* Hero text */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-12"
        >
          <p className="text-2xl md:text-4xl text-gray-200 mb-4 font-bebas tracking-wider">
            This Week's Challenge Awaits
          </p>
          <p className="text-lg md:text-xl text-blue-300 uppercase tracking-[0.4em]">
            Code. Compete. Conquer.
          </p>
        </motion.div>

        {/* Loading meter */}
      <motion.div
        initial={{ width: "0%" }}
        animate={{ width: "100%" }}
        className="w-full max-w-2xl mb-8"
      >
        <div className="flex justify-between mb-2">
          <p className="text-gray-400 text-xs uppercase tracking-widest">LOADING</p>
          <p className="text-cyan-400 font-bold font-bebas text-lg">{Math.floor(progress)}%</p>
        </div>
          {/* Circuit path loader */}
          <div className="relative h-6 bg-black border border-cyan-500/50 rounded overflow-hidden">
            {/* Background circuit pattern */}
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: 'repeating-linear-gradient(90deg, #0066ff 0px, #0066ff 4px, transparent 4px, transparent 8px)',
              backgroundSize: '20px 100%'
            }} />
            {/* Filled part */}
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            >
              {/* Animated data streams */}
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute top-1/2 w-2 h-2 bg-white rounded-full"
                    style={{ left: `${(i * 12) + 5}%` }}
                    animate={{
                      y: [-3, 3, -3],
                      opacity: [0.3, 1, 0.3]
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      delay: i * 0.1,
                      ease: 'easeInOut'
                    }}
                  />
                ))}
              </div>
            </motion.div>
            {/* Glow effect */}
            <div className="absolute inset-0 shadow-lg shadow-cyan-500/50" />
          </div>
        </motion.div>

        {/* Loading message */}
        <motion.div
          key={currentMessage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="h-12 flex items-center mb-12"
        >
          <p className="text-xl md:text-2xl text-cyan-300 font-mono tracking-wider">
            {currentMessage}
          </p>
        </motion.div>

        {/* Rank badge */}
        <motion.div
          key={currentRank.name}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`px-8 py-3 border-2 rounded-lg ${currentRank.border}`}
        >
          <p className={`text-2xl font-bebas tracking-widest ${currentRank.color}`}>
            {currentRank.name}
          </p>
        </motion.div>

        {/* Weekly streak */}
        <div className="mt-8 flex items-center gap-4">
          {[...Array(7)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: i < streak ? 1 : 0.3,
                scale: i < streak ? 1 : 0.8
              }}
              transition={{ delay: i * 0.1 }}
              className={`w-10 h-10 rounded flex items-center justify-center border-2 ${i < streak ? 'border-yellow-400 bg-yellow-400/20' : 'border-gray-700 bg-gray-800/50'}`}
            >
              <span className={`text-lg font-bebas ${i < streak ? 'text-yellow-400' : 'text-gray-500'}`}>
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Achievement popup */}
      <AnimatePresence>
        {showAchievement && (
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 50, opacity: 0 }}
            className="absolute top-1/3 right-12 bg-black/80 border border-yellow-400/50 p-4 rounded shadow-lg shadow-yellow-500/30 backdrop-blur-sm"
          >
            <div className="flex items-center gap-3">
              <div className="text-4xl">⭐</div>
              <div>
                <p className="text-yellow-400 font-bold font-bebas text-xl">STARS AWARDED</p>
                <p className="text-sm text-yellow-200 font-bebas text-2xl">
                  {stats?.totalStarsAwarded.toLocaleString() || "0"}★
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes gridMove {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(60px, 60px);
          }
        }
      `}</style>
    </motion.div>
  );
};

export default LoadingScreen;
