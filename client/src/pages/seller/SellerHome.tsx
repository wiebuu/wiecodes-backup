import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Github,
  Shield,
  CheckCircle,
  Users,
  MessageCircle,
  Award,
  Star,
  Code,
  TrendingUp,
  Percent,
  Rocket,
  Handshake,
  RefreshCw,
  Globe,
  Layers,
  ShoppingCart,
  Star as StarIcon,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Stats from '@/components/Stats';
import { Link } from 'react-router-dom';
import useScrollToTop from '@/hooks/useScrollToTop';
import { useRole } from '@/contexts/RoleContext';
import { useSellerInitialLoad } from '@/contexts/SellerInitialLoadContext';
import SellerLoadingScreen from '@/components/SellerLoadingScreen';




const whyWiecodes = [
  {
    label: 'NO UPLOADS',
    title: 'GitHub-Based',
    description: 'Just share GitHub access — no file uploads required.',
  },
  {
    label: 'TRUST',
    title: 'Verified Reviews',
    description: 'No fake reviews — feedback only from real buyers.',
  },
  {
    label: 'SMART',
    title: 'Dynamic Optimization',
    description: 'We auto-tune pricing, tags, and visibility over time.',
  },
  {
    label: 'FREEDOM',
    title: 'Creator Control',
    description: 'You\'re in charge — delete or update your repo anytime.',
  },
  {
    label: 'FAIR',
    title: '~85% Revenue',
    description: 'Keep the majority of your earnings with low commissions.',
  },
  {
    label: 'EFFICIENT',
    title: 'Streamlined Workflow',
    description: 'Focus on code — we handle everything else.',
  },
];

const howItWorks = [
  {
    step: '01',
    title: 'Connect GitHub',
    description: 'Add our GitHub account as a collaborator on your template repository.',
  },
  {
    step: '02',
    title: 'Submit Details',
    description: 'Fill out a short form with title, price suggestion, and description.',
  },
  {
    step: '03',
    title: 'Manual Review',
    description: 'Our team reviews your template and assigns final pricing, tags, and SEO.',
  },
  {
    step: '04',
    title: 'Go Live',
    description: 'Your template goes live on the marketplace for buyers to discover.',
  },
  {
    step: '05',
    title: 'Get Paid',
    description: 'Earn up to ~85% of every sale with weekly payouts to your bank or UPI.',
  },
];

const SellerHome = () => {
  useScrollToTop();
  const { setRole } = useRole();
  const { isSellerInitialLoad, markSellerInitialLoadComplete } = useSellerInitialLoad();
  const [topSellers, setTopSellers] = useState([]);

  useEffect(() => {
    const fetchTopSellers = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('No token found, skipping top sellers fetch.');
        return;
      }

      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/analytics/top-sellers`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Failed to fetch top sellers: ${res.status} - ${text}`);
        }

        const data = await res.json();
        setTopSellers(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTopSellers();
  }, []);

  if (isSellerInitialLoad) {
    return <SellerLoadingScreen onLoadingComplete={markSellerInitialLoadComplete} />;
  }

  return (
    <div className="min-h-screen bg-[#050505]">
      <Header />

      {/* ------------------------------ */}
      {/* HERO SECTION */}
      {/* ------------------------------ */}
      <section className="relative min-h-[95vh] flex items-start pt-32 pb-16 overflow-hidden">
        {/* Cinematic Background */}
            <motion.div
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute inset-0 bg-no-repeat"
              style={{
                backgroundImage: "url('/backgrounds/background-seller.png')",
                backgroundPosition: "center right top -50px",
                backgroundSize: "100%",
              }}
            />

            {/* Left-to-Right Gradient Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-transparent z-[1]" />

        <div className="container mx-auto px-6 lg:px-10 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl"
          >
            {/* Massive Headline */}
            <div className="mb-10">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-[4.8rem] font-bold text-white leading-[0.9] tracking-tight">
                WRITE.
              </h1>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-[4.8rem] font-bold text-white leading-[0.9] tracking-tight mt-2">
                SHIP.
              </h1>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-[4.8rem] font-bold text-white leading-[0.9] tracking-tight mt-2">
                EARN.
              </h1>
            </div>

            {/* Thin Divider */}
            <div className="w-12 h-px bg-white/20 mb-8" />

            {/* Metadata Text */}
            <div className="mb-10 space-y-3">
              <p className="text-xs sm:text-sm uppercase tracking-[0.35em] text-white/60">
                GITHUB WORKFLOW.
              </p>

              <p className="text-xs sm:text-sm uppercase tracking-[0.35em] text-white/60">
                VERIFIED MARKETPLACE.
              </p>

              <p className="text-xs sm:text-sm uppercase tracking-[0.35em] text-white/60">
                ~85% CREATOR REVENUE.
              </p>

              <p className="text-xs sm:text-sm uppercase tracking-[0.35em] text-white/60">
                REVIEWED BY HUMANS.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/seller/upload">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-4 border border-white/15 bg-black/20 backdrop-blur-sm px-8 py-4 text-white hover:border-white/30 transition-all"
                >
                  <span className="uppercase tracking-[0.25em] text-xs">
                    ENTER SELLER PORTAL
                  </span>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ------------------------------ */}
      {/* TRUST BAR */}
      {/* ------------------------------ */}
      <section className="py-6 border-y border-white/10 bg-[#080808]">
        <div className="container mx-auto px-6 lg:px-10">
          <div className="flex flex-wrap justify-center gap-8 lg:gap-16">
            {[
              { icon: CheckCircle, label: 'Verified Seller' },
              { icon: Github, label: 'GitHub Workflow' },
              { icon: Shield, label: 'Secure Marketplace' },
              { icon: Award, label: 'Manual Reviews' },
              { icon: Handshake, label: 'Creator Support' },
            ].map(({ icon: Icon, label }, idx) => (
              <div key={idx} className="flex items-center gap-2 text-white/45">
                <Icon className="w-4 h-4" />
                <span className="text-xs uppercase tracking-[0.2em]">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------ */}
      {/* TOP CREATORS HALL OF FAME */}
      {/* ------------------------------ */}
      <section className="py-20 bg-[#050505]">
        <div className="container mx-auto px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <h2 className="text-xs uppercase tracking-[0.4em] text-white/45 mb-4">
              TOP CREATORS
            </h2>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              The Developers Shaping the Marketplace
            </h2>
          </motion.div>

          {/* Top 3 Podium */}
          {Array.isArray(topSellers) && topSellers.length > 0 && (
            <div className="mb-16">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {/* Second Place */}
                {topSellers[1] && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-[#0A0A0A] border border-white/10 p-6 flex flex-col items-center"
                  >
                    <div className="text-4xl font-bold text-white/25 mb-4 font-mono">
                      02
                    </div>
                    <div className="w-20 h-20 rounded-full bg-[#050505] border border-white/10 flex items-center justify-center text-2xl font-bold text-white/80 mb-4">
                      {topSellers[1].username
                        ?.split(' ')
                        .map(name => name[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase() || 'US'}
                    </div>
                    <h3 className="text-base font-semibold text-white mb-2">
                      {topSellers[1].username}
                    </h3>
                    <div className="text-xs text-white/50 space-y-1 font-mono">
                      <p>SALES: {topSellers[1].sales?.toLocaleString() || 0}</p>
                      <p>EARNINGS: ₹{topSellers[1].earnings?.toLocaleString() || 0}</p>
                    </div>
                  </motion.div>
                )}

                {/* First Place */}
                {topSellers[0] && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="bg-[#0A0A0A] border border-white/15 p-8 flex flex-col items-center md:-mt-8 md:mb-8"
                  >
                    <div className="text-5xl font-bold text-white/30 mb-4 font-mono">
                      01
                    </div>
                    <div className="w-24 h-24 rounded-full bg-[#050505] border border-white/20 flex items-center justify-center text-3xl font-bold text-white mb-4">
                      {topSellers[0].username
                        ?.split(' ')
                        .map(name => name[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase() || 'US'}
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {topSellers[0].username}
                    </h3>
                    <div className="text-xs text-white/60 space-y-1 font-mono">
                      <p>SALES: {topSellers[0].sales?.toLocaleString() || 0}</p>
                      <p>EARNINGS: ₹{topSellers[0].earnings?.toLocaleString() || 0}</p>
                    </div>
                  </motion.div>
                )}

                {/* Third Place */}
                {topSellers[2] && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-[#0A0A0A] border border-white/10 p-6 flex flex-col items-center"
                  >
                    <div className="text-4xl font-bold text-white/25 mb-4 font-mono">
                      03
                    </div>
                    <div className="w-20 h-20 rounded-full bg-[#050505] border border-white/10 flex items-center justify-center text-2xl font-bold text-white/80 mb-4">
                      {topSellers[2].username
                        ?.split(' ')
                        .map(name => name[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase() || 'US'}
                    </div>
                    <h3 className="text-base font-semibold text-white mb-2">
                      {topSellers[2].username}
                    </h3>
                    <div className="text-xs text-white/50 space-y-1 font-mono">
                      <p>SALES: {topSellers[2].sales?.toLocaleString() || 0}</p>
                      <p>EARNINGS: ₹{topSellers[2].earnings?.toLocaleString() || 0}</p>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          )}

          {/* Remaining Sellers List */}
          {Array.isArray(topSellers) && topSellers.length > 3 && (
            <div className="max-w-3xl mx-auto space-y-4">
              {topSellers.slice(3).map((seller, idx) => (
                <motion.div
                  key={seller._id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="bg-[#0A0A0A] border border-white/10 p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-mono text-white/25 w-8">
                      {String(idx + 4).padStart(2, '0')}
                    </span>
                    <div className="w-10 h-10 rounded-full bg-[#050505] border border-white/10 flex items-center justify-center text-sm font-bold text-white/70">
                      {seller.username
                        ?.split(' ')
                        .map(name => name[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase() || 'US'}
                    </div>
                    <span className="text-sm text-white/70">{seller.username}</span>
                  </div>
                  <div className="text-xs font-mono text-white/50 flex gap-6">
                    <span>SALES: {seller.sales?.toLocaleString() || 0}</span>
                    <span>₹{seller.earnings?.toLocaleString() || 0}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {(!Array.isArray(topSellers) || topSellers.length === 0) && (
            <p className="text-center text-white/40">No top sellers yet.</p>
          )}
        </div>
      </section>

      {/* ------------------------------ */}
      {/* CREATOR JOURNEY TIMELINE */}
      {/* ------------------------------ */}
      <section className="py-20 bg-[#080808] border-y border-white/10">
        <div className="container mx-auto px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-12"
          >
            <h2 className="text-xs uppercase tracking-[0.4em] text-white/45 mb-4">
              CREATOR JOURNEY
            </h2>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              From Idea to Income
            </h2>
          </motion.div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute top-1/2 left-0 right-0 h-px bg-white/10 -translate-y-1/2 hidden lg:block" />

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {howItWorks.map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="relative bg-[#0A0A0A] border border-white/10 p-6 hover:border-white/20 transition-colors"
                >
                  {/* Step Number */}
                  <div className="text-5xl font-bold text-white/10 mb-4 font-mono">
                    {step.step}
                  </div>

                  <h3 className="text-sm uppercase tracking-[0.2em] text-white/70 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-white/45">
                    {step.description}
                  </p>

                  {/* Timeline Dot for Desktop */}
                  <div className="absolute top-1/2 -translate-y-1/2 hidden lg:block z-10" style={{ right: '-12px' }}>
                    <div className="w-4 h-4 bg-white/30 rounded-full border-2 border-white/10" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------ */}
      {/* CREATOR NETWORK SECTION */}
      {/* ------------------------------ */}
      <section className="py-20 bg-[#050505]">
        <div className="container mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-xs uppercase tracking-[0.4em] text-white/45 mb-4">
                CREATOR NETWORK
              </h2>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-6">
                Join a Community of Elite Builders
              </h2>
              <p className="text-white/55 text-sm sm:text-base leading-relaxed">
                Connect with other template creators, participate in weekend competitions, and stay updated on the latest platform features. We're building more than just a marketplace — we're building a movement.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <div className="bg-[#080808] border border-white/10 p-6">
                <div className="space-y-4 mb-8">
                  {[
                    'WhatsApp Community',
                    'Weekend Competitions',
                    'Platform Announcements',
                    'Feature Releases',
                    'Creator Updates',
                    'Profile Customization',
                    'Payment Links',
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-1 h-1 bg-white/30 rounded-full" />
                      <span className="text-sm text-white/65">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() =>
                      window.open(
                        "https://chat.whatsapp.com/HgB59qUe7po6q4FDl462cY?mode=ems_copy_h_c",
                        "_blank",
                        "noopener,noreferrer"
                      )
                    }
                    className="flex-1 border border-white/15 bg-black/20 px-6 py-3 text-white hover:border-white/30 transition-all text-xs uppercase tracking-[0.2em]"
                  >
                    JOIN COMMUNITY
                  </button>
                  <Link to="/seller/profile">
                    <button className="flex-1 border border-white/15 bg-black/20 px-6 py-3 text-white hover:border-white/30 transition-all text-xs uppercase tracking-[0.2em]">
                      UPDATE PROFILE
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ------------------------------ */}
      {/* WHY WIECODES */}
      {/* ------------------------------ */}
      <section className="py-20 bg-[#050505]">
        <div className="container mx-auto px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <h2 className="text-xs uppercase tracking-[0.4em] text-white/45 mb-4">
              WHY WIECODES
            </h2>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              Built for Creators, Not Shareholders
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyWiecodes.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                whileHover={{ borderColor: 'rgba(255,255,255,0.2)' }}
                className="bg-[#080808] border border-white/10 p-6 transition-colors"
              >
                <span className="text-[10px] uppercase tracking-[0.4em] text-white/35 block mb-2">
                  {item.label}
                </span>
                <h3 className="text-lg font-semibold text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-white/50">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------ */}
      {/* STATS SECTION */}
      {/* ------------------------------ */}
      <Stats
        stats={[
          {
            icon: Layers,
            value: 36,
            suffix: '+',
            label: 'Code Templates',
          },
          {
            icon: ShoppingCart,
            value: 68,
            suffix: '+',
            label: 'Sales',
          },
          {
            icon: Users,
            value: 12,
            suffix: '+',
            label: 'Sellers',
          },
        ]}
      />

      {/* ------------------------------ */}
      {/* FINAL CTA SECTION */}
      {/* ------------------------------ */}
      <section className="relative py-24 sm:py-32 bg-[#050505] overflow-hidden">
        {/* Cinematic Background */}
        <div
          className="absolute inset-0 bg-no-repeat bg-cover"
          style={{
            backgroundImage: "url('/backgrounds/background2.png')",
            backgroundPosition: "center bottom",
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/90 via-[#050505]/60 to-transparent z-[1]" />

        <div className="container mx-auto px-6 lg:px-10 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-3xl"
          >
            {/* Headline */}
            <div className="mb-8">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[0.9] tracking-tight">
                SHIP.
              </h2>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[0.9] tracking-tight mt-2">
                EARN.
              </h2>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[0.9] tracking-tight mt-2">
                OR DISCOVER.
              </h2>
            </div>

            {/* Subtext */}
            <p className="text-white/60 text-sm sm:text-base mb-10 max-w-md">
              Join the next generation of developers. Showcase your skills, compete and earn with your creations. Or browse premium templates to bring your ideas to life faster.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                onClick={() => setRole('buyer')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-4 border border-white/15 bg-black/20 backdrop-blur-sm px-8 py-4 text-white hover:border-white/30 transition-all"
              >
                <span className="uppercase tracking-[0.25em] text-xs">
                  BROWSE TEMPLATES
                </span>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </motion.button>

              <Link to="/weekends">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-4 border border-white/15 bg-black/20 backdrop-blur-sm px-8 py-4 text-white hover:border-white/30 transition-all"
                >
                  <span className="uppercase tracking-[0.25em] text-xs">
                    COMPETITIONS
                  </span>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ------------------------------ */}
      {/* FOOTER */}
      {/* ------------------------------ */}
      <Footer />
    </div>
  );
};

export default SellerHome;
