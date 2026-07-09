import { motion } from 'framer-motion';

interface SellerProfileBackgroundProps {
  username?: string;
}

const SellerProfileBackground = ({ username }: SellerProfileBackgroundProps) => {
  const nameParts = username
    ? username.trim().toUpperCase().split(/\s+/).filter(Boolean)
    : [];

  return (
    <div
      className="fixed top-20 left-0 right-0 bottom-0 z-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {/* Layer 1 — solid base */}
      <div className="absolute inset-0 bg-[#030303]" />

      {/* Layer 2 — blueprint grid */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.35) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Layer 3 — architectural panels */}
      <div className="absolute inset-0 opacity-70">
        <div className="absolute top-[10%] right-[6%] h-[58vh] w-[30vw] max-w-[440px] border border-white/[0.04] bg-white/[0.008]" />
        <div className="absolute top-[20%] right-[20%] h-[40vh] w-[16vw] max-w-[220px] border border-white/[0.03] bg-[#080808]/50" />
        <div className="absolute top-[6%] right-[36%] h-[65vh] w-px bg-white/[0.05]" />
        <div className="absolute top-[16%] right-[10%] h-px w-[44vw] max-w-[680px] bg-white/[0.035]" />
        <div className="absolute bottom-[14%] right-[4%] h-[30vh] w-[38vw] max-w-[560px] border border-white/[0.03] bg-white/[0.005]" />
        <div className="absolute top-[32%] right-[2%] h-[48vh] w-[10vw] max-w-[140px] border-l border-white/[0.04] bg-gradient-to-b from-white/[0.02] to-transparent" />
        <div className="absolute top-[44%] right-[26%] h-[24vh] w-[20vw] max-w-[300px] border border-white/[0.025]" />
        <div className="absolute top-[38%] right-[12%] h-[2px] w-[24vw] max-w-[360px] opacity-[0.07] bg-[#38b26f]" />
        <div className="absolute top-[38.15%] right-[12%] h-[14vh] w-[24vw] max-w-[360px] border border-white/[0.025] border-t-0 bg-white/[0.005]" />
      </div>

      {/* Layer 4 — soft radial light, top-right */}
      <motion.div
        animate={{ opacity: [0.03, 0.05, 0.03], scale: [1, 1.02, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-[8%] -right-[6%] h-[75vh] w-[58vw] max-w-[960px] rounded-full bg-white/80 blur-[150px]"
      />

      {/* Layer 5 — muted emerald ambient leaks */}
      <motion.div
        animate={{ opacity: [0.025, 0.04, 0.025] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[4%] left-[8%] h-[44vh] w-[52vw] max-w-[720px] blur-[130px]"
        style={{
          background:
            'linear-gradient(115deg, rgba(56,178,111,0.05) 0%, rgba(74,222,128,0.03) 45%, transparent 78%)',
        }}
      />
      <motion.div
        animate={{ opacity: [0.02, 0.035, 0.02] }}
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute bottom-[6%] right-[2%] h-[34vh] w-[40vw] max-w-[560px] blur-[110px]"
        style={{
          background:
            'linear-gradient(320deg, rgba(56,178,111,0.04) 0%, rgba(74,222,128,0.02) 55%, transparent 85%)',
        }}
      />

      {/* Layer 6 — blurred geometric depth shapes */}
      <div className="absolute top-[18%] right-[14%] h-72 w-72 rotate-12 rounded-sm bg-[#0e0e0e] blur-[100px] opacity-25" />
      <div className="absolute top-[40%] right-[30%] h-52 w-80 -rotate-6 rounded-sm bg-[#0a0a0a] blur-[110px] opacity-20" />
      <div className="absolute bottom-[20%] right-[8%] h-60 w-44 rotate-[20deg] rounded-sm bg-[#0c0c0c] blur-[90px] opacity-15" />

      {/* Cinematic light beam — upper-right */}
      <motion.div
        animate={{ opacity: [0.03, 0.05, 0.03] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(125deg, transparent 40%, rgba(255,255,255,0.05) 56%, rgba(255,255,255,0.015) 66%, transparent 82%)',
        }}
      />

      {/* Floor reflection */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[38vh]"
        style={{
          background:
            'linear-gradient(to top, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.008) 30%, transparent 72%)',
        }}
      />

      {/* Readability + darkness gradients */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to right, rgba(3,3,3,0.98) 0%, rgba(3,3,3,0.85) 38%, rgba(3,3,3,0.45) 60%, rgba(3,3,3,0.15) 75%)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#030303]/95" />

      {/* Dusty atmospheric haze */}
      <div className="absolute inset-0 bg-[#080808]/30 backdrop-blur-[1px]" />
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          background:
            'radial-gradient(ellipse 90% 70% at 70% 30%, rgba(40,40,40,0.25) 0%, transparent 65%)',
        }}
      />

      {/* Soft emerald halo behind WIE zone */}
      <div
        className="absolute top-[8%] right-[0%] h-[55vh] w-[45vw] max-w-[640px] blur-[120px] opacity-[0.04]"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(56,178,111,0.12) 0%, transparent 68%)',
        }}
      />

      {/* Creator identity watermark */}
      {nameParts.length > 0 && (
        <div className="absolute left-[5%] top-[10%] max-w-[55vw] select-none blur-[0.8px] opacity-80">
          {nameParts.map((part, i) => (
            <span
              key={part + i}
              className="block font-bebas leading-[0.82] tracking-[0.04em] text-[clamp(64px,11vw,180px)] text-white/[0.022]"
              style={{
                textShadow: '0 0 40px rgba(0,0,0,0.8)',
                marginTop: i > 0 ? '-0.06em' : 0,
              }}
            >
              {part}
            </span>
          ))}
        </div>
      )}

      {/* WIECODES branding — WIE mark */}
      <div className="absolute right-[2%] top-[2%] select-none z-[1] blur-[1px] opacity-90">
        <span
          className="block font-bebas leading-[0.85] tracking-[0.06em] text-[clamp(260px,40vw,780px)] text-white/[0.045]"
          style={{
            textShadow: '0 0 60px rgba(0,0,0,0.9), 0 0 30px rgba(56,178,111,0.03)',
          }}
        >
          WIE
        </span>
      </div>

      {/* Layer 7 — film grain / dust */}
      <div
        className="seller-profile-grain absolute inset-0 z-[2] opacity-[0.045] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      <div
        className="seller-profile-dust absolute inset-0 z-[3] opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='d'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.4' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23d)'/%3E%3C/svg%3E")`,
        }}
      />

      <style>{`
        @keyframes sellerProfileGrain {
          0%, 100% { transform: translate(0, 0); opacity: 0.045; }
          33% { transform: translate(-0.3%, 0.4%); opacity: 0.035; }
          66% { transform: translate(0.4%, -0.2%); opacity: 0.04; }
        }
        @keyframes sellerProfileDust {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(0.2%, 0.3%); }
        }
        .seller-profile-grain {
          animation: sellerProfileGrain 18s ease-in-out infinite;
        }
        .seller-profile-dust {
          animation: sellerProfileDust 24s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default SellerProfileBackground;
