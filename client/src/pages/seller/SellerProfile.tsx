import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Edit,
  Star,
  Download,
  Globe,
  Trash,
  FileText,
  ShoppingCart,
  Gift,
  Github,
  Check,
  ChevronRight,
  Calendar,
  CheckCircle2,
  CreditCard,
  ExternalLink,
  Target
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
} from '@/components/ui/alert-dialog';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import SellerFooter from '@/components/SellerFooter';
import EditProfileModal from '@/components/EditProfileModal';
import { toast } from 'sonner';
import { useSellerInitialLoad } from '@/contexts/SellerInitialLoadContext';
import SellerLoadingScreen from '@/components/SellerLoadingScreen';
import SellerProfileBackground from '@/components/SellerProfileBackground';

type TemplateType = {
  _id: string;
  title: string;
  description?: string;
  status: string;
  estimatedPrice?: number;
  price?: string;
  preview?: string;
  framework?: string;
  platform?: string;
  theme?: string;
  averageRating?: number;
  sales?: number;
  tags: string[];
  previewImageUrl: string;
  isFree: boolean;
  createdAt?: string;
};

const SellerProfile = () => {
  const { token } = useAuth();
  const { isSellerInitialLoad, markSellerInitialLoadComplete } = useSellerInitialLoad();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingTemplateId, setDeletingTemplateId] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchUserProfile = async () => {
      try {
        setError(null);
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/me`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch profile: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        setProfile({ ...data, createdAt: data.joinDate });
      } catch (err) {
        const error = err as Error;
        console.error(error);
        setError(error.message || 'Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [token]);

  if (isSellerInitialLoad) {
    return <SellerLoadingScreen onLoadingComplete={markSellerInitialLoadComplete} />;
  }

  if (!loading && !profile) return <div>Please login to see your profile.</div>;

  if (!profile) return null;

  const freeTemplateCount =
    profile.publicTemplates?.filter(
      (t: TemplateType) => t.estimatedPrice === 0 || t.isFree === true
    )?.length ?? 0;

  const getInitials = (name: string): string =>
    name.split(' ').map((n: string) => n[0]).join('').toUpperCase();

  const handleDeleteConfirmed = async (templateId: string) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/templates/${templateId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        toast.error(`Failed to delete template: ${errorText}`);
        return;
      }

      setProfile((prevProfile: any) => {
        if (!prevProfile) return prevProfile;
        return {
          ...prevProfile,
          publicTemplates: prevProfile.publicTemplates?.filter((t: TemplateType) => t._id !== templateId),
          pendingTemplates: prevProfile.pendingTemplates?.filter((t: TemplateType) => t._id !== templateId),
        };
      });

      toast.success('Template deleted successfully');
    } catch (err) {
      const error = err as Error;
      console.error(error);
      toast.error(error.message || 'Failed to delete template');
    }
  };

  const getImageUrl = (imageUrl?: string): string => {
    if (!imageUrl) return 'https://placehold.co/800x600/0a0a0a/333?text=WIECODES';
    if (imageUrl.startsWith('https://raw.githubusercontent.com/')) return imageUrl;
    if (imageUrl.startsWith('uploads/')) return `${import.meta.env.VITE_BACKEND_URL}/${imageUrl}`;
    return imageUrl;
  };

  return (
    <div className="relative min-h-screen bg-[#030303] text-white">
      <Header />
      <SellerProfileBackground username={profile.username} />

      <main className="relative z-10">
        {/* Hero Content */}
        <section className="relative px-6 md:px-12 lg:px-24 pt-8 pb-16">
          <div className="max-w-7xl mx-auto w-full">
            <Link
              to="/seller"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/40 hover:text-white/70 transition-colors"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              BACK TO DASHBOARD
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="mt-10 flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between"
            >
              <div className="flex items-start gap-6 md:gap-8 min-w-0">
                <div className="shrink-0 w-24 h-24 md:w-32 md:h-32 bg-[#0a0a0a] border border-white/15 flex items-center justify-center text-3xl md:text-5xl font-black">
                  {getInitials(profile.username)}
                </div>

                <div className="space-y-3 pt-1 min-w-0">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[0.9] tracking-tight">
                    {profile.username.toUpperCase().split(' ').map((word: string, i: number) => (
                      <span key={i} className="block">{word}</span>
                    ))}
                  </h1>
                  <p className="text-xs uppercase tracking-[0.4em] text-white/50 font-mono">
                    JOINED {profile.joinDate ? new Date(profile.joinDate).getFullYear() : '2025'}
                  </p>
                  {profile.location && (
                    <p className="text-xs uppercase tracking-[0.4em] text-white/60 font-mono">
                      {profile.location.toUpperCase()}
                    </p>
                  )}
                </div>
              </div>

              <div className="shrink-0 sm:pt-1">
                <EditProfileModal
                  profile={profile}
                  onUpdate={(updatedProfile: any) => setProfile(updatedProfile)}
                >
                  <Button className="h-12 md:h-14 px-8 md:px-10 border border-white/20 bg-[#0a0a0a] hover:bg-white/5 text-white text-xs uppercase tracking-[0.3em] rounded-none">
                    <Edit className="w-3.5 h-3.5 mr-2" /> EDIT PROFILE
                  </Button>
                </EditProfileModal>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-base md:text-lg text-white/60 max-w-2xl mt-8 leading-relaxed"
            >
              {profile.bio || "Passionate web developer creating modern templates and available for freelance work on Wiecodes."}
            </motion.p>
          </div>
        </section>

        {/* Main Content - 2 Column Layout: Left (Content) | Right (Sticky Cards) */}
        <section className="px-12 md:px-24 pb-24 relative z-10">
          <div className="max-w-8xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Left: Main Content */}
              <div className="lg:col-span-8 space-y-12">
                {/* Creator Links & Professional */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Creator Links Card */}
                  <Card className="border border-white/10 bg-[#0a0a0a]">
                    <CardContent className="p-6">
                      <p className="text-xs uppercase tracking-[0.4em] text-white/50 font-mono mb-6">CREATOR LINKS</p>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 border-b border-white/5 pb-2">
                          <Globe className="w-3.5 h-3.5 text-white/40" />
                          <div className="flex-1">
                            <p className="text-[11px] uppercase tracking-[0.2em] text-white/60 mb-0.5">PORTFOLIO</p>
                            {profile.website ? (
                              <a href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`} target="_blank" rel="noreferrer"
                                 className="text-sm text-white/70 hover:text-white transition-colors font-mono">
                                {profile.website}
                              </a>
                            ) : (
                              <p className="text-sm text-red-400/70 font-mono">NOT ADDED</p>
                            )}
                          </div>
                          {profile.website && <ExternalLink className="w-3 h-3 text-white/25" />}
                        </div>
                        <div className="flex items-center gap-4 border-b border-white/5 pb-2">
                          <Github className="w-3.5 h-3.5 text-white/40" />
                          <div className="flex-1">
                            <p className="text-[11px] uppercase tracking-[0.2em] text-white/60 mb-0.5">GITHUB</p>
                            {profile.github ? (
                              <a href={`https://github.com/${profile.github}`} target="_blank" rel="noreferrer"
                                 className="text-sm text-white/70 hover:text-white transition-colors font-mono">
                                github.com/{profile.github}
                              </a>
                            ) : (
                              <p className="text-sm text-red-400/70 font-mono">NOT ADDED</p>
                            )}
                          </div>
                          {profile.github && <ExternalLink className="w-3 h-3 text-white/25" />}
                        </div>
                        <div className="flex items-center gap-4">
                          <Globe className="w-3.5 h-3.5 text-white/40" />
                          <div className="flex-1">
                            <p className="text-[11px] uppercase tracking-[0.2em] text-white/60 mb-0.5">X / TWITTER</p>
                            {profile.twitter ? (
                              <a href={`https://twitter.com/${profile.twitter}`} target="_blank" rel="noreferrer"
                                 className="text-sm text-white/70 hover:text-white transition-colors font-mono">
                                @{profile.twitter}
                              </a>
                            ) : (
                              <p className="text-sm text-red-400/70 font-mono">NOT ADDED</p>
                            )}
                          </div>
                          {profile.twitter && <ExternalLink className="w-3 h-3 text-white/25" />}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Professional Details Card */}
                  <Card className="border border-white/10 bg-[#0a0a0a]">
                    <CardContent className="p-6">
                      <p className="text-xs uppercase tracking-[0.4em] text-white/50 font-mono mb-6">PROFESSIONAL</p>
                      <div className="space-y-4">
                        {profile.roles && profile.roles.length > 0 && (
                          <div className="flex flex-col gap-2 border-b border-white/5 pb-3">
                            <p className="text-[11px] uppercase tracking-[0.2em] text-white/60 font-mono">WORK TYPE</p>
                            <p className="text-sm text-white/80 font-mono">{profile.roles.join(' • ')}</p>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/60" />
                          <p className="text-sm text-emerald-400/70 font-mono uppercase tracking-[0.2em]">OPEN TO WORK</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Metrics Cards */}
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-white/40 font-mono mb-6">CREATOR METRICS</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2 border border-white/10 bg-[#0a0a0a] p-8">
                      <p className="text-xs uppercase tracking-[0.3em] text-white/50 mb-3 font-mono">TOTAL EARNINGS (AFTER FEE)</p>
                      <p className="text-5xl md:text-6xl font-black text-emerald-400/90 font-mono">
                        ₹{Math.floor((profile.earnings ?? 0) * 0.8)}
                      </p>
                    </div>
                    {[
                      { label: 'TEMPLATES', value: profile.publicTemplates?.length ?? 0, icon: FileText },
                      { label: 'SALES', value: profile.sales ?? 0, icon: ShoppingCart },
                      { label: 'DOWNLOADS', value: profile.publicTemplates?.reduce((sum: number, t: TemplateType) => sum + (t.sales ?? 0), 0) ?? 0, icon: Download },
                      { label: 'FREE TEMPLATES', value: freeTemplateCount, icon: Gift }
                    ].map((stat, i) => {
                      const Icon = stat.icon;
                      return (
                        <div key={i} className="border border-white/10 bg-[#0a0a0a] p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs uppercase tracking-[0.3em] text-white/50 mb-1 font-mono">{stat.label}</p>
                              <p className="text-3xl font-black text-white font-mono">{stat.value}</p>
                            </div>
                            <Icon className="w-6 h-6 text-white/30" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right sidebar — Profile Snapshot + Payment Methods */}
              <div className="lg:col-span-4">
                <div className="sticky top-8 space-y-6">
                  <Card className="border border-white/10 bg-[#0a0a0a]">
                    <CardContent className="p-6">
                      <p className="text-xs uppercase tracking-[0.4em] text-white/50 font-mono mb-6">PROFILE SNAPSHOT</p>
                      <div className="space-y-4">
                        <div className="border-b border-white/10 pb-4">
                          <p className="text-xs uppercase tracking-[0.3em] text-white/40 mb-1 font-mono">AVERAGE RATING</p>
                          <div className="flex items-center gap-2">
                            <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                            <p className="text-xl font-black text-white font-mono">{(profile.averageRating ?? 4.8).toFixed(1)}</p>
                          </div>
                        </div>
                        <div className="border-b border-white/10 pb-4">
                          <p className="text-xs uppercase tracking-[0.3em] text-white/40 mb-1 font-mono">MARKETPLACE RANK</p>
                          <p className="text-xl font-black text-white font-mono">#42</p>
                        </div>
                        <div className="border-b border-white/10 pb-4">
                          <p className="text-xs uppercase tracking-[0.3em] text-white/40 mb-1 font-mono">REVENUE SPLIT</p>
                          <p className="text-xl font-black text-white font-mono">~85%</p>
                        </div>
                        <div className="border-b border-white/10 pb-4">
                          <p className="text-xs uppercase tracking-[0.3em] text-white/40 mb-1 font-mono">GITHUB</p>
                          {profile.github ? (
                            <div className="flex items-center gap-2 text-white/80">
                              <Github className="w-3.5 h-3.5" />
                              <p className="text-sm font-bold">CONNECTED</p>
                            </div>
                          ) : (
                            <p className="text-sm text-white/50">NOT CONNECTED</p>
                          )}
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.3em] text-white/40 mb-1 font-mono">PAYMENT STATUS</p>
                          <div className="flex items-center gap-2 text-emerald-400/70">
                            <Check className="w-3.5 h-3.5" />
                            <p className="text-sm font-bold">ACTIVE</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-white/10 bg-[#0a0a0a]">
                    <CardContent className="p-6">
                      <p className="text-xs uppercase tracking-[0.4em] text-white/50 font-mono mb-6">PAYMENT METHODS</p>
                      {profile.paymentMethod ? (
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-2 h-2 rounded-full bg-emerald-400/80 animate-pulse" />
                            <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-400/30 animate-ping" />
                          </div>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400/70" />
                          <div className="flex-1">
                            <p className="text-[11px] uppercase tracking-[0.2em] text-white/60 mb-0.5 font-mono">{profile.paymentMethod}</p>
                            <p className="text-sm text-white/70 font-mono">{profile.paymentDetail}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <p className="text-sm text-red-400/70 font-mono uppercase tracking-[0.2em]">NO PAYMENT METHOD ADDED</p>
                          <div className="space-y-2">
                            {['UPI', 'BANK TRANSFER', 'PAYPAL', 'RAZORPAY'].map((method) => (
                              <div key={method} className="flex items-center gap-2 text-white/30">
                                <div className="w-2 h-2 rounded-full border border-white/20" />
                                <p className="text-xs font-mono">{method}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Public Work — inline row with Pending */}
              <div className="lg:col-span-8">
                <div className="flex items-end justify-between mb-6">
                  <p className="text-xs uppercase tracking-[0.4em] text-white/40 font-mono">PUBLIC WORK</p>
                  <p className="text-xs text-white/30 font-mono">
                    {profile.publicTemplates?.length ?? 0} templates
                  </p>
                </div>

                {profile.publicTemplates?.length ? (
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    {profile.publicTemplates.map((template: TemplateType, index: number) => (
                      <motion.div
                        key={template._id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.06 }}
                        className="relative"
                      >
                        <Link to={`/seller/template/${template._id}`} className="group block">
                          <div className="relative bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all duration-300 group-hover:-translate-y-0.5">
                            <div className="relative aspect-[16/9] overflow-hidden bg-zinc-900">
                              <img
                                src={getImageUrl(template.previewImageUrl)}
                                alt={template.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.onerror = null;
                                  target.src = 'https://placehold.co/800x600/0a0a0a/333?text=WIECODES';
                                }}
                              />
                              {template.isFree && (
                                <div className="absolute top-3 left-3 bg-white text-black px-2 py-0.5 text-[10px] font-bold tracking-wider">
                                  FREE
                                </div>
                              )}
                            </div>
                            <div className="p-4">
                              <h3 className="text-sm font-semibold tracking-tight line-clamp-1 mb-1">
                                {template.title}
                              </h3>
                              <div className="flex items-center justify-between text-xs text-white/50">
                                <span className="font-mono">{template.framework}</span>
                                <span>{template.isFree ? 'Free' : `₹${template.estimatedPrice}`}</span>
                              </div>
                            </div>
                          </div>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-3 right-3 bg-[#0a0a0a]/90 hover:bg-red-500 text-red-400 hover:text-white border border-white/10 w-7 h-7 rounded-none"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setDeletingTemplateId(template._id);
                          }}
                        >
                          <Trash className="w-3 h-3" />
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-14 border border-white/10 bg-[#0a0a0a] px-4">
                    <Target className="w-10 h-10 text-white/20 mx-auto mb-3" />
                    <h3 className="text-xl font-black text-white mb-2">NO PUBLIC WORK</h3>
                    <p className="text-sm text-white/50 mb-6">Upload your first template to get started</p>
                    <Link to="/seller/upload">
                      <Button className="h-11 px-6 border border-white/20 bg-transparent hover:bg-white/5 text-white text-[10px] uppercase tracking-[0.25em]">
                        <FileText className="w-3.5 h-3.5 mr-2" /> UPLOAD
                      </Button>
                    </Link>
                  </div>
                )}
              </div>

              {/* Pending — below sidebar cards, inline with Public Work */}
              <div className="lg:col-span-4">
                <div className="flex items-end justify-between mb-6">
                  <p className="text-xs uppercase tracking-[0.4em] text-white/40 font-mono">PENDING</p>
                  <p className="text-xs text-white/30 font-mono">
                    {profile.pendingTemplates?.length ?? 0} pending
                  </p>
                </div>

                {profile.pendingTemplates?.length ? (
                  <div className="space-y-4">
                    {profile.pendingTemplates.map((template: TemplateType, index: number) => (
                      <motion.div
                        key={template._id}
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.06 }}
                      >
                        <Card className="border border-white/10 bg-[#0a0a0a]">
                          <CardContent className="p-5">
                            <h4 className="text-sm font-black text-white mb-2 line-clamp-1">{template.title}</h4>
                            {template.createdAt && (
                              <div className="flex items-center gap-1.5 text-[10px] text-white/50 font-mono mb-3">
                                <Calendar className="w-3 h-3" />
                                <span>SUBMITTED {new Date(template.createdAt).toLocaleDateString()}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-yellow-400/70 animate-pulse" />
                              <span className="text-[10px] text-yellow-400/70 uppercase tracking-[0.2em] font-mono">IN REVIEW</span>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-14 border border-white/10 bg-[#0a0a0a] px-4">
                    <FileText className="w-10 h-10 text-white/20 mx-auto mb-3" />
                    <h3 className="text-xl font-black text-white mb-2">NO PENDING</h3>
                    <p className="text-sm text-white/50">Submissions awaiting review will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {deletingTemplateId && (
        <AlertDialog open onOpenChange={() => setDeletingTemplateId(null)}>
          <AlertDialogContent className="bg-[#0a0a0a] border border-white/10 [&>button]:hidden">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white text-xl font-black">CONFIRM DELETE</AlertDialogTitle>
              <AlertDialogDescription className="text-white/60">
                This action will permanently delete the template from your listings. This cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <Button variant="ghost" onClick={() => setDeletingTemplateId(null)}
                      className="border border-white/20 bg-transparent text-white hover:bg-white/5">
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  handleDeleteConfirmed(deletingTemplateId);
                  setDeletingTemplateId(null);
                }}
              >
                Yes, delete it
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      <SellerFooter />
    </div>
  );
};

export default SellerProfile;
