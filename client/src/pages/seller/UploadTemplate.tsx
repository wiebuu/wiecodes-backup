import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Github,
  ExternalLink,
  CheckCircle2,
  Star,
  ShoppingCart,
  Download,
  Calendar,
  TrendingUp,
  Globe,
  ShieldCheck,
  FileText,
  Target,
  Zap,
  Check,
  X,
  Plus,
} from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { toast } from 'sonner';
import { useScrollToTop, useScrollAnimation } from '@/hooks/useScrollAnimation';
import AffiliateUploadForm from '@/components/AffiliateUploadForm';
import UserCompetitionsBanner from '@/components/UserCompetitionsBanner';
import { useSellerInitialLoad } from '@/contexts/SellerInitialLoadContext';
import SellerLoadingScreen from '@/components/SellerLoadingScreen';

const UploadTemplate = () => {
  useScrollToTop();
  const { isSellerInitialLoad, markSellerInitialLoadComplete } = useSellerInitialLoad();
  const { ref: uploadRef, isVisible: uploadVisible } = useScrollAnimation();
  const connectSectionRef = React.useRef<HTMLDivElement>(null);
  const detailsSectionRef = React.useRef<HTMLDivElement>(null);
  const pricingSectionRef = React.useRef<HTMLDivElement>(null);
  const publishSectionRef = React.useRef<HTMLDivElement>(null);
  
  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    githubRepo: '',
    estimatedPrice: '',
    category: '',
    framework: '',
    platform: '',
    theme: '',
    tags: [],
    features: [],
    techStack: [],
    codePreview: '',
    liveLink: '',
    previewImage: null,
  });

  useEffect(() => {
    const storedRepo = localStorage.getItem('githubRepo');
    if (storedRepo) {
      setFormData((prev) => ({ ...prev, githubRepo: storedRepo }));
    }
  }, []);


  const [newTag, setNewTag] = useState('');
  const [newFeature, setNewFeature] = useState('');
  const [newTech, setNewTech] = useState('');
  const [uploadType, setUploadType] = useState('github');

  const categories = ['Admin Panel', 'Agency',
    'Authentication',
    'Blog',
    'Coming Soon',
    'Consulting',
    'Course',
    'Crypto',
    'Dashboard',
    'Documentation',
    'E-commerce',
    'Error Page',
    'Event',
    'Fitness',
    'Forms',
    'Forum',
    'Gamified App',
    'Healthcare',
    'Landing Page',
    'Learning App',
    'Magazine',
    'Mobile App',
    'Music',
    'NFT',
    'Non-Profit',
    'Other',
    'Photography',
    'Portfolio',
    'Practice App',
    'Pricing Page',
    'Productivity Tool',
    'Real Estate',
    'Restaurant',
    'Resume',
    'SaaS Product',
    'Skill Builder',
    'Social Media',
    'Speed Test',
    'Startup',
    'Typing Test',
    'Travel',
    'Wedding',];
  const frameworks = ['Angular', 'Astro', 'Bootstrap', 'Django', 'Express.js', 'Flutter', 'Gatsby', 'HTML', 'Laravel', 'Next.js', 'Nuxt.js', 'React', 'React Native', 'Remix', 'Ruby on Rails', 'Svelte', 'Tailwind CSS', 'Vue', 'Other'];
  const platforms = ['Android', 'Cross-platform', 'Desktop', 'iOS', 'Mobile', 'Tablet', 'TV', 'Web', 'Wearables', 'Other'];
  const themes = ['Light', 'Dark', 'Both'];

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, newTag.trim()] });
      setNewTag('');
    }
  };

  const removeTag = (tag) => {
    setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) });
  };

  const addFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData({ ...formData, features: [...formData.features, newFeature.trim()] });
      setNewFeature('');
    }
  };

  const removeFeature = (feature) => {
    setFormData({ ...formData, features: formData.features.filter((f) => f !== feature) });
  };

  const addTech = () => {
    if (newTech.trim() && !formData.techStack.includes(newTech.trim())) {
      setFormData({ ...formData, techStack: [...formData.techStack, newTech.trim()] });
      setNewTech('');
    }
  };

  const removeTech = (tech) => {
    setFormData({ ...formData, techStack: formData.techStack.filter((t) => t !== tech) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) return toast.error('You must be logged in to upload a template');
    if (!formData.githubRepo) {
      toast.error(
        uploadType === 'affiliate'
          ? 'Please enter an affiliate link'
          : 'Please authorize a GitHub repository before submitting.'
      );
      return;
    }

    if (!formData.title || !formData.githubRepo || !formData.estimatedPrice) {
      return toast.error('Please fill in the required fields');
    }

    const form = new FormData();
    form.append('title', formData.title);
    form.append('description', formData.description);
    form.append('estimatedPrice', formData.estimatedPrice);
    form.append('category', formData.category);
    form.append('framework', formData.framework);
    form.append('platform', formData.platform);
    form.append('theme', formData.theme);
    form.append('tags', JSON.stringify(formData.tags));
    form.append('features', JSON.stringify(formData.features));
    form.append('techStack', JSON.stringify(formData.techStack));
    form.append('codePreview', formData.codePreview);
    form.append('liveLink', formData.liveLink);
    form.append("uploadType", uploadType);
    form.append("githubRepo", formData.githubRepo);

    if (formData.previewImage) {
      form.append('previewImage', formData.previewImage);
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/templates/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });

      const result = await res.json();
      if (res.ok && result.success) {
        toast.success(result.message || 'Template uploaded');
        localStorage.removeItem('githubRepo');
        setFormData({
          title: '',
          description: '',
          githubRepo: '',
          estimatedPrice: '',
          category: '',
          framework: '',
          platform: '',
          theme: '',
          tags: [],
          features: [],
          techStack: [],
          codePreview: '',
          liveLink: '',
          previewImage: null,
        });
        setNewTag('');
        setNewFeature('');
        setNewTech('');
      } else {
        toast.error(result.message || 'Upload failed');
      }
    } catch (error) {
      console.error(error);
      toast.error('Upload error');
    }
  };

  // Calculate publishing checklist
  const publishingChecklist = [
    { id: 'repo', label: 'Repository Connected', completed: !!formData.githubRepo },
    { id: 'title', label: 'Title Added', completed: !!formData.title?.trim() },
    { id: 'description', label: 'Description Complete', completed: !!formData.description?.trim() && formData.description.length > 50 },
    { id: 'price', label: 'Pricing Added', completed: !!formData.estimatedPrice },
    { id: 'ready', label: 'Ready to Publish', completed: !!formData.githubRepo && !!formData.title?.trim() && !!formData.estimatedPrice },
  ];

  if (isSellerInitialLoad) {
    return <SellerLoadingScreen onLoadingComplete={markSellerInitialLoadComplete} />;
  }

  return (
    <div className="min-h-screen bg-[#050505] relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            width: '100%',
            height: '100%',
          }}
        />
      </div>

      <Header />

      <main className="relative z-10">
        <section className="relative min-h-[70vh] py-24 flex items-center justify-center overflow-hidden border-b border-white/10">
          <div className="absolute inset-0 opacity-[0.08]">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(74, 222, 128, 0.1) 0%, transparent 20%), radial-gradient(circle at 90% 80%, rgba(74, 222, 128, 0.1) 0%, transparent 25%)',
            }} />
          </div>

          <div className="container mx-auto px-4 md:px-12 relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-5xl"
            >
              <h1 className="text-[clamp(2.5rem,8vw,5.5rem)] font-black leading-[0.85] tracking-tighter text-white mb-8">
                PUBLISH.<br />
                BUILD.<br />
                EARN.
              </h1>

              <div className="flex flex-wrap gap-8 mb-8 text-xs uppercase tracking-[0.3em] text-white/60 font-mono">
                <span className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-400/60 rounded-full" />
                  GITHUB WORKFLOW
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-400/60 rounded-full" />
                  85% CREATOR REVENUE
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-white/30 rounded-full" />
                  MANUAL REVIEW
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-white/30 rounded-full" />
                  SEO OPTIMIZED
                </span>
              </div>

              <div className="w-full h-px bg-white/10 mb-8" />

              <p className="text-lg md:text-xl text-white/60 max-w-2xl mb-8 leading-relaxed">
                Publish professional templates, earn 85% of every sale, and build your reputation in the developer community.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button
                  variant="default"
                  className="h-14 px-10 text-sm uppercase tracking-[0.3em] bg-white text-black hover:bg-white/90 rounded-none"
                >
                  START PUBLISHING
                </Button>
                <Button
                  variant="ghost"
                  className="h-14 px-10 text-sm uppercase tracking-[0.3em] border border-white/20 text-white hover:bg-white/5 hover:border-white/30 rounded-none"
                >
                  VIEW CREATOR GUIDE
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        <UserCompetitionsBanner />

        <section className="py-16 border-b border-white/10">
          <div className="container mx-auto px-4 md:px-12">
            <div className="flex items-center justify-between gap-4">
              {[
                { id: 1, label: 'CONNECT', current: true, completed: !!formData.githubRepo, ref: connectSectionRef },
                { id: 2, label: 'DETAILS', current: false, completed: false, ref: detailsSectionRef },
                { id: 3, label: 'REVIEW', current: false, completed: false, ref: pricingSectionRef },
                { id: 4, label: 'GO LIVE', current: false, completed: false, ref: publishSectionRef },
              ].map((step, index, array) => (
                <React.Fragment key={step.id}>
                  <button
                    onClick={() => scrollToSection(step.ref)}
                    className="flex items-center gap-4 hover:opacity-80 transition-opacity cursor-pointer"
                  >
                    <div className={`
                      w-10 h-10 flex items-center justify-center border text-xs font-black uppercase tracking-[0.3em]
                      ${step.completed ? 'border-emerald-400/40 bg-emerald-400/5 text-emerald-400/70' :
                        step.current ? 'border-white/30 bg-white/5 text-white' :
                          'border-white/10 text-white/40'}
                    `}>
                      {step.completed ? <Check className="w-4 h-4" /> : String(step.id).padStart(2, '0')}
                    </div>
                    <span className={`text-xs font-mono uppercase tracking-[0.3em] ${step.completed ? 'text-emerald-400/70' : 'text-white/40'}`}>{step.label}</span>
                  </button>
                  {index < array.length - 1 && (
                    <div className="flex-1 h-px bg-white/10" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-8 space-y-12" ref={uploadRef}>
                <div ref={connectSectionRef}>
                  <section>
                    <p className="text-xs uppercase tracking-[0.4em] text-white/40 font-mono mb-6">00 / UPLOAD TYPE</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <motion.div
                        whileHover={{ y: -4 }}
                        onClick={() => setUploadType('github')}
                        className={`
                        border p-8 cursor-pointer transition-all duration-300
                        ${uploadType === 'github' ? 'border-emerald-400/40 bg-emerald-400/5' : 'border-white/10 bg-[#0A0A0A] hover:border-white/20'}
                      `}
                      >
                        <Github className="w-12 h-12 mb-6 text-white/60" />
                        <h3 className="text-2xl font-black text-white mb-3">GitHub Repository</h3>
                        <p className="text-sm text-white/50 font-mono">Recommended</p>
                        <p className="mt-4 text-white/60 text-sm leading-relaxed">
                          Connect your repository for automated deployment and verification.
                        </p>
                      </motion.div>
                      <motion.div
                        whileHover={{ y: -4 }}
                        onClick={() => setUploadType('affiliate')}
                        className={`
                        border p-8 cursor-pointer transition-all duration-300
                        ${uploadType === 'affiliate' ? 'border-emerald-400/40 bg-emerald-400/5' : 'border-white/10 bg-[#0A0A0A] hover:border-white/20'}
                      `}
                      >
                        <ExternalLink className="w-12 h-12 mb-6 text-white/60" />
                        <h3 className="text-2xl font-black text-white mb-3">Affiliate Product</h3>
                        <p className="text-sm text-white/50 font-mono">For external tools</p>
                        <p className="mt-4 text-white/60 text-sm leading-relaxed">
                          Promote external tools and services from platforms like Gumroad.
                        </p>
                      </motion.div>
                    </div>
                  </section>

                  <section>
                    <div className="flex items-end justify-between mb-6">
                      <div>
                        <p className="text-xs uppercase tracking-[0.4em] text-white/40 font-mono">01</p>
                        <h2 className="text-5xl font-black text-white mt-1">Repository</h2>
                      </div>
                    </div>

                    <Card className="border border-white/10 bg-[#0A0A0A] rounded-none">
                      <CardContent className="p-8">
                        {uploadType === 'github' && (
                          <>
                            {!formData.githubRepo ? (
                              <div className="text-center py-12">
                                <Github className="w-16 h-16 text-white/40 mx-auto mb-8" />
                                <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-[0.2em]">CONNECT YOUR REPOSITORY</h3>
                                <p className="text-white/60 text-sm mb-8 max-w-lg mx-auto leading-relaxed">
                                  Grant us temporary access to your repository for deployment and verification. We never modify your code.
                                </p>
                                <Button
                                  variant="default"
                                  onClick={() =>
                                    window.location.href = `https://github.com/login/oauth/authorize?client_id=${import.meta.env.VITE_GITHUB_CLIENT_ID
                                      }&scope=repo&redirect_uri=${import.meta.env.VITE_GITHUB_REDIRECT_URL}`
                                  }
                                  className="h-14 px-12 text-sm uppercase tracking-[0.3em] bg-white text-black hover:bg-white/90 rounded-none"
                                >
                                  AUTHORIZE GITHUB
                                </Button>
                              </div>
                            ) : (
                              <div className="space-y-6">
                                <div className="flex items-center gap-4 mb-4">
                                  <CheckCircle2 className="w-8 h-8 text-emerald-400/70" />
                                  <div>
                                    <p className="text-sm uppercase tracking-[0.3em] text-emerald-400/70 font-mono">CONNECTION ESTABLISHED</p>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="border border-white/10 p-6 bg-white/[0.02]">
                                    <p className="text-xs uppercase tracking-[0.3em] text-white/40 font-mono mb-3">REPOSITORY</p>
                                    <p className="text-white text-lg font-mono">{formData.githubRepo}</p>
                                  </div>
                                  <div className="border border-white/10 p-6 bg-white/[0.02]">
                                    <p className="text-xs uppercase tracking-[0.3em] text-white/40 font-mono mb-3">BRANCH</p>
                                    <p className="text-white text-lg font-mono">main</p>
                                  </div>
                                  <div className="border border-white/10 p-6 bg-white/[0.02]">
                                    <p className="text-xs uppercase tracking-[0.3em] text-white/40 font-mono mb-3">VISIBILITY</p>
                                    <p className="text-white text-lg font-mono">Public</p>
                                  </div>
                                  <div className="border border-white/10 p-6 bg-white/[0.02]">
                                    <p className="text-xs uppercase tracking-[0.3em] text-white/40 font-mono mb-3">LAST COMMIT</p>
                                    <p className="text-white text-lg font-mono">Just now</p>
                                  </div>
                                </div>

                                <Button
                                  variant="ghost"
                                  onClick={() =>
                                    window.location.href = `https://github.com/login/oauth/authorize?client_id=${import.meta.env.VITE_GITHUB_CLIENT_ID
                                      }&scope=repo&redirect_uri=${import.meta.env.VITE_GITHUB_REDIRECT_URL}`
                                  }
                                  className="h-12 px-6 text-sm uppercase tracking-[0.3em] border border-white/20 text-white/70 hover:bg-white/5 hover:border-white/30 rounded-none"
                                >
                                  CHANGE REPOSITORY
                                </Button>
                              </div>
                            )}
                          </>
                        )}
                        {uploadType === 'affiliate' && <AffiliateUploadForm formData={formData} setFormData={setFormData} />}
                      </CardContent>
                    </Card>
                  </section>
                </div>

                <div ref={detailsSectionRef}>
                  <section>
                    <div className="flex items-end justify-between mb-6">
                      <div>
                        <p className="text-xs uppercase tracking-[0.4em] text-white/40 font-mono">02</p>
                        <h2 className="text-5xl font-black text-white mt-1">Template Information</h2>
                      </div>
                    </div>

                    <Card className="border border-white/10 bg-[#0A0A0A] rounded-none">
                      <CardContent className="p-8 space-y-10">
                      <div>
                        <label className="block text-xs uppercase tracking-[0.3em] text-white/60 font-mono mb-3">TITLE</label>
                        <Input
                          required
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          placeholder="Enter a descriptive title for your template..."
                          className="h-14 bg-transparent border-white/10 text-white text-xl placeholder:text-white/30 font-mono rounded-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-[0.3em] text-white/60 font-mono mb-3">DESCRIPTION</label>
                        <Textarea
                          required
                          rows={6}
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder="Explain what your template does, why it's useful, and how to use it..."
                          className="bg-transparent border-white/10 text-white placeholder:text-white/30 font-mono rounded-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs uppercase tracking-[0.3em] text-white/60 font-mono mb-3">CATEGORY</label>
                          <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                            <SelectTrigger className="h-14 bg-transparent border-white/10 text-white font-mono rounded-none">
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#0A0A0A] border-white/10 text-white rounded-none">
                              {categories.map((cat) => <SelectItem key={cat} value={cat.toLowerCase()} className="font-mono">{cat}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="block text-xs uppercase tracking-[0.3em] text-white/60 font-mono mb-3">FRAMEWORK</label>
                          <Select value={formData.framework} onValueChange={(v) => setFormData({ ...formData, framework: v })}>
                            <SelectTrigger className="h-14 bg-transparent border-white/10 text-white font-mono rounded-none">
                              <SelectValue placeholder="Select framework" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#0A0A0A] border-white/10 text-white rounded-none">
                              {frameworks.map((fw) => <SelectItem key={fw} value={fw.toLowerCase()} className="font-mono">{fw}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="block text-xs uppercase tracking-[0.3em] text-white/60 font-mono mb-3">PLATFORM</label>
                          <Select value={formData.platform} onValueChange={(v) => setFormData({ ...formData, platform: v })}>
                            <SelectTrigger className="h-14 bg-transparent border-white/10 text-white font-mono rounded-none">
                              <SelectValue placeholder="Select platform" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#0A0A0A] border-white/10 text-white rounded-none">
                              {platforms.map((pf) => <SelectItem key={pf} value={pf.toLowerCase()} className="font-mono">{pf}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="block text-xs uppercase tracking-[0.3em] text-white/60 font-mono mb-3">THEME</label>
                          <Select value={formData.theme} onValueChange={(v) => setFormData({ ...formData, theme: v })}>
                            <SelectTrigger className="h-14 bg-transparent border-white/10 text-white font-mono rounded-none">
                              <SelectValue placeholder="Select theme" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#0A0A0A] border-white/10 text-white rounded-none">
                              {themes.map((th) => <SelectItem key={th} value={th.toLowerCase()} className="font-mono">{th}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-[0.3em] text-white/60 font-mono mb-3">TAGS</label>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {formData.tags.map((tag, i) => (
                            <span key={i} className="flex items-center gap-2 px-4 py-2 border border-white/10 bg-white/[0.02] text-white/80 text-sm font-mono">
                              {tag}
                              <button onClick={() => removeTag(tag)}><X className="w-3 h-3" /></button>
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-4">
                          <Input
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            placeholder="Enter tag..."
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                            className="h-12 bg-transparent border-white/10 text-white placeholder:text-white/30 font-mono rounded-none"
                          />
                          <Button type="button" onClick={addTag} variant="ghost" className="h-12 px-6 border border-white/10 hover:border-white/20 rounded-none">
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-[0.3em] text-white/60 font-mono mb-3">FEATURES</label>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {formData.features.map((f, i) => (
                            <span key={i} className="flex items-center gap-2 px-4 py-2 border border-white/10 bg-white/[0.02] text-white/80 text-sm font-mono">
                              {f}
                              <button onClick={() => removeFeature(f)}><X className="w-3 h-3" /></button>
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-4">
                          <Input
                            value={newFeature}
                            onChange={(e) => setNewFeature(e.target.value)}
                            placeholder="Enter feature..."
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                            className="h-12 bg-transparent border-white/10 text-white placeholder:text-white/30 font-mono rounded-none"
                          />
                          <Button type="button" onClick={addFeature} variant="ghost" className="h-12 px-6 border border-white/10 hover:border-white/20 rounded-none">
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-[0.3em] text-white/60 font-mono mb-3">TECH STACK</label>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {formData.techStack.map((t, i) => (
                            <span key={i} className="flex items-center gap-2 px-4 py-2 border border-white/10 bg-white/[0.02] text-white/80 text-sm font-mono">
                              {t}
                              <button onClick={() => removeTech(t)}><X className="w-3 h-3" /></button>
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-4">
                          <Input
                            value={newTech}
                            onChange={(e) => setNewTech(e.target.value)}
                            placeholder="Enter technology..."
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
                            className="h-12 bg-transparent border-white/10 text-white placeholder:text-white/30 font-mono rounded-none"
                          />
                          <Button type="button" onClick={addTech} variant="ghost" className="h-12 px-6 border border-white/10 hover:border-white/20 rounded-none">
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-[0.3em] text-white/60 font-mono mb-3">LIVE LINK (OPTIONAL)</label>
                        <Input
                          value={formData.liveLink}
                          onChange={(e) => setFormData({ ...formData, liveLink: e.target.value })}
                          placeholder="https://..."
                          className="h-14 bg-transparent border-white/10 text-white text-lg placeholder:text-white/30 font-mono rounded-none"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </section>
              </div>

              <div ref={pricingSectionRef}>
                <section>
                  <div className="flex items-end justify-between mb-6">
                    <div>
                      <p className="text-xs uppercase tracking-[0.4em] text-white/40 font-mono">03</p>
                      <h2 className="text-5xl font-black text-white mt-1">Pricing</h2>
                    </div>
                  </div>

                  <Card className="border border-white/10 bg-[#0A0A0A] rounded-none">
                    <CardContent className="p-8">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2">
                          <label className="block text-xs uppercase tracking-[0.3em] text-white/60 font-mono mb-3">ESTIMATED PRICE (INR)</label>
                          <div className="relative">
                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-4xl font-black text-white/30 font-mono">₹</span>
                            <Input
                              required
                              type="number"
                              value={formData.estimatedPrice}
                              onChange={(e) => setFormData({ ...formData, estimatedPrice: e.target.value })}
                              placeholder="499"
                              className="h-20 pl-16 text-4xl font-black bg-transparent border-white/10 text-white placeholder:text-white/30 font-mono rounded-none"
                            />
                          </div>
                          <p className="text-xs uppercase tracking-[0.3em] text-white/40 font-mono mt-3">Suggested: ₹499</p>
                        </div>

                        <div className="space-y-6 border-l border-white/10 pl-8">
                          <div>
                            <p className="text-xs uppercase tracking-[0.3em] text-white/40 font-mono mb-2">YOUR REVENUE</p>
                            <p className="text-3xl font-black text-emerald-400/90 font-mono">
                              ₹{formData.estimatedPrice ? Math.floor(parseInt(formData.estimatedPrice) * 0.85) : '424'}
                            </p>
                          </div>
                          <div className="h-px bg-white/10" />
                          <div>
                            <p className="text-xs uppercase tracking-[0.3em] text-white/40 font-mono mb-2">PLATFORM FEE</p>
                            <p className="text-2xl font-black text-white/70 font-mono">
                              ₹{formData.estimatedPrice ? Math.floor(parseInt(formData.estimatedPrice) * 0.15) : '75'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </section>
              </div>

              <div ref={publishSectionRef}>
                <section className="border-t border-white/10 pt-12">
                  <Card className="border border-white/10 bg-[#0A0A0A] rounded-none">
                    <CardContent className="p-8">
                      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="flex gap-8">
                          <div>
                            <p className="text-xs uppercase tracking-[0.3em] text-white/40 font-mono mb-2">REPOSITORY</p>
                            <p className="text-white font-mono text-sm">{formData.githubRepo || 'Not connected'}</p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-[0.3em] text-white/40 font-mono mb-2">PRICE</p>
                            <p className="text-white font-mono text-sm">₹{formData.estimatedPrice || '0'}</p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-[0.3em] text-white/40 font-mono mb-2">EST. REVENUE</p>
                            <p className="text-emerald-400/90 font-mono text-sm">₹{formData.estimatedPrice ? Math.floor(parseInt(formData.estimatedPrice) * 0.85) : '0'}</p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-[0.3em] text-white/40 font-mono mb-2">REVIEW TIME</p>
                            <p className="text-white font-mono text-sm">24-48h</p>
                          </div>
                        </div>

                        <div className="flex-1">
                          <Button
                            type="submit"
                            onClick={handleSubmit}
                            className="w-full h-16 text-sm uppercase tracking-[0.3em] bg-white text-black hover:bg-white/90 rounded-none"
                          >
                            PUBLISH TEMPLATE
                          </Button>
                          <p className="text-xs uppercase tracking-[0.3em] text-white/40 font-mono mt-4 text-center">
                            YOUR REPOSITORY REMAINS YOURS. WE ONLY RECEIVE COLLABORATOR ACCESS. REVOKE ANYTIME.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </section>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-6">
                <div className="sticky top-8 space-y-6">
                  <Card className="border border-white/10 bg-[#0A0A0A] rounded-none">
                    <CardContent className="p-8">
                      <p className="text-xs uppercase tracking-[0.4em] text-white/40 font-mono mb-6">PUBLISHING GUIDE</p>
                      <div className="space-y-4">
                        {publishingChecklist.map((item) => (
                          <div key={item.id} className="flex items-center gap-4">
                            <div className={`w-5 h-5 border flex items-center justify-center ${item.completed ? 'border-emerald-400/50 bg-emerald-400/5' : 'border-white/20'}`}>
                              {item.completed && <Check className="w-3 h-3 text-emerald-400/80" />}
                            </div>
                            <span className={`text-sm font-mono ${item.completed ? 'text-emerald-400/80' : 'text-white/60'}`}>{item.label}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-white/10 bg-[#0A0A0A] rounded-none">
                    <CardContent className="p-8">
                      <p className="text-xs uppercase tracking-[0.4em] text-white/40 font-mono mb-6">CREATOR BENEFITS</p>
                      <div className="space-y-4">
                        {[
                          { icon: TrendingUp, label: '85% Revenue' },
                          { icon: Globe, label: 'SEO Optimization' },
                          { icon: Star, label: 'Homepage Features' },
                          { icon: ShieldCheck, label: 'Verified Reviews' },
                          { icon: Calendar, label: 'Weekly Payouts' },
                        ].map((benefit, i) => {
                          const Icon = benefit.icon;
                          return (
                            <div key={i} className="flex items-center gap-4">
                              <Icon className="w-4 h-4 text-white/40" />
                              <span className="text-sm font-mono text-white/80">{benefit.label}</span>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-white/10 bg-[#0A0A0A] rounded-none">
                    <CardContent className="p-8">
                      <p className="text-xs uppercase tracking-[0.4em] text-white/40 font-mono mb-6">MARKETPLACE REVIEW</p>
                      <div className="flex flex-col gap-0">
                        {['Repository Review', 'SEO Optimization', 'Pricing Review', 'Approval', 'Publication'].map((step, i, arr) => (
                          <div key={i} className="flex items-start gap-4 pb-4">
                            <div className="flex flex-col items-center gap-0">
                              <div className="w-4 h-4 border border-white/30 flex items-center justify-center bg-white/5">
                                <div className="w-1.5 h-1.5 bg-white/30" />
                              </div>
                              {i < arr.length - 1 && <div className="w-px h-10 bg-white/10" />}
                            </div>
                            <span className="text-sm font-mono text-white/70 pt-0.5">{step}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-white/10 bg-[#0A0A0A] rounded-none">
                    <CardContent className="p-8">
                      <p className="text-xs uppercase tracking-[0.4em] text-white/40 font-mono mb-6">QUICK STATS</p>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <p className="text-xs uppercase tracking-[0.3em] text-white/40 font-mono mb-2">Templates Published</p>
                          <p className="text-2xl font-black text-white font-mono">0</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.3em] text-white/40 font-mono mb-2">Total Sales</p>
                          <p className="text-2xl font-black text-white font-mono">0</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.3em] text-white/40 font-mono mb-2">Revenue</p>
                          <p className="text-2xl font-black text-emerald-400/90 font-mono">₹0</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.3em] text-white/40 font-mono mb-2">Downloads</p>
                          <p className="text-2xl font-black text-white font-mono">0</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-white/10 bg-[#0A0A0A] rounded-none">
                    <CardContent className="p-8">
                      <p className="text-xs uppercase tracking-[0.4em] text-white/40 font-mono mb-6">TEMPLATE GUIDELINES</p>
                      <ul className="space-y-3 text-sm text-white/60 font-mono">
                        <li className="flex gap-3"><FileText className="w-3.5 h-3.5 text-white/40 mt-0.5" /><span>Clean, modular, documented code</span></li>
                        <li className="flex gap-3"><FileText className="w-3.5 h-3.5 text-white/40 mt-0.5" /><span>Include README with setup</span></li>
                        <li className="flex gap-3"><FileText className="w-3.5 h-3.5 text-white/40 mt-0.5" /><span>List dependencies clearly</span></li>
                        <li className="flex gap-3"><FileText className="w-3.5 h-3.5 text-white/40 mt-0.5" /><span>Thoroughly tested</span></li>
                        <li className="flex gap-3"><FileText className="w-3.5 h-3.5 text-white/40 mt-0.5" /><span>Open source license</span></li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default UploadTemplate;
