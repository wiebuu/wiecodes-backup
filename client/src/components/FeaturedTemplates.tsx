import React, { useState, useEffect } from 'react';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const FeaturedTemplates = () => {
  const [featuredTemplates, setFeaturedTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    const fetchFeaturedTemplates = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/templates/filter/featured`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();

        const templatesArray = Array.isArray(data) ? data : data?.data || [];
        setFeaturedTemplates(templatesArray.slice(0, 3));
      } catch (err) {
        console.error('Error fetching featured templates:', err);
        setError('Failed to load featured templates.');
        setFeaturedTemplates([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedTemplates();
  }, []);

  const getImageUrl = (previewImageUrl: string | undefined) => {
    if (!previewImageUrl) return '/default-preview.png';
    if (previewImageUrl.startsWith('https://raw.githubusercontent.com/')) return previewImageUrl;
    if (previewImageUrl.startsWith('uploads/')) return `${import.meta.env.VITE_BACKEND_URL}/${previewImageUrl}`;
    return previewImageUrl;
  };

  return (
    <section className="py-16 pb-8 sm:py-24 sm:pb-8 bg-black">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4">
              FEATURED
              <br />
              TEMPLATES
            </h2>
            <Link to="/templates" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors uppercase tracking-widest text-xs">
              VIEW ALL TEMPLATES
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>

        {loading && (
          <div className="text-center text-white/50 py-12">LOADING...</div>
        )}
        {error && (
          <div className="text-center text-red-500 py-12">{error}</div>
        )}
        {!loading && !error && featuredTemplates.length === 0 && (
          <div className="text-center text-white/50 py-12">NO FEATURED TEMPLATES FOUND</div>
        )}

        {!loading && !error && featuredTemplates.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {featuredTemplates.map((template: any, index) => {
              const key = template._id || template.id || index;
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link to={`/template/${template._id || ''}`} className="group h-full">
                    <div className="relative bg-black border border-white/10 hover:border-white/20 transition-colors duration-300 h-full flex flex-col">
                      {/* Image */}
                      <div className="relative overflow-hidden aspect-[2/1] flex-shrink-0">
                        <img
                          src={getImageUrl(template.previewImageUrl)}
                          alt={`${template.title} preview`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          loading="lazy"
                        />
                        {/* Permanent dark tint overlay with hover arrow */}
                        <div className="absolute inset-0 bg-black/10 transition-opacity duration-300 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="w-10 h-10 border border-white/30 flex items-center justify-center">
                              <ExternalLink className="w-5 h-5 text-white" />
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="p-4 sm:p-5 flex flex-col flex-grow">
                        <h3 className="text-sm font-semibold text-white uppercase tracking-widest mb-2 line-clamp-1">
                          {template.title || 'UNTITLED TEMPLATE'}
                        </h3>
                        <div className="flex items-center gap-3 text-white/40 text-xs uppercase tracking-widest mb-auto">
                          {template.framework && <span>{template.framework}</span>}
                          {template.tags?.[0] && (
                            <>
                              <span className="w-1 h-1 bg-white/20 rounded-full"></span>
                              <span>{template.tags[0]}</span>
                            </>
                          )}
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <span className="text-white font-mono text-base">
                            {template.isFree ? 'FREE' : `$${template.estimatedPrice || 29}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedTemplates;
