import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trophy, ChevronLeft, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useInitialLoad } from '@/contexts/InitialLoadContext';
import LoadingScreen from '@/components/LoadingScreen';

interface Competition {
  _id: string;
  name: string;
  description: string;
  prize?: string;
  rules?: string;
  start_date: string;
  end_date: string;
  visibility_type: 'public' | 'custom';
  join_code?: string;
  participants?: any[];
  templates?: any[];
  published?: boolean;
  winners?: any[];
  type: 'WIECODES_WEEKEND' | 'SPECIAL';
  challenge_question?: string;
  requirements?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  competitionNumber?: number;
  wiecodesWeekendNumber?: number;
}

const AnimatedCounter = ({ value, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
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
  }, [isVisible, value, duration]);

  return (
    <span ref={ref} className="inline-block">
      {typeof count === 'number' && !isNaN(count)
        ? count.toLocaleString('en-IN')
        : '--'}
    </span>
  );
};

const WeekendsHubPage = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { isInitialLoad, markInitialLoadComplete } = useInitialLoad();
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [joinedCompetitionIds, setJoinedCompetitionIds] = useState<string[]>([]);
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [currentCompetitionForJoin, setCurrentCompetitionForJoin] = useState<Competition | null>(null);
  const [joinCodeInput, setJoinCodeInput] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');

        // Fetch competitions
        const compRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/competitions`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token ? `Bearer ${token}` : '',
          },
        });

        const competitionsData = await compRes.json();
        setCompetitions(Array.isArray(competitionsData) ? competitionsData : []);

        // Fetch user's joined competitions if logged in
        if (token) {
          const joinedRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/competitions/my/joined`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });

          if (joinedRes.ok) {
            const joinedIds = await joinedRes.json();
            setJoinedCompetitionIds(joinedIds || []);
          }
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to load competitions');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Sort live/upcoming for display, and completed for archive
  const liveAndUpcomingCompetitions = [...competitions.filter(
    (comp) => new Date(comp.end_date).getTime() > Date.now()
  )].sort((a, b) => {
    const now = Date.now();
    const aStart = new Date(a.start_date).getTime();
    const bStart = new Date(b.start_date).getTime();
    const aEnd = new Date(a.end_date).getTime();
    const bEnd = new Date(b.end_date).getTime();
    
    // First, separate live vs upcoming
    const aIsLive = aStart <= now && aEnd > now;
    const bIsLive = bStart <= now && bEnd > now;
    
    if (aIsLive && !bIsLive) return -1; // Live comes first
    if (!aIsLive && bIsLive) return 1;
    
    // For both live: sort by end date (earlier ending first)
    if (aIsLive && bIsLive) {
      return aEnd - bEnd;
    }
    
    // Both upcoming: sort by start date (earlier starting first)
    return aStart - bStart;
  });

  const completedCompetitions = competitions.filter(
    c => new Date(c.end_date).getTime() < Date.now()
  ).sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime());

  // Just use competition as-is from backend, no frontend numbering!

  const getCountdownData = (competition: Competition) => {
    const now = Date.now();
    const start = new Date(competition.start_date).getTime();
    const end = new Date(competition.end_date).getTime();
    
    if (now < start) {
      const diff = start - now;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return { label: 'STARTING IN', time: `${days}D ${hours}H ${minutes}M` };
    } else if (now >= start && now <= end) {
      const diff = end - now;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return { label: 'TIME REMAINING', time: `${days}D ${hours}H ${minutes}M` };
    }
    return { label: 'ENDED', time: '0D 0H 0M' };
  };

  // Check competition status
  const getCompetitionStatus = (competition: Competition) => {
    const now = Date.now();
    const start = new Date(competition.start_date).getTime();
    const end = new Date(competition.end_date).getTime();

    if (now < start) return 'upcoming';
    if (now >= start && now <= end) return 'live';
    return 'ended';
  };

  // Check if user has joined
  const hasUserJoined = (competitionId: string) => {
    return joinedCompetitionIds.includes(competitionId);
  };

  // Join competition
  const handleJoinCompetition = async (competition: Competition) => {
    if (!token) {
      toast.error('Please login to join the competition');
      navigate('/signin');
      return;
    }

    // Check if user already joined first
    if (hasUserJoined(competition._id)) {
      toast.info('Already entered');
      return;
    }

    // For special competitions, show code input dialog
    if (competition.type === 'SPECIAL') {
      setCurrentCompetitionForJoin(competition);
      setJoinCodeInput('');
      setShowJoinDialog(true);
      return;
    }

    // For WIECODES WEEKEND, join directly
    await doJoinCompetition(competition);
  };

  // Do actual join with optional code
  const doJoinCompetition = async (competition: Competition, code?: string) => {
    setJoining(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/competitions/${competition._id}/join`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: code ? JSON.stringify({ join_code: code }) : undefined,
        }
      );

      const data = await response.json();

      if (response.ok) {
        setJoinedCompetitionIds([...joinedCompetitionIds, competition._id]);
        toast.success('Successfully joined the competition!');

        // Refresh competitions to update participant count
        const compRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/competitions`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token ? `Bearer ${token}` : '',
          },
        });
        const competitionsData = await compRes.json();
        setCompetitions(Array.isArray(competitionsData) ? competitionsData : []);
      } else {
        toast.error(data.message || 'Failed to join competition');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to join competition');
    } finally {
      setJoining(false);
    }
  };

  const padNumber = (num: number) => String(num).padStart(3, '0');

  // Collect all winners for hall of fame (only ended & published competitions)
  const allWinnersFlat = competitions.flatMap(comp =>
    (new Date(comp.end_date).getTime() < Date.now() && comp.published && comp.winners?.length)
      ? comp.winners.map((winner, _idx) => ({
        competitionNumber: comp.competitionNumber || 0,
        competitionName: comp.name,
        winner: winner,
        submission: winner.template,
        type: comp.type,
      }))
      : []
  );

  // Aggregate winners by user to calculate total stars
  const userWinnersMap = allWinnersFlat.reduce((acc, curr) => {
    const userId = curr.winner.template?.uploadedBy?._id || curr.winner.template?.uploadedBy;
    if (!userId) return acc;

    // Assign stars based on position: 1st=5, 2nd=3, 3rd=2, others=1
    let stars = 1;
    if (curr.winner.position === 1) stars = 5;
    else if (curr.winner.position === 2) stars = 3;
    else if (curr.winner.position === 3) stars = 2;

    if (!acc[userId]) {
      acc[userId] = {
        user: curr.winner.template?.uploadedBy,
        totalStars: 0,
        wins: [],
      };
    }

    acc[userId].totalStars += stars;
    acc[userId].wins.push(curr);
    return acc;
  }, {});

  // Convert map to array and sort by stars descending
  const allWinners = Object.values(userWinnersMap).sort((a, b) => b.totalStars - a.totalStars);

  // Calculate stats
  const totalCompetitionsHosted = competitions.length;
  const totalParticipants = competitions.reduce((sum, comp) => sum + (comp.participants?.length || 0), 0);
  const totalProjectsSubmitted = competitions.reduce((sum, comp) => sum + (comp.templates?.length || 0), 0);
  const totalWinnersRewarded = allWinners.length;
  // For total amount paid, we can use prize tiers as a reference, or just a placeholder for now
  const totalAmountPaid = "₹50,000";
  const totalStarsAwarded = "1,000★";

  if (isInitialLoad) {
    return (
      <LoadingScreen
        onLoadingComplete={markInitialLoadComplete}
      />
    );
  }

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
          <pattern id="hubHexagons" width="10" height="17.32" patternUnits="userSpaceOnUse">
            <polygon points="5,0 10,2.89 10,8.66 5,11.55 0,8.66 0,2.89" fill="none" stroke="#8b5cf6" strokeWidth="0.1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#hubHexagons)" />
        </svg>
      </div>

      <main className="relative z-10 max-w-6xl mx-auto px-4 pt-12 pb-20">
        {/* BACK TO HOME BUTTON */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 group mb-12"
        >
          <ChevronLeft className="w-6 h-6 text-foreground-muted group-hover:text-foreground transition-colors" />
          <span className="industrial-label text-foreground-muted group-hover:text-foreground transition-colors">BACK TO HOME</span>
        </Link>
        {/* HERO SECTION */}
        <section className="mb-32">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <div className="text-center mb-20">
              <p className="industrial-label text-foreground-muted tracking-[0.4em] mb-6">
                [01] Live & Upcoming
              </p>

              <h1 className="font-bebas font-normal uppercase tracking-[-0.04em] leading-[0.9] text-[4.5rem] sm:text-[5.5rem] md:text-[7rem] lg:text-[9rem] xl:text-[10.5rem] text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 text-center">
                WIECODES WEEKEND
              </h1>

              <p className="industrial-label text-metallic-200 tracking-[0.8em] mt-8 text-sm sm:text-base">
                BUILD • COMPETE • WIN
              </p>
            </div>
          </motion.div>

          {/* LIVE & UPCOMING COMPETITIONS GRID */}
          {liveAndUpcomingCompetitions.length > 0 && (
            <div className="flex flex-col gap-6">
              {liveAndUpcomingCompetitions.map((competition, index) => {
                const status = getCompetitionStatus(competition);
                const isJoined = hasUserJoined(competition._id);
                const countdownData = getCountdownData(competition);
                
                return (
                  <motion.div
                    key={competition._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
                  >
                    <Card className="bg-black/50 border border-purple-500/30 backdrop-blur-sm overflow-hidden">
                      <CardContent className="p-8 sm:p-12">
                        <div className="flex flex-col gap-6">
                          {/* TOP ROW: COMPETITION NUMBER & NAME */}
        <div className="flex items-start justify-between border-b border-border pb-8">
          <div>
            <p className="industrial-label text-foreground-muted mb-3">
              {competition.type === 'WIECODES_WEEKEND' ? 'WIECODES WEEKEND' : 'SPECIAL EVENT'}
            </p>
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-heading font-bold leading-none">
              {competition.name.toUpperCase()}
            </h2>
          </div>
          <Badge variant="outline" className="px-6 py-3 rounded-[4px] text-2xl sm:text-3xl font-heading font-bold w-fit">
            #{padNumber(competition.competitionNumber || 0)}
          </Badge>
        </div>

                          {/* MIDDLE ROW: STATS */}
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                            <div className="border border-border p-4 rounded-[4px]">
                              <p className="industrial-label text-foreground-muted text-xs mb-2">{countdownData.label}</p>
                              <p className="text-3xl sm:text-4xl font-heading font-bold text-metallic-200">
                                {countdownData.time}
                              </p>
                            </div>
                            <div className="border border-border p-4 rounded-[4px]">
                              <p className="industrial-label text-foreground-muted text-xs mb-2">PARTICIPANTS</p>
                              <p className="text-3xl sm:text-4xl font-heading font-bold text-foreground">
                                {competition.participants?.length || 0}
                              </p>
                            </div>
                            <div className="border border-border p-4 rounded-[4px]">
                              <p className="industrial-label text-foreground-muted text-xs mb-2">STATUS</p>
                              <p className={`text-2xl sm:text-3xl font-heading font-bold ${status === 'live' ? 'text-green-500' : 'text-yellow-500'}`}>
                                {status.toUpperCase()}
                              </p>
                            </div>
                          </div>

                          {/* BOTTOM ROW: CTAs */}
                          <div className="flex flex-col sm:flex-row gap-4">
                            <Link to={`/weekends/${competition._id}`} className="flex-1">
                              <Button className="w-full text-xl py-6">
                                VIEW DETAILS
                              </Button>
                            </Link>
                            {(() => {
                              if (status === 'upcoming') {
                                return (
                                  <Button
                                    variant="outline"
                                    className="w-full text-xl py-6 flex-1"
                                    disabled={joining}
                                    onClick={() => handleJoinCompetition(competition)}
                                  >
                                    {isJoined ? 'ENTERED' : (joining ? 'JOINING...' : 'ENTER')}
                                  </Button>
                                );
                              } else if (status === 'live') {
                                return (
                                  isJoined ? (
                                    <Link to="/seller/upload" className="flex-1">
                                      <Button variant="outline" className="w-full text-xl py-6">
                                        SUBMIT PROJECT
                                      </Button>
                                    </Link>
                                  ) : (
                                    <Button
                                      variant="outline"
                                      className="w-full text-xl py-6 flex-1"
                                      disabled={true}
                                    >
                                      ENTRY CLOSED
                                    </Button>
                                  )
                                );
                              } else {
                                  return null;
                                }
                            })()}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
          {liveAndUpcomingCompetitions.length === 0 && (
            <div className="text-center p-8 sm:p-12 border border-border rounded-[4px]">
              <p className="industrial-label text-foreground-muted">NO LIVE OR UPCOMING COMPETITIONS</p>
            </div>
          )}
        </section>

        {/* HALL OF FAME */}
        {allWinners.length > 0 && (
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="mb-32"
          >
            <div className="mb-8">
            <p className="industrial-label text-foreground-muted tracking-[0.3em]">[02] Hall of Fame</p>
          </div>

            <div className="container mx-auto px-4">
              {/* Top 3 Podium */}
              {allWinners.slice(0, 3).length > 0 && (
                <div className="mb-16">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {/* Second Place */}
                    {allWinners[1] && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: 0.05 }}
                      >
                        <Card className="bg-black/50 border border-purple-500/30 backdrop-blur-sm">
                          <CardContent className="p-8 flex flex-col items-center">
                            <div className="text-4xl font-bold text-purple-400/40 mb-4 font-mono">
                              02
                            </div>
                            <div className="w-20 h-20 rounded-full bg-black border border-purple-500/30 flex items-center justify-center text-2xl font-bold text-purple-400 mb-4">
                              {allWinners[1].user?.username?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'AN'}
                            </div>
                            <h3 className="text-base font-semibold text-white mb-2">
                              {allWinners[1].user?.username || 'ANONYMOUS'}
                            </h3>
                            <p className="text-sm text-purple-400 font-mono flex items-center gap-2">
                              <Star className="w-4 h-4 fill-current" />
                              {allWinners[1].totalStars}
                            </p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}

                    {/* First Place */}
                    {allWinners[0] && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3 }}
                      >
                        <Card className="bg-black/50 border border-purple-400/50 backdrop-blur-sm md:-mt-8 md:mb-8">
                          <CardContent className="p-10 flex flex-col items-center">
                            <div className="text-5xl font-bold text-purple-400/60 mb-4 font-mono">
                              01
                            </div>
                            <div className="w-24 h-24 rounded-full bg-black border border-purple-400/60 flex items-center justify-center text-3xl font-bold text-purple-300 mb-4">
                              {allWinners[0].user?.username?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'AN'}
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">
                              {allWinners[0].user?.username || 'ANONYMOUS'}
                            </h3>
                            <p className="text-lg text-purple-300 font-mono flex items-center gap-2">
                              <Star className="w-5 h-5 fill-current" />
                              {allWinners[0].totalStars}
                            </p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}

                    {/* Third Place */}
                            {allWinners[2] && (
                              <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.3, delay: 0.15 }}
                      >
                        <Card className="bg-black/50 border border-purple-500/30 backdrop-blur-sm">
                          <CardContent className="p-8 flex flex-col items-center">
                            <div className="text-4xl font-bold text-purple-400/40 mb-4 font-mono">
                              03
                            </div>
                            <div className="w-20 h-20 rounded-full bg-black border border-purple-500/30 flex items-center justify-center text-2xl font-bold text-purple-400 mb-4">
                              {allWinners[2].user?.username?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'AN'}
                            </div>
                            <h3 className="text-base font-semibold text-white mb-2">
                              {allWinners[2].user?.username || 'ANONYMOUS'}
                            </h3>
                            <p className="text-sm text-purple-400 font-mono flex items-center gap-2">
                              <Star className="w-4 h-4 fill-current" />
                              {allWinners[2].totalStars}
                            </p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}
                  </div>
                </div>
              )}

              {/* Remaining Winners List */}
              {allWinners.slice(3).length > 0 && (
                <div className="max-w-3xl mx-auto space-y-4">
                  {allWinners.slice(3).map((winner, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <Card className="bg-black/50 border border-purple-500/30 backdrop-blur-sm">
                        <CardContent className="p-6 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <span className="text-lg font-mono text-purple-400/40 w-8">
                              {String(index + 4).padStart(2, '0')}
                            </span>
                            <div className="w-10 h-10 rounded-full bg-black border border-purple-500/30 flex items-center justify-center text-sm font-bold text-purple-400">
                              {winner.user?.username?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'AN'}
                            </div>
                            <div className="text-sm text-white">
                              {winner.user?.username || 'ANONYMOUS'}
                            </div>
                          </div>
                          <p className="text-sm text-purple-400 font-mono flex items-center gap-2">
                            <Star className="w-4 h-4 fill-current" />
                            {winner.totalStars}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.section>
        )}

        {/* STATS */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="mb-32"
        >
          <div className="mb-8">
            <p className="industrial-label text-foreground-muted tracking-[0.3em]">[03] Stats</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { rawValue: 50000, displayPrefix: '₹', label: 'TOTAL AMOUNT PAID', isMetallic: true },
              { rawValue: totalParticipants, displayPrefix: '', label: 'TOTAL PARTICIPANTS', isMetallic: false },
              { rawValue: totalCompetitionsHosted, displayPrefix: '', label: 'TOTAL COMPETITIONS HOSTED', isMetallic: false },
              { rawValue: totalProjectsSubmitted, displayPrefix: '', label: 'PROJECTS SUBMITTED', isMetallic: false },
              { rawValue: totalWinnersRewarded, displayPrefix: '', label: 'WINNERS REWARDED', isMetallic: false },
              { rawValue: 1000, displayPrefix: '', displaySuffix: '★', label: 'TOTAL STARS AWARDED', isMetallic: true }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="bg-black/50 border border-blue-500/30 backdrop-blur-sm">
                  <CardContent className="p-8">
                    <div className="flex flex-col gap-4">
                      <p className={`text-4xl sm:text-5xl font-heading font-bold ${stat.isMetallic ? 'text-metallic-200' : 'text-foreground'}`}>
                        {stat.displayPrefix}
                        <AnimatedCounter
                          value={stat.rawValue}
                          duration={1200 + index * 100}
                        />
                        {stat.displaySuffix}
                      </p>
                      <p className="industrial-label text-foreground-muted">{stat.label}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ARCHIVE */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="mb-32"
        >
          <div className="mb-8">
            <p className="industrial-label text-foreground-muted tracking-[0.3em]">[04] Archive</p>
          </div>

          {completedCompetitions.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...completedCompetitions].reverse().map((comp, index) => (
                <motion.div
                  key={comp._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Link to={`/weekends/${comp._id}`} className="block">
                    <Card className="bg-black/50 border border-blue-500/30 backdrop-blur-sm transition-all cursor-pointer h-full">
                      <CardContent className="p-6">
                        <div className="flex flex-col gap-4">
                          <Badge variant="outline" className="px-3 py-1 rounded-[4px] text-xs w-fit">
                            #{padNumber(comp.competitionNumber || 0)}
                          </Badge>
                          <h3 className="text-xl sm:text-2xl font-heading font-bold text-foreground">
                            {comp.name.toUpperCase()}
                          </h3>
                          <p className="industrial-label text-foreground-muted">
                            {new Date(comp.end_date).toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>
      </main>

      {/* JOIN CODE DIALOG FOR SPECIAL COMPETITIONS */}
      <Dialog
        open={showJoinDialog}
        onOpenChange={(open) => {
          setShowJoinDialog(open);
          if (!open) {
            setCurrentCompetitionForJoin(null);
            setJoinCodeInput('');
          }
        }}
      >
        <DialogContent className="sm:max-w-lg bg-surface border-border text-foreground">
          <DialogHeader>
            <DialogTitle className="font-heading text-foreground text-xl sm:text-2xl uppercase tracking-[0.1em]">
              ENTER COMPETITION CODE
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 pt-6">
            <div className="space-y-3">
              <label className="industrial-label text-foreground-muted">
                JOIN CODE
              </label>
              <input
                type="text"
                value={joinCodeInput}
                onChange={(e) => setJoinCodeInput(e.target.value)}
                className="w-full px-4 py-3 border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-border"
                placeholder="Enter join code"
                autoFocus
              />
            </div>
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowJoinDialog(false);
                  setCurrentCompetitionForJoin(null);
                  setJoinCodeInput('');
                }}
                className="flex-1"
              >
                CANCEL
              </Button>
              <Button
                type="button"
                onClick={async () => {
                  if (!currentCompetitionForJoin) return;
                  await doJoinCompetition(currentCompetitionForJoin, joinCodeInput);
                  if (hasUserJoined(currentCompetitionForJoin._id)) {
                    setShowJoinDialog(false);
                    setCurrentCompetitionForJoin(null);
                    setJoinCodeInput('');
                  }
                }}
                className="flex-1"
                disabled={joining || !joinCodeInput.trim()}
              >
                {joining ? 'JOINING...' : 'ENTER'}
              </Button>
            </div>
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
};

export default WeekendsHubPage;
