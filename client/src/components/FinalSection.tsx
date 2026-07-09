import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const FinalSection = () => {
  return (
    <section className="relative py-24 sm:py-32 bg-background overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-no-repeat bg-cover"
        style={{
          backgroundImage: "url(/backgrounds/background2.png)",
          backgroundPosition: "center bottom",
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent z-[1]" />

      {/* Content */}
      <div className="container mx-auto px-6 lg:px-10 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-2xl"
        >
          {/* Top Label */}
          <p className="text-xs uppercase tracking-[0.4em] text-white/50 mb-6">
            For The Developers
          </p>

          {/* Headline */}
          <div className="mb-8">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[0.9] tracking-tight">
              BUILD. COMPETE.
            </h2>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[0.9] tracking-tight mt-2">
              EARN.
            </h2>
          </div>

          {/* Subtext */}
          <p className="text-white/60 text-sm sm:text-base mb-10 max-w-md">
            Join the next generation of developers. Showcase your skills, compete and earn with your creations.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Link to="/seller">
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
                  Become a Seller
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

            <Link to="/weekends">
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
                  Compete
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
  );
};

export default FinalSection;
