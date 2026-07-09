import React from 'react';
import { Users } from 'lucide-react';
import { motion } from 'framer-motion';

const CtaSection = () => {
  return (
    <section className="pt-4 pb-8 sm:pt-6 sm:pb-12 bg-background relative overflow-hidden">
      {/* Checkered background pattern */}
      <div className="absolute inset-0 opacity-15" 
           style={{ 
             backgroundImage: 'linear-gradient(45deg, #444 25%, transparent 25%, transparent 75%, #444 75%, #444), linear-gradient(45deg, #444 25%, transparent 25%, transparent 75%, #444 75%, #444)',
             backgroundSize: '20px 20px',
             backgroundPosition: '0 0, 10px 10px'
           }} 
      />
      
      {/* Gradient fade out */}
      <div className="absolute inset-0 pointer-events-none" 
           style={{ 
             background: 'linear-gradient(to bottom, black 0%, transparent 5%, transparent 90%, black 100%)'
           }} 
      />
      
      <div className="container mx-auto pt-6 px-4 lg:px-8 relative z-10">
        <motion.div 
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-6">
            UPDATES &amp; SERVICES
          </h2>
          
          <p className="text-foreground/50 text-sm sm:text-base mb-8 max-w-xl mx-auto">
Join our community to get instant updates on new weekend challenges, fresh template drops, and important platform announcements. We also provide professional software development services tailored to modern businesses and startups.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="inline-flex items-center gap-2 border border-border bg-background px-8 py-3 text-xs uppercase tracking-widest text-foreground hover:border-foreground/30 hover:bg-surface transition-all duration-300">
              <Users className="w-4 h-4" />
              JOIN COMMUNITY
            </button>
            
            <button className="inline-flex items-center gap-2 border border-border bg-background px-8 py-3 text-xs uppercase tracking-widest text-foreground hover:border-foreground/30 hover:bg-surface transition-all duration-300">
              CONTACT FOR SERVICES
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CtaSection;
