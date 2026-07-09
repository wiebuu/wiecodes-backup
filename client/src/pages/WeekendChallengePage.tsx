import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Star, ExternalLink, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { useInitialLoad } from '@/contexts/InitialLoadContext';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import LoadingScreen from '@/components/LoadingScreen';

interface User {
  _id: string;
  username?: string;
  email?: string;
}

interface Template {
  _id: string;
  title: string;
  description?: string;
  uploadedBy: User;
  createdAt: string;
  liveLink?: string;
  stars?: number;
}

interface Winner {
  position: number;
  template: Template;
  _id: string;
  assignedAt: string;
}

interface Competition {
  _id: string;
  name: string;
  description: string;
  prize?: string;
  prizeLimit?: string;
  prize_description?: string;
  rules?: string;
  start_date: string;
  end_date: string;
  visibility_type: 'public' | 'custom';
  join_code?: string;
  participants?: User[];
  published?: boolean;
  winners?: Winner[];
  templates?: Template[];
  type: 'WIECODES_WEEKEND' | 'SPECIAL';
  challenge_question?: string;
  requirements?: string;
  notes?: string;
  info?: string;
  createdAt: string;
  updatedAt: string;
  competitionNumber?: number;
  wiecodesWeekendNumber?: number;
}

export default function WeekendChallengePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { isInitialLoad, markInitialLoadComplete } = useInitialLoad();
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState('');
  const [countdownLabel, setCountdownLabel] = useState('TIME REMAINING');
  const [showSubmission, setShowSubmission] = useState(false);
  const [selectedWinner, setSelectedWinner] = useState<any>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [joinedCompetitionIds, setJoinedCompetitionIds] = useState<string[]>([]);

  // Form state
  const [githubRepo, setGithubRepo] = useState('');
  const [liveLink, setLiveLink] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch single competition directly
        const singleCompRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/competitions/${id}`);
        const data = await singleCompRes.json();
        setCompetition(data);
        
        // Fetch user's joined competitions if logged in
        const token = localStorage.getItem('token');
        if (token) {
          const joinedRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/competitions/my/joined`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (joinedRes.ok) {
            const joinedIds = await joinedRes.json();
            setJoinedCompetitionIds(joinedIds || []);
          }
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to load competition');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const padNumber = (num: number) => String(num).padStart(3, '0');
  
  const formatPrize = (value: string | undefined) => {
    if (!value || value === '-' || value.toLowerCase() === 'to be announced') return value;
    // If it already starts with ₹, return as is
    if (value.startsWith('₹')) return value;
    // If it's a number or starts with numbers, add ₹
    if (/^\d/.test(value)) return `₹${value}`;
    return value;
  };
  
  // Just use stored competition number from backend!
  const competitionNumber = competition?.competitionNumber || 0;

  const isWiecodes = competition?.type === 'WIECODES_WEEKEND';

  // Function to format date
  const formatEndDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    if (!competition) return;

    const timer = setInterval(() => {
      const now = Date.now();
      const start = new Date(competition.start_date).getTime();
      const end = new Date(competition.end_date).getTime();

      if (now < start) {
        const diff = start - now;
        setCountdownLabel('STARTING IN');
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setCountdown(`${days}D ${hours}H ${minutes}M`);
      } else if (now >= start && now <= end) {
        const diff = end - now;
        setCountdownLabel('TIME REMAINING');
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setCountdown(`${days}D ${hours}H ${minutes}M`);
      } else {
        setCountdown(formatEndDate(competition.end_date));
        setCountdownLabel('ENDED ON');
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [competition]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !competition) return;

    try {
      setSubmitting(true);
      // TODO: Add actual submission logic
      toast.success('Successfully submitted your entry!');
      setShowSubmission(false);
      setGithubRepo('');
      setLiveLink('');
      setNotes('');
    } catch (err: any) {
      toast.error('Failed to submit entry');
    } finally {
      setSubmitting(false);
    }
  };

  const isActive = competition &&
    new Date(competition.start_date).getTime() <= Date.now() &&
    new Date(competition.end_date).getTime() > Date.now();

  const isEnded = competition && new Date(competition.end_date).getTime() < Date.now();

  const scoringCategories = [
    { name: 'CHALLENGE COMPLETION', stars: 10, description: 'How completely the challenge requirements were fulfilled.' },
    { name: 'FUNCTIONALITY', stars: 10, description: 'How well the project works without issues.' },
    { name: 'TECHNICAL DIFFICULTY', stars: 10, description: 'The complexity and technical sophistication of the implementation.' },
    { name: 'UI DESIGN', stars: 5, description: 'The visual quality and consistency of the interface.' },
    { name: 'USER EXPERIENCE (UX)', stars: 5, description: 'How easy and intuitive the project is to use.' },
    { name: 'CREATIVITY', stars: 5, description: 'The originality and uniqueness of the solution.' },
    { name: 'CODE QUALITY', stars: 5, description: 'The cleanliness, organization, and maintainability of the code.' },
    { name: 'FEATURES', stars: 5, description: 'How polished and feature-complete the project is.' },
    { name: 'INNOVATION', stars: 5, description: 'The level of novel or standout ideas beyond the requirements.' },
  ];

  const totalStars = scoringCategories.reduce((sum, c) => sum + c.stars, 0);

  const prizeTiers = [
    { tier: 'DIAMOND', prize: '₹1000', starRange: '56 - 60' },
    { tier: 'GOLD', prize: '₹500', starRange: '51 - 55' },
    { tier: 'SILVER', prize: '₹250', starRange: '46 - 50' },
    { tier: 'BRONZE', prize: '₹150', starRange: '40 - 45' },
    { tier: 'MERIT', prize: '₹100', starRange: '35 - 39' },
    { tier: 'PARTICIPATION', prize: 'CERTIFICATE', starRange: 'Below 35' },
  ];



  if (isInitialLoad) {
    return (
      <LoadingScreen
        onLoadingComplete={markInitialLoadComplete}
      />
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black p-8 max-w-6xl mx-auto">
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-6 w-32" />
            </div>
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!competition) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Card className="bg-black border-cyan-500/30">
          <CardContent className="p-8 text-center">
            <p className="text-gray-500 text-xs uppercase tracking-[0.2em] mb-6">NOT FOUND</p>
            <Link to="/weekends">
              <Button variant="outline" className="border-cyan-500/30 text-gray-300 hover:bg-cyan-500/10 hover:text-white">
                <ChevronLeft className="w-5 h-5 mr-2" />
                BACK TO COMPETITIONS
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const challengeTitle = competition.name.toUpperCase();

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-15">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(#0066ff 1px, transparent 1px), linear-gradient(90deg, #0066ff 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            animation: 'gridMove 20s linear infinite'
          }}
        />
      </div>

      {/* Hexagonal pattern background */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <pattern id="challengeHexagons" width="10" height="17.32" patternUnits="userSpaceOnUse">
            <polygon points="5,0 10,2.89 10,8.66 5,11.55 0,8.66 0,2.89" fill="none" stroke="#8b5cf6" strokeWidth="0.1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#challengeHexagons)" />
        </svg>
      </div>

      {/* Vertical divisions */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/4 top-0 bottom-0 w-px bg-black/80 backdrop-blur-sm" />
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-black/80 backdrop-blur-sm" />
        <div className="absolute left-3/4 top-0 bottom-0 w-px bg-black/80 backdrop-blur-sm" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20">
        {/* Back Button */}
        <Link
        to="/weekends"
        className="inline-flex items-center gap-2 group mb-8"
      >
          <ChevronLeft className="w-6 h-6 text-gray-300 group-hover:text-white transition-colors" />
          <span className="industrial-label text-gray-300 group-hover:text-white transition-colors">BACK</span>
        </Link>
        {/* SECTION [01] CHALLENGE */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-24"
        >
          <div className="flex items-end justify-between mb-4">
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-[0.3em] mb-1">[01]</p>
              <p className="text-gray-500 text-xs uppercase tracking-[0.2em]">
                {isWiecodes ? 'WIECODES WEEKEND' : 'SPECIAL EVENT'}
              </p>
            </div>
            <p className="text-9xl sm:text-[10rem] font-light text-gray-500">
              {padNumber(competitionNumber)}
            </p>
          </div>

          {/* HERO TITLE */}
          <div className="mb-6">
            <h1 className="text-7xl sm:text-9xl lg:text-[12rem] font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 leading-[0.9]">
              {challengeTitle}
            </h1>
          </div>

          {/* QUICK LINKS */}
          <div className="flex items-center justify-between mb-6 mt-24">
            <div className="flex items-center gap-8">
              <button
                onClick={() => setShowInfo(true)}
                className="text-gray-500 text-sm uppercase tracking-[0.2em] hover:text-white transition-colors"
              >
                INFO
              </button>
              {isWiecodes ? (
                <>
                  <a
                    href="#scoring"
                    className="text-gray-500 text-sm uppercase tracking-[0.2em] hover:text-white transition-colors"
                  >
                    SCORING
                  </a>
                  <a
                    href="#rewards"
                    className="text-gray-500 text-sm uppercase tracking-[0.2em] hover:text-white transition-colors"
                  >
                    REWARDS
                  </a>
                </>
              ) : (
                competition.prize_description && (
                  <a
                    href="#prizes"
                    className="text-gray-500 text-sm uppercase tracking-[0.2em] hover:text-white transition-colors"
                  >
                    PRIZES
                  </a>
                )
              )}
              {isActive && competition && joinedCompetitionIds.includes(competition._id) && (
                <a
                  href="#submit-section"
                  className="text-green-400 text-sm uppercase tracking-[0.2em] hover:text-green-300 transition-colors"
                >
                  SUBMIT CODE
                </a>
              )}
            </div>
            <div className="flex items-center gap-4">
              {/* Only show ENTERED / NOT ENTERED if it's not ENDED OR if it's ENDED and we have joined status */}
              <p className={`text-sm uppercase tracking-[0.2em] font-bold ${competition && joinedCompetitionIds.includes(competition._id) ? 'text-green-400' : 'text-red-400'}`}>
                {competition && joinedCompetitionIds.includes(competition._id) ? 'ENTERED' : 'NOT ENTERED'}
              </p>
              <p className={`text-sm uppercase tracking-[0.2em] font-bold ${isActive ? 'text-green-400' : isEnded ? 'text-gray-500' : 'text-yellow-400'}`}>
                {isActive ? 'LIVE' : isEnded ? 'ENDED' : 'UPCOMING'}
              </p>
            </div>
          </div>

          {/* CHALLENGE INFORMATION STRIP */}
          <div className="grid grid-cols-1 sm:grid-cols-3 border-t border-b border-blue-500/30 mt-6">
            <div className="p-8 sm:p-12 border-b sm:border-b-0 sm:border-r border-blue-500/30 text-center">
              <p className="text-gray-500 text-xs uppercase tracking-[0.3em] mb-4">{countdownLabel}</p>
              <p className="text-4xl sm:text-5xl font-bold text-white">
                {countdown}
              </p>
            </div>
            <div className="p-8 sm:p-12 border-b sm:border-b-0 sm:border-r border-blue-500/30 text-center">
              <p className="text-gray-500 text-xs uppercase tracking-[0.3em] mb-4">
                {isWiecodes ? "PRIZE LIMIT" : "PRIZE POOL"}
              </p>
              <p className="text-4xl sm:text-5xl font-bold text-white">
                {formatPrize(competition.prizeLimit || '-')}
              </p>
            </div>
            <div className="p-8 sm:p-12 text-center">
              <p className="text-gray-500 text-xs uppercase tracking-[0.3em] mb-4">PARTICIPANTS</p>
              <p className="text-4xl sm:text-5xl font-bold text-white">
                {competition.participants?.length || 0}
              </p>
            </div>
          </div>
        </motion.section>

        {/* SECTION [02/02] Challenge for the weekend */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="mb-24"
        >
          <div className="mb-16">
              <p className="text-gray-500 text-xs uppercase tracking-[0.3em] mb-2">
                [{isEnded ? (isWiecodes ? '02' : '02') : '02'}]
              </p>
              <p className="text-gray-500 text-xs uppercase tracking-[0.2em]">
                {isWiecodes ? 'Challenge for the weekend' : 'CHALLENGE'}
              </p>
            </div>
          <div className="border border-purple-500/30 p-8 sm:p-12 rounded-[4px] relative">
            {/* Lock overlay for upcoming competitions */}
            {!isActive && !isEnded && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/70 backdrop-blur-md rounded-[4px]">
                <Lock className="w-16 h-16 text-gray-400 mb-4" />
                <p className="text-gray-400 text-sm uppercase tracking-[0.2em]">Challenge locked</p>
                <p className="text-white text-lg mt-2">Starts {countdown}</p>
              </div>
            )}
            
            {/* Challenge content */}
            <div className={`transition-all duration-500 ${!isActive && !isEnded ? 'blur-sm' : ''}`}>
              {competition.challenge_question && (
                <div className="text-white text-5xl sm:text-6xl leading-relaxed mb-8 font-bebas">
                  <ReactMarkdown 
                  remarkPlugins={[remarkGfm]} 
                  components={{
                    h1: (props) => <h1 className="text-9xl sm:text-[10rem] lg:text-[12rem] font-bebas font-black text-white mb-12" {...props} />,
                    h2: (props) => <h2 className="text-8xl sm:text-9xl lg:text-[10rem] font-bebas font-black text-white mb-10" {...props} />,
                    h3: (props) => <h3 className="text-7xl sm:text-8xl lg:text-9xl font-bebas font-black text-white mb-9" {...props} />,
                    h4: (props) => <h4 className="text-6xl sm:text-7xl font-bebas font-black text-white mb-8" {...props} />,
                    h5: (props) => <h5 className="text-5xl sm:text-6xl font-bebas font-black text-white mb-7" {...props} />,
                    h6: (props) => <h6 className="text-4xl sm:text-5xl font-bebas font-black text-white mb-6" {...props} />,
                    strong: (props) => <strong className="text-white font-black" {...props} />,
                    table: (props) => <div className="overflow-x-auto mb-4"><table className="w-full border-collapse" {...props} /></div>,
                    thead: (props) => <thead className="border-b border-purple-500/30" {...props} />,
                    th: (props) => <th className="text-left p-4 text-gray-400 font-semibold" {...props} />,
                    td: (props) => <td className="p-4 border-b border-purple-500/30/50 text-gray-300" {...props} />,
                    a: (props) => <a className="text-blue-400 underline hover:text-blue-300 transition-colors" target="_blank" rel="noopener noreferrer" {...props} />,
                    p: (props) => <p className="mb-4" {...props} />,
                    ul: (props) => <ul className="list-disc list-inside mb-4 space-y-2" {...props} />,
                    ol: (props) => <ol className="list-decimal list-inside mb-4 space-y-2" {...props} />,
                    li: (props) => <li className="pl-2" {...props} />,
                    blockquote: (props) => <blockquote className="border-l-4 border-purple-500/30 pl-4 py-2 my-4 italic text-gray-400" {...props} />,
                    code: (props) => <code className="bg-black/80 backdrop-blur-sm px-2 py-1 rounded text-gray-300 text-sm" {...props} />,
                    pre: (props) => <pre className="bg-black/80 backdrop-blur-sm p-4 rounded overflow-x-auto my-4" {...props} />,
                  }}
                >
                  {competition.challenge_question}
                </ReactMarkdown>
                </div>
              )}
              {competition.requirements && (
                <div className="text-gray-400 text-xl leading-relaxed font-heading">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]} 
                    components={{
                      h1: (props) => <h1 className="text-4xl sm:text-5xl font-heading font-bold text-white mb-4" {...props} />,
                      h2: (props) => <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white mb-3" {...props} />,
                      h3: (props) => <h3 className="text-2xl sm:text-3xl font-heading font-bold text-white mb-2" {...props} />,
                      h4: (props) => <h4 className="text-xl sm:text-2xl font-heading font-bold text-white mb-2" {...props} />,
                      h5: (props) => <h5 className="text-lg sm:text-xl font-heading font-bold text-white mb-2" {...props} />,
                      h6: (props) => <h6 className="text-base sm:text-lg font-heading font-bold text-white mb-2" {...props} />,
                      strong: (props) => <strong className="text-white font-bold" {...props} />,
                      table: (props) => <div className="overflow-x-auto mb-4"><table className="w-full border-collapse" {...props} /></div>,
                      thead: (props) => <thead className="border-b border-purple-500/30" {...props} />,
                      th: (props) => <th className="text-left p-4 text-gray-400 font-semibold" {...props} />,
                      td: (props) => <td className="p-4 border-b border-purple-500/30/50 text-gray-300" {...props} />,
                      a: (props) => <a className="text-blue-400 underline hover:text-blue-300 transition-colors" target="_blank" rel="noopener noreferrer" {...props} />,
                      p: (props) => <p className="mb-4" {...props} />,
                      ul: (props) => <ul className="list-disc list-inside mb-4 space-y-2" {...props} />,
                      ol: (props) => <ol className="list-decimal list-inside mb-4 space-y-2" {...props} />,
                      li: (props) => <li className="pl-2" {...props} />,
                      blockquote: (props) => <blockquote className="border-l-4 border-purple-500/30 pl-4 py-2 my-4 italic text-gray-400" {...props} />,
                      code: (props) => <code className="bg-black/80 backdrop-blur-sm px-2 py-1 rounded text-gray-300 text-sm" {...props} />,
                      pre: (props) => <pre className="bg-black/80 backdrop-blur-sm p-4 rounded overflow-x-auto my-4" {...props} />,
                    }}
                  >
                    {competition.requirements}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        </motion.section>

        {/* SECTION [03/03] PRIZES (Only SPECIAL) */}
        {!isWiecodes && competition.prize_description && (
          <motion.section 
            id="prizes" 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="mb-24"
          >
            <div className="mb-16">
              <p className="text-gray-500 text-xs uppercase tracking-[0.3em] mb-2">
                [{isEnded ? '03' : '03'}
              </p>
              <p className="text-gray-500 text-xs uppercase tracking-[0.2em]">
                PRIZES
              </p>
            </div>
            <div className="border border-yellow-500/30 p-8 sm:p-12 rounded-[4px]">
              {/* Prize pool content - never locked! */}
              <div className="text-white text-5xl sm:text-6xl leading-relaxed font-bebas">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: (props) => <h1 className="text-9xl sm:text-[10rem] lg:text-[12rem] font-bebas font-black text-white mb-12" {...props} />,
                    h2: (props) => <h2 className="text-8xl sm:text-9xl lg:text-[10rem] font-bebas font-black text-white mb-10" {...props} />,
                    h3: (props) => <h3 className="text-7xl sm:text-8xl lg:text-9xl font-bebas font-black text-white mb-9" {...props} />,
                    h4: (props) => <h4 className="text-6xl sm:text-7xl font-bebas font-black text-white mb-8" {...props} />,
                    h5: (props) => <h5 className="text-5xl sm:text-6xl font-bebas font-black text-white mb-7" {...props} />,
                    h6: (props) => <h6 className="text-4xl sm:text-5xl font-bebas font-black text-white mb-6" {...props} />,
                    strong: (props) => <strong className="text-white font-black" {...props} />,
                    table: (props) => <div className="overflow-x-auto mb-4"><table className="w-full border-collapse" {...props} /></div>,
                    thead: (props) => <thead className="border-b border-yellow-500/30" {...props} />,
                    th: (props) => <th className="text-left p-4 text-gray-400 font-semibold" {...props} />,
                    td: (props) => <td className="p-4 border-b border-yellow-500/30/50 text-gray-300" {...props} />,
                    a: (props) => <a className="text-blue-400 underline hover:text-blue-300 transition-colors" target="_blank" rel="noopener noreferrer" {...props} />,
                    p: (props) => <p className="mb-4" {...props} />,
                    ul: (props) => <ul className="list-disc list-inside mb-4 space-y-2" {...props} />,
                    ol: (props) => <ol className="list-decimal list-inside mb-4 space-y-2" {...props} />,
                    li: (props) => <li className="pl-2" {...props} />,
                    blockquote: (props) => <blockquote className="border-l-4 border-yellow-500/30 pl-4 py-2 my-4 italic text-gray-400" {...props} />,
                    code: (props) => <code className="bg-black/80 backdrop-blur-sm px-2 py-1 rounded text-gray-300 text-sm" {...props} />,
                    pre: (props) => <pre className="bg-black/80 backdrop-blur-sm p-4 rounded overflow-x-auto my-4" {...props} />,
                  }}
                >
                  {competition.prize_description}
                </ReactMarkdown>
              </div>
            </div>
          </motion.section>
        )}

        {/* SECTION [04/04] WINNERS (Only ENDED) */}
        {isEnded && (
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="mb-24">
            <div className="mb-16">
              <p className="text-gray-500 text-xs uppercase tracking-[0.3em] mb-2">
                [{isWiecodes ? '03' : '04'}]
              </p>
              <p className="text-gray-500 text-xs uppercase tracking-[0.2em]">WINNERS</p>
            </div>
            <div className="container mx-auto px-4">
              {(() => {
                // Get winners based on competition type
                let displayWinners: any[] = [];
                if (isWiecodes) {
                  // For WW: filter templates with >35 stars and sort descending
                  const qualifyingTemplates = (competition.templates || [])
                    .filter(t => (t.stars || 0) > 35)
                    .sort((a, b) => (b.stars || 0) - (a.stars || 0))
                    .map((template, index) => ({
                      _id: `${template._id}-winner`,
                      position: index + 1,
                      template: template
                    }));
                  displayWinners = qualifyingTemplates;
                } else {
                  // For SPECIAL: use competition.winners array
                  displayWinners = competition.winners || [];
                }

                if (displayWinners.length > 0) {
                  return (
                    <>
                      {/* Top 3 Podium */}
                      {displayWinners.slice(0, 3).length > 0 && (
                        <div className="mb-16">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                            {/* Second Place */}
                            {displayWinners[1] && (
                              <Card 
                                className="bg-black/50 border border-purple-500/30 backdrop-blur-sm cursor-pointer hover:border-purple-400/50 transition-colors"
                                onClick={() => setSelectedWinner(displayWinners[1])}
                              >
                                <CardContent className="p-8 flex flex-col items-center">
                                  <div className="text-4xl font-bold text-purple-400/40 mb-4 font-mono">
                                    {String(displayWinners[1].position).padStart(2, '0')}
                                  </div>
                                  <div className="w-20 h-20 rounded-full bg-black border border-purple-500/30 flex items-center justify-center text-2xl font-bold text-purple-400 mb-4">
                                    {displayWinners[1].template.uploadedBy?.username?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || 'AN'}
                                  </div>
                                  <h3 className="text-base font-semibold text-white mb-2">
                                    {displayWinners[1].template.title}
                                  </h3>
                                  <p className="text-sm text-purple-400 mb-4 font-mono flex items-center gap-2">
                                    <Star className="w-4 h-4 fill-current" />
                                    {isWiecodes ? (displayWinners[1].template.stars || 0) : displayWinners[1].position}
                                  </p>
                                </CardContent>
                              </Card>
                            )}

                            {/* First Place */}
                            {displayWinners[0] && (
                              <Card 
                                className="bg-black/50 border border-purple-400/50 backdrop-blur-sm md:-mt-8 md:mb-8 cursor-pointer hover:border-purple-400 transition-colors"
                                onClick={() => setSelectedWinner(displayWinners[0])}
                              >
                                <CardContent className="p-10 flex flex-col items-center">
                                  <div className="text-5xl font-bold text-purple-400/60 mb-4 font-mono">
                                    {String(displayWinners[0].position).padStart(2, '0')}
                                  </div>
                                  <div className="w-24 h-24 rounded-full bg-black border border-purple-400/60 flex items-center justify-center text-3xl font-bold text-purple-300 mb-4">
                                    {displayWinners[0].template.uploadedBy?.username?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || 'AN'}
                                  </div>
                                  <h3 className="text-lg font-semibold text-white mb-2">
                                    {displayWinners[0].template.title}
                                  </h3>
                                  <p className="text-lg text-purple-300 mb-4 font-mono flex items-center gap-2">
                                    <Star className="w-5 h-5 fill-current" />
                                    {isWiecodes ? (displayWinners[0].template.stars || 0) : displayWinners[0].position}
                                  </p>
                                </CardContent>
                              </Card>
                            )}

                            {/* Third Place */}
                            {displayWinners[2] && (
                              <Card 
                                className="bg-black/50 border border-purple-500/30 backdrop-blur-sm cursor-pointer hover:border-purple-400/50 transition-colors"
                                onClick={() => setSelectedWinner(displayWinners[2])}
                              >
                                <CardContent className="p-8 flex flex-col items-center">
                                  <div className="text-4xl font-bold text-purple-400/40 mb-4 font-mono">
                                    {String(displayWinners[2].position).padStart(2, '0')}
                                  </div>
                                  <div className="w-20 h-20 rounded-full bg-black border border-purple-500/30 flex items-center justify-center text-2xl font-bold text-purple-400 mb-4">
                                    {displayWinners[2].template.uploadedBy?.username?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || 'AN'}
                                  </div>
                                  <h3 className="text-base font-semibold text-white mb-2">
                                    {displayWinners[2].template.title}
                                  </h3>
                                  <p className="text-sm text-purple-400 mb-4 font-mono flex items-center gap-2">
                                    <Star className="w-4 h-4 fill-current" />
                                    {isWiecodes ? (displayWinners[2].template.stars || 0) : displayWinners[2].position}
                                  </p>
                                </CardContent>
                              </Card>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Remaining Winners List */}
                      {displayWinners.slice(3).length > 0 && (
                        <div className="max-w-3xl mx-auto space-y-4">
                          {displayWinners.slice(3).map((winner) => (
                            <Card 
                              key={winner._id} 
                              className="bg-black/50 border border-purple-500/30 backdrop-blur-sm cursor-pointer hover:border-purple-400/50 transition-colors"
                              onClick={() => setSelectedWinner(winner)}
                            >
                              <CardContent className="p-6 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <span className="text-lg font-mono text-purple-400/40 w-8">
                                    {String(winner.position).padStart(2, '0')}
                                  </span>
                                  <div className="w-10 h-10 rounded-full bg-black border border-purple-500/30 flex items-center justify-center text-sm font-bold text-purple-400">
                                    {winner.template.uploadedBy?.username?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || 'AN'}
                                  </div>
                                  <div className="text-sm text-white">
                                    {winner.template.title}
                                  </div>
                                </div>
                                <p className="text-sm text-purple-400 font-mono flex items-center gap-2">
                                  <Star className="w-4 h-4 fill-current" />
                                  {isWiecodes ? (winner.template.stars || 0) : winner.position}
                                </p>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </>
                  );
                } else {
                  return (
                    <div className="p-12 text-center">
                      <p className="text-gray-500 text-lg uppercase tracking-[0.2em]">
                        {isWiecodes ? 'No winners yet (need >35 stars)' : 'No winners announced yet'}
                      </p>
                    </div>
                  );
                }
              })()}
            </div>
          </motion.section>
        )}



        {/* SCORING & REWARDS SECTIONS (Only WIECODES WEEKEND) */}
      {isWiecodes && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.25 }}
          className="flex flex-col lg:flex-row gap-12 mb-24 items-stretch">
          {/* SCORING */}
          <section id="scoring" className="flex-1 scroll-mt-8">
            <div className="mb-16">
              <p className="text-gray-500 text-xs uppercase tracking-[0.3em] mb-2">
                [{isEnded ? '04' : '03'}]
              </p>
              <p className="text-gray-500 text-xs uppercase tracking-[0.2em]">SCORING</p>
            </div>

            <div className="mb-12">
              <p className="text-7xl sm:text-9xl font-bold text-white mb-2">
                {totalStars}★
              </p>
              <p className="text-gray-500 text-lg uppercase tracking-[0.2em]">
                Challenge Completion
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {scoringCategories.map((category, index) => (
                <div key={index} className="group relative flex justify-between items-center py-4 border-b border-cyan-500/30 last:border-b-0">
                  <p className="text-gray-500 text-xs uppercase tracking-[0.2em]">
                    {category.name}
                  </p>
                  <p className="text-3xl sm:text-4xl font-bold text-white">
                    {category.stars}★
                  </p>
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 left-0 right-0 bg-black/80 backdrop-blur-sm border border-cyan-500/30 p-4 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                    <p className="text-gray-300 text-sm">
                      {category.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* REWARDS */}
          <section id="rewards" className="flex-1 scroll-mt-8">
            <div className="mb-16">
              <p className="text-gray-500 text-xs uppercase tracking-[0.3em] mb-2">
                [{isEnded ? '05' : '04'}]
              </p>
              <p className="text-gray-500 text-xs uppercase tracking-[0.2em]">REWARDS</p>
            </div>

            <div className="mb-8">
              <p className="text-gray-400 text-sm leading-relaxed">
                Total prize limit for this competition: <span className="text-white font-semibold">{formatPrize(competition.prizeLimit || 'To be announced')}</span>. Prizes are distributed according to star tiers, up to the limit.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 ">
              {prizeTiers.map((tier, index) => (
                <div
                  key={index}
                  className="border border-purple-500/30 p-5 sm:p-6 hover:border-purple-400/50 transition-colors duration-300 "
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Star className="w-8 h-8 text-white fill-white" />
                    <p className="text-xl sm:text-2xl font-bold text-gray-400">{tier.starRange}</p>
                  </div>
                  <div className="flex items-center justify-between pb-2">
                    <p className="text-3xl sm:text-4xl font-bold text-white">
                      {tier.tier}
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-400">
                      {tier.prize}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </motion.div>
      )}

        {/* SECTION [06/03] SUBMISSIONS (Only LIVE & ENDED) */}
        {(isActive || isEnded) && (
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="mb-24">
            <div className="mb-16">
              <p className="text-gray-500 text-xs uppercase tracking-[0.3em] mb-2">
                [{isEnded ? (isWiecodes ? '06' : '05') : (isWiecodes ? '05' : '04')}]
              </p>
              <p className="text-gray-500 text-xs uppercase tracking-[0.2em]">SUBMISSIONS</p>
            </div>
            <div className="border border-blue-500/30 rounded-[4px]">
              {competition.templates && competition.templates.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0">
                  {competition.templates.map((template) => (
                    <div key={template._id} className="border-b border-r border-blue-500/30 p-6 sm:p-8 relative">
                      {template.liveLink && (
                        <a
                          href={template.liveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                        >
                          <ExternalLink className="w-6 h-6" />
                        </a>
                      )}
                      <div>
                        <p className="text-xl sm:text-2xl font-bold text-white mb-2">
                          {template.title}
                        </p>
                        <p className="text-gray-400 text-sm">
                          by {template.uploadedBy?.username || template.uploadedBy?.email || 'Unknown'}
                        </p>
                        {isWiecodes && (
                          <p className="text-yellow-400 text-lg mt-2 font-bold">
                            {template.stars || 0}★
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <p className="text-gray-500 text-lg uppercase tracking-[0.2em]">
                    No submissions yet
                  </p>
                </div>
              )}
            </div>
          </motion.section>
        )}

        {/* FINAL CTA SECTION (Only if not ended) */}
        {!isEnded && (
          <motion.section 
            id="submit-section"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.35 }}
            className="py-24 mt-14 text-center">
            <h2 className="text-5xl sm:text-7xl lg:text-8xl font-bold text-white mb-12">
              READY TO COMPETE?
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/weekends" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="w-full sm:w-72 py-6 text-base uppercase tracking-[0.2em] border-purple-500/30 text-white hover:bg-purple-500/10 hover:border-purple-400/50"
                >
                  BACK TO WEEKENDS
                </Button>
              </Link>
              {isActive && competition && joinedCompetitionIds.includes(competition._id) && (
                <Button
                  onClick={() => setShowSubmission(true)}
                  className="w-full sm:w-72 py-6 text-base uppercase tracking-[0.2em] bg-green-400 text-black hover:bg-green-300"
                >
                  SUBMIT CODE
                </Button>
              )}
            </div>
          </motion.section>
        )}
      </main>

      {/* SUBMISSION MODAL */}
      <Dialog open={showSubmission} onOpenChange={setShowSubmission}>
        <DialogContent className="sm:max-w-lg bg-black border-blue-500/30 text-white">
          <DialogHeader>
            <DialogTitle className="font-heading text-white text-2xl sm:text-3xl uppercase tracking-[0.1em]">
              SUBMIT PROJECT
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6 pt-6">
            <div className="space-y-3">
              <label className="text-sm text-gray-500 uppercase tracking-[0.2em]">
                GITHUB REPOSITORY
              </label>
              <input
                type="url"
                value={githubRepo}
                onChange={(e) => setGithubRepo(e.target.value)}
                className="w-full px-4 py-3 border border-blue-500/30 bg-black text-white focus:outline-none focus:ring-1 focus:ring-blue-400/50"
                placeholder="https://github.com/yourusername/yourrepo"
                required
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm text-gray-500 uppercase tracking-[0.2em]">
                LIVE LINK (OPTIONAL)
              </label>
              <input
                type="url"
                value={liveLink}
                onChange={(e) => setLiveLink(e.target.value)}
                className="w-full px-4 py-3 border border-blue-500/30 bg-black text-white focus:outline-none focus:ring-1 focus:ring-blue-400/50"
                placeholder="https://your-project.com"
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm text-gray-500 uppercase tracking-[0.2em]">
                NOTES (OPTIONAL)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-3 border border-blue-500/30 bg-black text-white focus:outline-none focus:ring-1 focus:ring-blue-400/50"
                placeholder="Additional information about your submission..."
                rows={4}
              />
            </div>
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowSubmission(false)}
                className="flex-1 border-blue-500/30 text-white hover:bg-blue-500/10"
              >
                CANCEL
              </Button>
              <Button type="submit" className="flex-1 bg-white text-black hover:bg-gray-200" disabled={submitting}>
                {submitting ? 'SUBMITTING...' : 'SUBMIT'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* WINNER DETAILS MODAL */}
      <Dialog open={!!selectedWinner} onOpenChange={() => setSelectedWinner(null)}>
        <DialogContent className="sm:max-w-lg bg-black border-purple-500/30 text-white">
          <DialogHeader>
            <DialogTitle className="font-heading text-white text-2xl sm:text-3xl uppercase tracking-[0.1em]">
              #{selectedWinner?.position} - {selectedWinner?.template.title}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-6">
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-[0.2em] mb-1">AUTHOR</p>
              <p className="text-lg font-semibold text-white">
                {selectedWinner?.template.uploadedBy?.username || selectedWinner?.template.uploadedBy?.email || 'Unknown'}
              </p>
            </div>
            {selectedWinner?.template.description && (
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-[0.2em] mb-1">DESCRIPTION</p>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {selectedWinner.template.description}
                </p>
              </div>
            )}
            {selectedWinner?.template.liveLink && (
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-[0.2em] mb-1">LIVE DEMO</p>
                <a 
                  href={selectedWinner.template.liveLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-green-400 hover:text-green-300 transition-colors flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  {selectedWinner.template.liveLink}
                </a>
              </div>
            )}
          </div>
          <div className="pt-4">
            <Button 
              onClick={() => setSelectedWinner(null)} 
              variant="outline"
              className="w-full border-yellow-500/30 text-white hover:bg-yellow-500/10"
            >
              CLOSE
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* INFO MODAL */}
      <Dialog open={showInfo} onOpenChange={setShowInfo}>
        <DialogContent className="bg-[#0a0a0a] border-cyan-500/30 text-white max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white font-bebas">
              {competition?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-6 text-gray-300 overflow-y-auto max-h-[50vh]">
            {isWiecodes ? (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">HOW IT WORKS</h3>
                <p>
                  WIECODES WEEKEND is a weekly coding competition where participants build templates to solve the challenge question.
                </p>
                
                <h3 className="text-xl font-bold text-white">SCORING</h3>
                <p>
                  Projects are scored out of 60 stars based on:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Challenge Completion (10 stars)</li>
                    <li>Functionality (10 stars)</li>
                    <li>Technical Difficulty (10 stars)</li>
                    <li>UI Design (5 stars)</li>
                    <li>User Experience (5 stars)</li>
                    <li>Creativity (5 stars)</li>
                    <li>Code Quality (5 stars)</li>
                    <li>Innovation (5 stars)</li>
                  </ul>
                </p>
                
                <h3 className="text-xl font-bold text-white">REWARDS</h3>
                <p>
                  The top projects with 35 stars or more are eligible for prizes:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>56-60 stars: ₹1000</li>
                    <li>51-55 stars: ₹500</li>
                    <li>46-50 stars: ₹250</li>
                    <li>40-45 stars: ₹150</li>
                    <li>35-39 stars: ₹100</li>
                    <li>Below 35 stars: Participation Certificate</li>
                  </ul>
                </p>
                {competition?.prizeLimit && (
                  <p className="text-yellow-400">
                    Prize Limit: ₹{competition.prizeLimit} - Prizes will be awarded up to this limit.
                  </p>
                )}
              </div>
            ) : (
              <div>
                {competition?.info ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: (props) => <h1 className="text-3xl font-bold text-white mb-4 font-bebas" {...props} />,
                      h2: (props) => <h2 className="text-2xl font-bold text-white mb-3 font-bebas" {...props} />,
                      h3: (props) => <h3 className="text-xl font-bold text-white mb-2 font-heading" {...props} />,
                      p: (props) => <p className="mb-3" {...props} />,
                      ul: (props) => <ul className="list-disc list-inside mb-3 space-y-1" {...props} />,
                      ol: (props) => <ol className="list-decimal list-inside mb-3 space-y-1" {...props} />,
                      a: (props) => <a className="text-blue-400 underline hover:text-blue-300 transition-colors" target="_blank" rel="noopener noreferrer" {...props} />,
                    }}
                  >
                    {competition.info}
                  </ReactMarkdown>
                ) : (
                  <p className="text-gray-500">No additional information available for this competition.</p>
                )}
              </div>
            )}
          </div>
          <div className="pt-4">
            <Button 
              onClick={() => setShowInfo(false)} 
              variant="outline"
              className="w-full border-cyan-500/30 text-white hover:bg-cyan-500/10"
            >
              CLOSE
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <style>{`
        @keyframes gridMove {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(60px, 60px);
          }
        }
      `}</style>
    </div>
  );
}
