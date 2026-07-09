import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, easeInOut } from 'framer-motion';
import {
  Star, Lock, Eye, ArrowLeft, Heart, Share2,Check,ShoppingCart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Footer from '@/components/Footer';
import { useScrollToTop } from '@/hooks/useScrollAnimation';
import Header from '@/components/Header';
import { useSellerInitialLoad } from '@/contexts/SellerInitialLoadContext';
import SellerLoadingScreen from '@/components/SellerLoadingScreen';

const TemplateInfo = () => {
  useScrollToTop();
  const { isSellerInitialLoad, markSellerInitialLoadComplete } = useSellerInitialLoad();
  const { id } = useParams();
  const [template, setTemplate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [suggestedTemplates, setSuggestedTemplates] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);
  const templateLink = `${import.meta.env.VITE_FRONTEND_URL}/template/${id}`;

  useEffect(() => {
    if (!id) {
      setError('No template ID provided in URL');
      setLoading(false);
      return;
    }

    const fetchTemplateAndSuggestions = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');

      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/templates/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.message || 'Template not found');
          return;
        }

        setTemplate(data);

        const suggestionsRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/templates/${id}/suggestions`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        const suggestionsData = await suggestionsRes.json();

        if (suggestionsRes.ok) {
          setSuggestedTemplates(suggestionsData);
        } else {
          console.warn('Suggestions error:', suggestionsData.message || suggestionsRes.statusText);
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (err) {
        setError('Failed to load template or suggestions');
      } finally {
        setLoading(false);
      }
    };

    fetchTemplateAndSuggestions();
  }, [id]);

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(templateLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      fallbackCopyToClipboard(templateLink);
    }
  };

  const fallbackCopyToClipboard = (text) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Fallback copy failed:', error);
    }
    document.body.removeChild(textArea);
  };
  // Helper function to get the correct image URL
  const getImageUrl = (previewImageUrl) => {
    if (!previewImageUrl) return '/default-preview.png';

    // If it's already a GitHub URL, use it directly
    if (previewImageUrl.startsWith('https://raw.githubusercontent.com/')) {
      return previewImageUrl;
    }

    // If it's a local file path, prepend the backend URL
    if (previewImageUrl.startsWith('uploads/')) {
      return `${import.meta.env.VITE_BACKEND_URL}/${previewImageUrl}`;
    }

    // Fallback for any other format
    return previewImageUrl;
  };

  if (isSellerInitialLoad) {
    return <SellerLoadingScreen onLoadingComplete={markSellerInitialLoadComplete} />;
  }

  if (loading) return <div className="text-center mt-20">Loading...</div>;
  if (error || !template) return <div className="text-center mt-20 text-red-500">{error || 'Template not found'}</div>;

  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-8">
        <div className="container mx-auto px-4 mb-8">
          <Link to="/seller/profile" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Profile
          </Link>
        </div>

        <motion.section
          className="container mx-auto px-4 mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: easeInOut }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Preview Section */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative group">
                <a
                  href={template.liveLink}
                  target="_blank"
                  rel="noreferrer"
                  className="block"
                >
                  <img
                    src={getImageUrl(template.previewImageUrl)}
                    alt={`${template.title} preview`}
                    className="w-full h-48 sm:h-80 object-cover rounded-md shadow-md transition-all duration-300 group-hover:shadow-xl"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 group-active:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300 rounded-md" />

                  {/* Desktop Hover Preview Button */}
                  <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:flex">
                    <Button className="pointer-events-auto text-sm h-8 px-3 rounded-md">
                      <Eye className="w-4 h-4 mr-1" />
                      Preview
                    </Button>
                  </div>
                </a>
              </div>

              <Card>
                <CardContent className="p-2 sm:p-6">
                  <h3 className="text-xs sm:text-base font-semibold mb-1 sm:mb-2">
                    File Structure
                  </h3>
                  <pre className="bg-secondary p-2 sm:p-3 rounded-md overflow-x-auto text-[10px] sm:text-sm leading-relaxed sm:leading-loose max-h-40 sm:max-h-64">
                    <code>
                      {template.codePreview || '// No File Structure available'}
                    </code>
                  </pre>
                </CardContent>
              </Card>

            </motion.div>


            {/* Info Section */}
            <motion.div className="space-y-6" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
              <div>

                <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-4 sm:mt-4">
                  {template.title}
                </h1>


                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
                  {(template.tags || []).map((tag: string) => (
                    <span
                      key={tag}
                      className="bg-accent text-accent-foreground px-2 sm:px-3 py-0.5 sm:py-1 rounded-full font-medium text-xs sm:text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* ✅ Compact Layout for Mobile ONLY */}
                <div className="flex sm:hidden flex-wrap justify-between items-center gap-2 text-[11px]">
                  {/* Left group: Framework, Theme, Platform */}
                  <div className="flex flex-wrap items-center gap-1">
                    <span className="text-muted-foreground font-medium">{template.framework}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full font-medium ${template.theme === 'Dark'
                        ? 'bg-gray-800 text-white'
                        : 'bg-gray-100 text-gray-800'
                        }`}
                    >
                      {template.theme}
                    </span>
                    <span className="bg-accent px-2 py-0.5 rounded-full text-gray-800 font-medium">
                      {template.platform}
                    </span>
                  </div>

                  {/* Right group: Rating, Downloads, Status */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Rating */}
                    <div className="flex items-center gap-0.5">
                      <Star
                        className="w-3.5 h-3.5"
                        style={{
                          fill: template.color || '#FFD700',
                          color: template.color || '#FFD700',
                        }}
                      />
                      <span className="font-semibold">
                        {template.averageRating?.toFixed(1) || '0.0'}
                      </span>
                      <span className="text-muted-foreground">
                        ({template.ratings?.length || 0})
                      </span>
                    </div>

                    {/* Downloads */}
                    <span className="text-muted-foreground whitespace-nowrap">
                      {template.sales} downloads
                    </span>

                    {/* Status */}
                    <span
                      className={`px-2 py-0.5 rounded-full font-semibold text-[10px] ${template.status === 'approved'
                        ? 'bg-green-100 text-green-700'
                        : template.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                        }`}
                    >
                      {template.status}
                    </span>
                  </div>
                </div>

                {/* ✅ Default Layout for Tablet and Desktop */}
                <div className="hidden sm:flex flex-wrap sm:items-center sm:justify-between sm:gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground font-medium">{template.framework}</span>
                    <span
                      className={`px-2 py-1 rounded-full font-medium ${template.theme === 'Dark'
                        ? 'bg-gray-800 text-white'
                        : 'bg-gray-100 text-gray-800'
                        }`}
                    >
                      {template.theme}
                    </span>
                    <span className="bg-accent px-2 py-1 rounded-full text-gray-800 font-medium">
                      {template.platform}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Star
                        className="w-4 h-4"
                        style={{
                          fill: template.color || '#FFD700',
                          color: template.color || '#FFD700',
                        }}
                      />
                      <span className="font-semibold">
                        {template.averageRating?.toFixed(1) || '0.0'}
                      </span>
                      <span className="text-muted-foreground">
                        ({template.ratings?.length || 0})
                      </span>
                    </div>

                    <span className="text-muted-foreground">{template.sales} downloads</span>

                    <span
                      className={`px-3 py-1 rounded-full font-semibold ${template.status === 'approved'
                        ? 'bg-green-100 text-green-700'
                        : template.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                        }`}
                    >
                      {template.status}
                    </span>
                  </div>
                </div>

{/* Pricing + Actions */}
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 mb-6 sm:mb-8 p-4 sm:p-6 bg-secondary/50 rounded-lg border border-border">
                  {/* Pricing */}
                  <div>
                    <span
                      className={`text-lg sm:text-3xl font-bold font-heading ${template.isFree === true ? 'text-green-600' : 'text-primary'}`}
                    >
                      {template.isFree ? 'Free' : `₹${template.estimatedPrice}`}
                    </span>
                    <span className="text-muted-foreground ml-2 text-xs sm:text-sm">one-time purchase</span>
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-wrap justify-end gap-2">
                    {/* Share Button */}
                    <Button
                      onClick={handleCopyToClipboard}
                      className={`
        inline-flex items-center px-2.5 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium rounded-md border transition
        ${copied
                          ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100'
                          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}
      `}
                    >
                      {copied ? (
                        <>
                          <Check className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Share2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          Share
                        </>
                      )}
                    </Button>

                    {/* Add to Cart */}
                    {/* Buy Now */}
                      <Button
                        className="px-2.5 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm"
                      >
                        Buy Now
                        <Lock className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
                      </Button>
                  </div>
                </div>


                {/* Description */}
                <p className="text-muted-foreground text-sm sm:text-lg leading-relaxed mb-6 sm:mb-8">
                  {template.description}
                </p>
                
              </div>

              {/* Features & Tech Stack - side by side on mobile, stacked on desktop */}
              <div className="flex flex-col sm:flex-col gap-4 sm:gap-0 md:gap-0 lg:gap-0 xs:flex-row">
                {/* Features */}
                <Card className="flex-1 transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl">
                  <CardContent className="p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Features Included</h3>
                    <ul className="space-y-2 sm:space-y-3">
                      {(template.features || []).map((feature: string, index: number) => (
                        <li key={index} className="flex items-start space-x-2 sm:space-x-3">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                          <span className="text-muted-foreground text-sm sm:text-base">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Tech Stack */}
                <Card className="flex-1 transition-all duration-300 hover:scale-[1.01] mt-1 hover:shadow-2xl">
                  <CardContent className="p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Technology Stack</h3>
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {(template.techStack || []).map((tech: string) => (
                        <span key={tech} className="bg-primary text-primary-foreground px-2 sm:px-3 py-1 sm:py-2 rounded-lg font-medium text-xs sm:text-sm">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

            </motion.div>
          </div>



          {/* Suggested Templates */}
          <section className="bg-secondary/30 mt-16">
            <h2 className="text-3xl font-heading font-bold text-primary mb-12 text-center">
              Similar Templates You Might Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
              {suggestedTemplates.map((template, index) => (
                <Link key={template._id} to={`/template/${template._id}`}>
                  <Card
                    className="group cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:shadow-xl"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardContent className="p-0">
                      {/* 📸 Image Preview */}
                      <div className="relative overflow-hidden rounded-t-lg">
                        <img
                          src={getImageUrl(template.previewImageUrl)}
                          alt={template.title}
                          className="w-full h-28 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.src = "/default-preview.png";
                          }}
                        />
                        <Button
                          size="sm"
                          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 px-2 py-1 text-xs sm:px-4 sm:py-2 sm:text-sm"
                        >
                          <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          View
                        </Button>
                      </div>

                      {/* 📝 Content */}
                      <div className="p-3 sm:p-6 space-y-2 sm:space-y-4">
                        {/* Title + Rating */}
                        <div className="flex justify-between items-center">
                          <h3 className="text-sm sm:text-lg font-semibold text-primary line-clamp-1">
                            {template.title}
                          </h3>
                          <div className="flex items-center gap-1">
                            <Star
                              className="w-3 h-3 sm:w-4 sm:h-4"
                              style={{
                                fill: template.color || '#ffd602',
                                color: template.color || '#ffd602',
                              }}
                            />
                            <span className="text-xs sm:text-sm font-medium">
                              {template.averageRating ?? '4.5'}
                            </span>
                          </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 sm:gap-2">
                          {(template.tags || []).slice(0, 3).map((tag: string) => (
                            <span
                              key={tag}
                              className="bg-accent text-accent-foreground px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Features */}
                        {template.features?.length > 0 && (
                          <ul className="text-xs sm:text-sm text-muted-foreground list-disc list-inside space-y-1">
                            {template.features.slice(0, 3).map((feature: string, i: number) => (
                              <li key={i}>{feature}</li>
                            ))}
                          </ul>
                        )}

                        {/* Pricing */}
                        <div className="flex justify-between items-center mt-1 sm:mt-2">
                          <span
                            className={`text-base sm:text-xl font-bold ${template.isFree ? 'text-green-600' : 'text-primary'}`}
                          >
                            {template.isFree ? 'Free' : `₹${template.estimatedPrice}`}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

          </section>
        </motion.section>
      </main>
      <Footer />
    </div>
  );
};

export default TemplateInfo;
