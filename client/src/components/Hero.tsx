import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-start pt-32 pb-12 overflow-hidden">
      {/* Background */}
      <motion.div
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="absolute inset-0 bg-no-repeat"
        style={{
          backgroundImage: "url(/backgrounds/background1.png)",
          backgroundPosition: "center right top -50px",
          backgroundSize: "100%",
        }}
      />

      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-transparent z-[1]" />

      {/* Content */}
      <div className="container mt-10 mx-auto px-6 lg:px-10 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-xl"
        >
          {/* Headline */}
          <div className="mb-10">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-[4.8rem] font-bold text-white leading-[0.9] tracking-tight">
              CODE.
            </h1>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-[4.8rem] font-bold text-white leading-[0.9] tracking-tight mt-2">
              WITHOUT
            </h1>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-[4.8rem] font-bold text-white leading-[0.9] tracking-tight mt-2">
              COMPROMISE.
            </h1>
          </div>

          {/* Divider */}
          <div className="w-12 h-px bg-white/20 mb-8" />

          {/* Subtext */}
          <div className="mb-10 space-y-3">
            <p className="text-xs sm:text-sm uppercase tracking-[0.35em] text-white/60">
              CURATED CODE.
            </p>

            <p className="text-xs sm:text-sm uppercase tracking-[0.35em] text-white/60">
              VERIFIED SELLERS.
            </p>

            <p className="text-xs sm:text-sm uppercase tracking-[0.35em] text-white/60">
              BUILT FOR PERFORMANCE.
            </p>
          </div>

          {/* CTA */}
          <Link to="/templates">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="
                flex
                items-center
                gap-4
                border
                border-white/15
                bg-black/20
                backdrop-blur-sm
                px-8
                py-4
                text-white
                hover:border-white/30
                transition-all
              "
            >
              <span className="uppercase tracking-[0.25em] text-xs">
                ENTER MARKETPLACE
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
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;