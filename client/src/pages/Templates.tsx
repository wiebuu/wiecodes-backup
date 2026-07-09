import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, ChevronDown, ChevronUp, Filter, Star } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useScrollToTop } from '@/hooks/useScrollAnimation';
import { motion } from 'framer-motion';

const normalizeTemplate = (template) => ({
  _id: template._id,
  title: template.title || 'Untitled Template',
  description: template.description || '',
  price: template.price === null || template.price === 0 || template.price === '₹0'
    ? 'Free'
    : template.price || (template.estimatedPrice ? `₹${template.estimatedPrice}` : 'Free'),
  estimatedPrice: template.estimatedPrice || 0,
  category: template.category || 'General',
  framework: template.framework || 'Unknown',
  platform: template.platform || 'Unknown',
  theme: template.theme || 'Default',
  uploadType: template.uploadType || 'zip',
  zipFilePath: template.zipFilePath || '',
  tags: template.tags?.length ? template.tags : ['General'],
  status: template.status || 'approved',
  uploadedBy: template.uploadedBy || '',
  createdAt: template.createdAt || '',
  updatedAt: template.updatedAt || '',
  rating: template.averageRating,
  downloads: template.sales ?? 0,
  preview: template.preview || '/placeholder.jpg',
  templateImageUrl: template.previewImageUrl || null,
  color: template.color || null,
  liveLink: template.liveLink || ''
});

const AnimatedCounter = ({ value, duration = 2000, delay = 0, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [startAnimation, setStartAnimation] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const delayTimeout = setTimeout(() => {
      setStartAnimation(true);
    }, delay);

    return () => clearTimeout(delayTimeout);
  }, [isVisible, delay]);

  useEffect(() => {
    if (!startAnimation) return;

    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(easeOutQuart * value);

      setCount(currentValue);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(value);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [startAnimation, value, duration]);

  return (
    <span ref={ref} className="inline-block">
      {typeof count === 'number' && !isNaN(count)
        ? count.toLocaleString()
        : '--'}
      {suffix}
    </span>
  );
};

const Templates = () => {
  useScrollToTop();
  const [searchParams] = useSearchParams();
  const [templates, setTemplates] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [stats, setStats] = useState({ templates: 0, sellers: 0, deployments: 0 });

  const categories = [
    { id: 'all', label: 'ALL' },
    { id: 'free', label: 'FREE' },
    { id: 'premium', label: 'PREMIUM' },
    { id: 'newest', label: 'LATEST' },
    { id: 'popular', label: 'POPULAR' },
  ];

  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/templates`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        const normalizedData = data.map(normalizeTemplate);
        setTemplates(normalizedData);
        applyFilters(activeCategory, normalizedData, searchQuery);
      } catch (err) {
        console.error('Error loading templates:', err);
      } finally {
        setLoading(false);
      }
    };

    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/analytics/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setStats({
          templates: data.templates || 36,
          sellers: 12,
          deployments: 68
        });
      } catch (err) {
        console.error("Error fetching stats", err);
      }
    };
    
    fetchStats();
    fetchTemplates();
  }, []);

  const applyFilters = (category, sourceTemplates = templates, search = searchQuery) => {
    let filtered = [...sourceTemplates];
    
    // Search filter
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(template => 
        template.title.toLowerCase().includes(searchLower) ||
        (template.description && template.description.toLowerCase().includes(searchLower)) ||
        (template.tags && template.tags.some(tag => tag.toLowerCase().includes(searchLower))) ||
        (template.framework && template.framework.toLowerCase().includes(searchLower))
      );
    }

    // Category filter
    if (category !== 'all') {
      if (category === 'free') {
        filtered = filtered.filter(t => t.price === 'Free' || t.price === '₹0');
      } else if (category === 'premium') {
        filtered = filtered.filter(t => t.price !== 'Free' && t.price !== '₹0');
      } else if (category === 'newest') {
        // Just sort by newest
        filtered.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      } else if (category === 'popular') {
        // Sort by most popular (downloads)
        filtered.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
      }
    } else {
      // Default sort newest
      filtered.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    }

    setFilteredTemplates(filtered);
  };

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
    applyFilters(categoryId);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    applyFilters(activeCategory, templates, e.target.value);
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return 'https://placehold.co/800x600/0a0a0a/333?text=WIECODES';
    if (imageUrl.startsWith('https://raw.githubusercontent.com/')) return imageUrl;
    if (imageUrl.startsWith('uploads/')) return `${import.meta.env.VITE_BACKEND_URL}/${imageUrl}`;
    return imageUrl;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="relative">


        {/* Hero Background Layers - Vault of Templates */}
        <div className="absolute inset-0 left-0 right-0 h-[900px] overflow-hidden pointer-events-none z-0">
          {/* Left side gradient fade for text visibility */}
          <div className="absolute left-0 top-0 bottom-0 w-1/2 z-40"
               style={{ background: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0) 80%)' }} />

          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-1/2 z-35"
               style={{ background: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.9) 30%, rgba(0,0,0,0) 70%)' }} />
          
          {/* Volumetric Light Beams */}
          <div className="absolute inset-0 z-20 opacity-30">
            <div className="absolute top-0 left-1/4 w-1 h-full" style={{
              background: 'linear-gradient(to bottom, rgba(100,100,110,0.2) 0%, rgba(100,100,110,0) 100%)',
              transform: 'skewX(-5deg)'
            }} />
            <div className="absolute top-0 left-2/3 w-1.5 h-full" style={{
              background: 'linear-gradient(to bottom, rgba(80,80,90,0.15) 0%, rgba(80,80,90,0) 100%)',
              transform: 'skewX(3deg)'
            }} />
          </div>

          {/* Brutalist Vault - SVG */}
          <svg className="absolute inset-0 w-full h-full z-10" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
            <defs>
              {/* Premium Brutalist Concrete Block Pattern */}
              <pattern id="concrete" patternUnits="userSpaceOnUse" width="100" height="100">
                <rect width="100" height="100" fill="#0e0f11"/>
                {/* Concrete blocks with mortar lines */}
                <rect x="0" y="0" width="48" height="48" fill="#101214" />
                <rect x="52" y="0" width="48" height="48" fill="#101214" />
                <rect x="0" y="52" width="48" height="48" fill="#101214" />
                <rect x="52" y="52" width="48" height="48" fill="#101214" />
                {/* Aggregate specks */}
                <circle cx="20" cy="20" r="1" fill="#141618" opacity="0.7"/>
                <circle cx="70" cy="30" r="0.8" fill="#151719" opacity="0.6"/>
                <circle cx="35" cy="75" r="1.2" fill="#131517" opacity="0.7"/>
                <circle cx="80" cy="80" r="0.9" fill="#141618" opacity="0.6"/>
              </pattern>
              
              {/* Luxury Blueprint Grid with dots */}
              <pattern id="blueprint" patternUnits="userSpaceOnUse" width="40" height="40">
                {/* Light grid */}
                <line x1="0" y1="0" x2="40" y2="0" stroke="#25282d" strokeWidth="0.4" opacity="0.2"/>
                <line x1="0" y1="20" x2="40" y2="20" stroke="#25282d" strokeWidth="0.2" opacity="0.15"/>
                <line x1="0" y1="40" x2="40" y2="40" stroke="#25282d" strokeWidth="0.4" opacity="0.2"/>
                <line x1="0" y1="0" x2="0" y2="40" stroke="#25282d" strokeWidth="0.4" opacity="0.2"/>
                <line x1="20" y1="0" x2="20" y2="40" stroke="#25282d" strokeWidth="0.2" opacity="0.15"/>
                <line x1="40" y1="0" x2="40" y2="40" stroke="#25282d" strokeWidth="0.4" opacity="0.2"/>
                {/* Grid dots */}
                <circle cx="0" cy="0" r="1" fill="#2c3036" opacity="0.4"/>
                <circle cx="20" cy="20" r="0.8" fill="#2c3036" opacity="0.35"/>
                <circle cx="40" cy="40" r="1" fill="#2c3036" opacity="0.4"/>
              </pattern>
              
              {/* Dark Slate Stone Wall Texture */}
              <pattern id="stone" patternUnits="userSpaceOnUse" width="150" height="100">
                <rect width="150" height="100" fill="#08090a"/>
                {/* Irregular stone pattern */}
                <polygon points="0,0 50,5 40,45 0,40" fill="#090a0c" opacity="0.8"/>
                <polygon points="50,5 100,0 90,50 40,45" fill="#0a0b0d" opacity="0.9"/>
                <polygon points="100,0 150,0 150,48 90,50" fill="#08090b" opacity="0.85"/>
                <polygon points="0,40 40,45 35,100 0,100" fill="#0a0b0d" opacity="0.9"/>
                <polygon points="40,45 90,50 85,100 35,100" fill="#090a0c" opacity="0.85"/>
                <polygon points="90,50 150,48 150,100 85,100" fill="#0a0b0d" opacity="0.9"/>
                {/* Stone texture specks */}
                <circle cx="25" cy="25" r="1.2" fill="#0f1113" opacity="0.4"/>
                <circle cx="75" cy="22" r="1" fill="#101214" opacity="0.5"/>
                <circle cx="125" cy="28" r="0.9" fill="#0f1113" opacity="0.45"/>
                <circle cx="20" cy="75" r="1.1" fill="#101214" opacity="0.5"/>
                <circle cx="65" cy="72" r="0.8" fill="#0f1113" opacity="0.4"/>
                <circle cx="130" cy="78" r="1" fill="#101214" opacity="0.45"/>
              </pattern>
              
              {/* Geometric Tech Pattern - subtle */}
              <pattern id="tech" patternUnits="userSpaceOnUse" width="120" height="120">
                <rect width="120" height="120" fill="transparent"/>
                <polygon points="0,0 60,0 30,30" fill="none" stroke="#1a1d22" strokeWidth="0.5" opacity="0.15"/>
                <polygon points="60,0 120,0 120,60 90,90 60,60" fill="none" stroke="#1a1d22" strokeWidth="0.5" opacity="0.15"/>
                <polygon points="120,60 120,120 60,120 90,90" fill="none" stroke="#1a1d22" strokeWidth="0.5" opacity="0.15"/>
                <polygon points="0,120 60,120 30,90 0,60" fill="none" stroke="#1a1d22" strokeWidth="0.5" opacity="0.15"/>
              </pattern>

              {/* Crescent Architectural Cutout Mask & Filter */}
              <mask id="crescentMask">
                <rect x="0" y="0" width="1600" height="900" fill="white"/>
                <circle cx="280" cy="240" r="140" fill="black"/>
                <circle cx="380" cy="215" r="125" fill="white"/>
              </mask>
              <filter id="softEdgeBlur" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="8" />
              </filter>
            </defs>

            {/* Massive black stone walls */}
            <rect x="0" y="0" width="1600" height="900" fill="url(#stone)"/>

            {/* Subtle Crescent Architectural Cutout - Integrated Light Formation */}
            <g filter="url(#softEdgeBlur)" opacity="0.25">
              <rect x="0" y="0" width="1600" height="900" fill="rgba(45, 48, 55, 0.6)" mask="url(#crescentMask)"/>
              {/* Very subtle volumetric light fade around it */}
              <circle cx="280" cy="240" r="180" fill="rgba(50, 53, 60, 0.12)"/>
            </g>
            
            {/* Monumental Brutalist Geometric Structures */}
            <g opacity="0.85">
              {/* Left: Hexagonal pillars */}
              <polygon points="180,900 180,300 250,250 320,300 320,900" fill="url(#concrete)" stroke="#25282d" strokeWidth="3"/>
              <polygon points="300,900 300,350 370,300 440,350 440,900" fill="url(#concrete)" stroke="#25282d" strokeWidth="2"/>
              
              {/* Center: Angular W-shaped frame */}
              <polygon points="650,900 650,200 750,150 800,250 850,150 950,200 950,900" fill="url(#concrete)" stroke="#282b30" strokeWidth="3"/>
              
              {/* Right: Staggered rectangular blocks */}
              <rect x="1050" y="250" width="120" height="650" fill="url(#concrete)" stroke="#25282d" strokeWidth="2"/>
              <rect x="1180" y="320" width="130" height="580" fill="url(#concrete)" stroke="#25282d" strokeWidth="2"/>
              <rect x="1320" y="280" width="120" height="620" fill="url(#concrete)" stroke="#25282d" strokeWidth="2"/>
            </g>

            {/* Floating Geometric Shapes */}
            <g opacity="0.55">
              {/* Hexagons */}
              <polygon points="700,280 730,260 760,280 760,320 730,340 700,320" fill="none" stroke="#3a3d43" strokeWidth="1.5" transform="rotate(-5 730 300)"/>
              <polygon points="950,350 980,330 1010,350 1010,390 980,410 950,390" fill="none" stroke="#3a3d43" strokeWidth="1.2" transform="rotate(4 980 370)"/>
              <polygon points="1200,300 1230,280 1260,300 1260,340 1230,360 1200,340" fill="none" stroke="#3a3d43" strokeWidth="1.3" transform="rotate(-3 1230 320)"/>
              
              {/* Triangles */}
              <polygon points="750,400 800,360 850,400" fill="none" stroke="#3a3d43" strokeWidth="1.1"/>
              <polygon points="1000,450 1050,410 1100,450" fill="none" stroke="#3a3d43" strokeWidth="1.2"/>
              
              {/* Diamonds */}
              <polygon points="850,450 880,420 910,450 880,480" fill="none" stroke="#3a3d43" strokeWidth="1" transform="rotate(8 880 450)"/>
              <polygon points="1100,400 1130,370 1160,400 1130,430" fill="none" stroke="#3a3d43" strokeWidth="1.1" transform="rotate(-6 1130 400)"/>
              
              {/* Octagons */}
              <polygon points="600,350 620,330 650,330 670,350 670,380 650,400 620,400 600,380" fill="none" stroke="#3a3d43" strokeWidth="1.2" transform="rotate(10 635 365)"/>
            </g>

            {/* Geometric Shelving with Different Shapes */}
            <g opacity="0.45" fill="#121417" stroke="#1f2226" strokeWidth="2">
              {/* Hexagonal shelves */}
              <polygon points="680,480 780,480 820,510 780,540 680,540 640,510" fill="#121417" stroke="#1f2226" strokeWidth="2"/>
              <polygon points="700,560 800,560 830,590 800,620 700,620 670,590" fill="#121417" stroke="#1f2226" strokeWidth="2"/>
              {/* Angular shelves */}
              <polygon points="920,490 1080,490 1100,520 900,520" fill="#121417" stroke="#1f2226" strokeWidth="2"/>
            </g>

            {/* Abstract Template Cards - Different Shapes */}
            <g opacity="0.4">
              {/* Square card */}
              <rect x="710" y="465" width="45" height="40" fill="#1a1d22" stroke="#2a2d32" strokeWidth="1"/>
              {/* Rounded card */}
              <rect x="770" y="468" width="50" height="40" fill="#171a1e" stroke="#2a2d32" strokeWidth="1" rx="4"/>
              {/* Diamond card */}
              <polygon points="950,475 980,455 1010,475 980,495" fill="#191c20" stroke="#2a2d32" strokeWidth="1"/>
              {/* Hexagon card */}
              <polygon points="1040,470 1065,460 1090,470 1090,495 1065,505 1040,495" fill="#16191d" stroke="#2a2d32" strokeWidth="1"/>
            </g>

            {/* Giant Geometric Code Motifs */}
            <g opacity="0.1" fill="#3a3d43">
              {/* Curly braces */}
              <polygon points="400,450 370,450 360,470 370,490 360,510 370,530 400,530 390,510 395,490 385,470 390,450" fill="#3a3d43" opacity="0.15"/>
              {/* Brackets */}
              <rect x="420" y="450" width="15" height="80" fill="none" stroke="#3a3d43" strokeWidth="3" opacity="0.12"/>
              {/* Arrow */}
              <polygon points="1100,470 1130,490 1100,510" fill="#3a3d43" opacity="0.13"/>
            </g>

            {/* Blueprint lines and wireframes */}
            <rect x="0" y="0" width="1600" height="900" fill="url(#blueprint)" opacity="0.5"/>
            
            {/* Subtle geometric tech pattern */}
            <rect x="0" y="0" width="1600" height="900" fill="url(#tech)" opacity="0.45"/>
            
            {/* Dynamic Abstract Motifs */}
            <g opacity="0.07" stroke="#2a2d32" strokeWidth="1" fill="none">
              {/* Concentric hexagons */}
              <polygon points="1350,320 1380,300 1410,320 1410,360 1380,380 1350,360"/>
              <polygon points="1350,320 1365,310 1380,320 1380,360 1365,370 1350,360"/>
              {/* Nested diamonds */}
              <polygon points="300,320 320,300 340,320 320,340"/>
              <polygon points="300,320 310,310 320,320 310,330"/>
            </g>

            {/* Angular decorative elements */}
            <g opacity="0.08" fill="#2a2d32">
              <polygon points="250,400 280,370 280,430"/> {/* Small triangle */}
              <polygon points="1180,480 1210,450 1240,480 1210,510"/> {/* Diamond */}
            </g>

          </svg>

          {/* Floating dust particles */}
          <div className="absolute inset-0 z-30 opacity-20">
            <div className="absolute top-1/4 left-1/3 w-1 h-1 bg-white rounded-full animate-pulse" />
            <div className="absolute top-1/3 left-1/2 w-0.5 h-0.5 bg-white rounded-full animate-pulse" style={{animationDelay: '0.5s'}}/>
            <div className="absolute top-1/5 right-1/4 w-1 h-1 bg-white rounded-full animate-pulse" style={{animationDelay: '1s'}}/>
            <div className="absolute top-2/5 left-2/3 w-0.5 h-0.5 bg-white rounded-full animate-pulse" style={{animationDelay: '1.5s'}}/>
            <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white rounded-full animate-pulse" style={{animationDelay: '0.8s'}}/>
          </div>

          {/* Dark overlay - LIGHTER so moon is visible */}
          <div className="absolute inset-0 bg-black/40 z-35" />
          
          {/* Film Grain Overlay */}
          <div 
            className="absolute inset-0 z-45 opacity-[0.02]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat'
            }}
          />
        </div>

        {/* Hero Section */}
        <section className="relative px-12 md:px-24 pt-[30vh] pb-20 overflow-hidden z-10">

          <div className="max-w-8xl mx-auto relative z-10">
            {/* Left Content - Glow Behind Text */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-12"
            >
              <div className="relative z-10">
                <p className="text-gray-400 text-xs tracking-[0.3em] mb-4 font-mono drop-shadow-lg">— MARKETPLACE</p>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8 text-white drop-shadow-2xl">
                  Curated Code. <br />
                  Built to Ship.
                </h1>
              </div>

              {/* Right Content: Stats */}
              <div className="flex items-center gap-10 relative z-10">
                <div className="text-center">
                  <p className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
                    <AnimatedCounter value={stats.templates} duration={2000} />
                  </p>
                  <p className="text-xs text-white/50 tracking-[0.3em] uppercase mt-2">TEMPLATES</p>
                </div>
                <div className="w-px h-12 bg-white/20" />
                <div className="text-center">
                  <p className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
                    <AnimatedCounter value={stats.sellers} duration={2000} delay={200} />
                  </p>
                  <p className="text-xs text-white/50 tracking-[0.3em] uppercase mt-2">SELLERS</p>
                </div>
                <div className="w-px h-12 bg-white/20" />
                <div className="text-center">
                  <p className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
                    <AnimatedCounter value={stats.deployments} duration={2000} delay={400} />
                  </p>
                  <p className="text-xs text-white/50 tracking-[0.3em] uppercase mt-2">DEPLOYMENTS</p>
                </div>
              </div>
            </motion.div>

            {/* Search and Filter Bar - Stronger Backdrop */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-12 flex flex-col lg:flex-row lg:flex-wrap items-start lg:items-center gap-6 justify-between relative z-10"
            >
              {/* Search */}
              <div className="relative flex-shrink-0 w-full lg:w-1/2">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-full bg-black/60 border border-white/20 rounded-none pl-12 pr-12 py-4 text-sm text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-all backdrop-blur-md shadow-2xl"
                />
                {searchQuery && (
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      applyFilters(activeCategory, templates, '');
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Categories */}
              <div className="flex items-center gap-8 overflow-x-auto pb-1">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category.id)}
                    className={`text-xs font-medium tracking-[0.25em] transition-colors whitespace-nowrap px-0.5 py-0.5 drop-shadow-lg ${
                      activeCategory === category.id 
                        ? 'text-white' 
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Template Grid */}
        <section className="px-12 md:px-24 pb-24 relative z-10">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white/[0.02] border border-white/5 aspect-[4/3] animate-pulse" />
                ))}
              </div>
            ) : filteredTemplates.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                No templates found. Try a different search.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredTemplates.map((template, index) => (
                  <motion.div
                    key={template._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.05 }}
                  >
                    <Link 
                      to={`/template/${template._id}`}
                      className="group block"
                    >
                      <div className="bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all duration-300 group-hover:-translate-y-1">
                        {/* Image */}
                        <div className="relative aspect-[4/3] overflow-hidden bg-zinc-900">
                          <img
                            src={getImageUrl(template.templateImageUrl)}
                            alt={template.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.onerror = null;
                              target.src = 'https://placehold.co/800x600/0a0a0a/333?text=WIECODES';
                            }}
                          />
                          
                          {/* Overlay on hover */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
                            <div />
                            <div className="flex items-center gap-2">
                              <div className="w-10 h-10 bg-white text-black flex items-center justify-center">
                                <ArrowRight className="w-5 h-5" />
                              </div>
                            </div>
                          </div>

                          {/* Badge */}
                          {template.price === 'Free' && (
                            <div className="absolute top-4 left-4 bg-white text-black px-3 py-1 text-xs font-bold tracking-wider">
                              FREE
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-5">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="text-lg font-semibold tracking-tight line-clamp-1">
                              {template.title}
                            </h3>
                          </div>
                          
                          <p className="text-sm text-white/50 mb-4 line-clamp-1">
                            {template.description}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs text-white/50">
                              <span className="font-mono tracking-wider">{template.framework}</span>
                              <span className="text-white/20">•</span>
                              <span>{template.price === 'Free' ? 'Free' : template.price}</span>
                            </div>
                            
                            {template.rating && (
                              <div className="flex items-center gap-1 text-xs">
                                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                <span>{template.rating}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Templates;
