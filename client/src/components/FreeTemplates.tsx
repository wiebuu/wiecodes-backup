import React, { useState, useEffect } from 'react';
import { Star, Download, Eye, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const FreeTemplates = () => {
  const [freeTemplates, setFreeTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);
  const { ref, isVisible } = useScrollAnimation();

  useEffect(() => {
    const fetchFreeTemplates = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');

        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/templates/filter/free`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        const templatesArray = Array.isArray(data) ? data : data?.data || [];
        setFreeTemplates(templatesArray);
      } catch (err) {
        console.error('Error fetching free templates:', err);
        setError('Failed to load free templates.');
        setFreeTemplates([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFreeTemplates();
  }, []);

  const getImageUrl = (previewImageUrl: string | undefined) => {
    if (!previewImageUrl) return '/default-preview.png';
    if (previewImageUrl.startsWith('https://raw.githubusercontent.com/')) return previewImageUrl;
    if (previewImageUrl.startsWith('uploads/')) return `${import.meta.env.VITE_BACKEND_URL}/${previewImageUrl}`;
    return previewImageUrl;
  };

  return (
    <section className="py-16 sm:py-24 bg-surface/30">
      <div className="container mx-auto px-4">
        <div ref={ref} className={`text-center mb-12 sm:mb-16 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
          <span className="industrial-label text-foreground-muted mb-4 block">GET STARTED</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-4 tracking-tighter">
            FREE TEMPLATES
          </h2>
          <p className="text-base sm:text-lg text-foreground-muted max-w-xl mx-auto">
            Get started with our collection of premium-quality free templates
          </p>
        </div>

        {loading && (
          <div className="text-center text-foreground-muted py-12">LOADING...</div>
        )}
        {error && (
          <div className="text-center text-destructive py-12">{error}</div>
        )}
        {!loading && !error && freeTemplates.length === 0 && (
          <div className="text-center text-foreground-muted py-12">NO FREE TEMPLATES AVAILABLE</div>
        )}

        {!loading && !error && freeTemplates.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-12">
            {freeTemplates.map((template: any, index) => {
              const key = template._id || template.id || index;
              return (
                <Link key={key} to={`/template/${template._id || template.id || ''}`}>
                  <div className="industrial-card group cursor-pointer">
                    <div className="relative overflow-hidden rounded-[4px]">
                      <img
                        src={getImageUrl(template.previewImageUrl)}
                        alt={`${template.title} preview`}
                        className="w-full h-32 sm:h-40 md:h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-surface/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        <span className="industrial-label bg-surface text-foreground">
                          FREE
                        </span>
                        {template.uploadType === 'affiliate' && (
                          <span className="industrial-label bg-surface-secondary text-foreground-muted">
                            AFFILIATE
                          </span>
                        )}
                      </div>

                      {template.liveLink && (
                        <a
                          href={template.liveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="industrial-button-primary px-3 py-1.5 flex items-center gap-1.5">
                            <Eye className="w-3.5 h-3.5" />
                            <span className="industrial-label">PREVIEW</span>
                          </div>
                        </a>
                      )}
                    </div>
                    
                    <div className="p-4 sm:p-5">
                      <div className="flex items-center justify-between mb-3">
                        <span className="industrial-label">
                          {template.framework || 'N/A'}
                        </span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-metallic-200 text-metallic-200" />
                          <span className="industrial-label">{template.averageRating ?? '0'}</span>
                        </div>
                      </div>
                      
                      <h3 className="text-sm font-medium text-foreground mb-3 line-clamp-2">
                        {template.title || 'UNTITLED TEMPLATE'}
                      </h3>
                      
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {Array.isArray(template.tags) && template.tags.length > 0 ? (
                          template.tags.slice(0, 2).map((tag: string) => (
                            <span
                              key={tag}
                              className="industrial-label bg-surface-secondary px-2 py-0.5"
                            >
                              {tag}
                            </span>
                          ))
                        ) : (
                          <span className="industrial-label italic">NO TAGS</span>
                        )}
                        {template.tags?.length > 2 && (
                          <span className="industrial-label px-2 py-0.5 border border-border">
                            +{template.tags.length - 2}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-foreground-muted">
                          <Download className="w-4 h-4" />
                          <span className="text-xs font-mono">{template.sales ?? 0}</span>
                        </div>
                        <span className="text-sm font-semibold text-metallic-100">
                          FREE
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <div className="text-center">
          <Link to="/templates?filter=free">
            <div className="industrial-button-secondary inline-flex items-center gap-2">
              <span className="uppercase tracking-[0.15em] text-xs">BROWSE ALL FREE TEMPLATES</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FreeTemplates;
