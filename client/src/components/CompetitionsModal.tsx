// CompetitionsModal.tsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trophy } from "lucide-react";
import CompetitionDetailsModal from "./CompetitionDetailsModal";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface Competition {
  _id: string;
  name: string;
  description: string;
  prize?: string;
  rules?: string;
  start_date: string;
  end_date: string;
  visibility_type: "public" | "custom";
  join_code?: string;
  participants?: string[];
  published?: boolean; // ✅ Added for published status
}

interface CompetitionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CompetitionsModal: React.FC<CompetitionsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompetition, setSelectedCompetition] =
    useState<Competition | null>(null);
  const [enterCode, setEnterCode] = useState("");
  const [expandedCodeInput, setExpandedCodeInput] = useState<string | null>(
    null
  );
  const [joinedCompetitions, setJoinedCompetitions] = useState<string[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const [compRes, joinedRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_BACKEND_URL}/api/competitions`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: token ? `Bearer ${token}` : "",
            },
          }),
          fetch(`${import.meta.env.VITE_BACKEND_URL}/api/competitions/my/joined`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: token ? `Bearer ${token}` : "",
            },
          }),
        ]);

        const competitionsData = await compRes.json();
        const joinedData = await joinedRes.json();

        setCompetitions(Array.isArray(competitionsData) ? competitionsData : []);
        setJoinedCompetitions(Array.isArray(joinedData) ? joinedData : []);
      } catch (err) {
        console.error("Failed to fetch:", err);
        setCompetitions([]);
        setJoinedCompetitions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isOpen]);

  // ✅ Join competition (custom)
  const handleJoinCompetition = async (competitionId: string) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/competitions/${competitionId}/join`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify({ join_code: enterCode }),
        }
      );

      const data = await res.json();

      if (res.ok && data.joined) {
        setExpandedCodeInput(null);
        setEnterCode("");
        setJoinedCompetitions((prev) =>
          prev.includes(competitionId) ? prev : [...prev, competitionId]
        );
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Join failed:", error);
    }
  };

  // ✅ Auto join competition (public) → redirect to upload
  const handleAutoJoinCompetition = (competitionId: string) => {
    navigate("/seller/upload", { state: { competitionId } });
  };

  // ✅ Live ticking countdown formatter
  const formatCountdown = (end: string) => {
    const diff = new Date(end).getTime() - Date.now();
    if (diff <= 0) return "Ended";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    return days > 0
      ? `${days}d ${hours}h ${mins}m`
      : hours > 0
        ? `${hours}h ${mins}m ${secs}s`
        : `${mins}m ${secs}s`;
  };

  // ✅ Keep countdown live
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // ✅ Categorize & sort competitions
  const sortedCompetitions = [...competitions].sort((a, b) => {
    const aStart = new Date(a.start_date).getTime();
    const aEnd = new Date(a.end_date).getTime();
    const bStart = new Date(b.start_date).getTime();
    const bEnd = new Date(b.end_date).getTime();

    const aStatus = aEnd < now ? 2 : aStart > now ? 1 : 0;
    const bStatus = bEnd < now ? 2 : bStart > now ? 1 : 0;

    if (aStatus !== bStatus) return aStatus - bStatus;
    return aStart - bStart;
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 min-h-screen bg-background/95 backdrop-blur-md flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-surface rounded-[4px] shadow-industrial-xl border border-border max-w-5xl w-full max-h-[90vh] overflow-y-auto p-6 relative"
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-surface-secondary rounded-[4px] border border-border hover:bg-metallic-300/20 transition-colors"
            >
              <X className="w-4 h-4 text-foreground" />
            </button>

            {/* Header */}
            <div className="text-center py-6 mb-8 border-b border-border">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-heading text-foreground mb-4">
                COMPETITIONS
              </h2>

              <p className="text-foreground-muted text-sm sm:text-base max-w-2xl mx-auto mt-3 space-y-1">
                <span className="text-metallic-200 font-medium industrial-label">
                  Public Competitions: Upload your template → compete → win rewards
                </span>
              </p>

              {/* ✅ Upload Button */}
              <div className="mt-5 flex justify-center">
                <Button
                  onClick={() => {
                    if (location.pathname === "/seller/upload") {
                      onClose(); // ✅ Close popup if already on upload page
                    } else {
                      navigate("/seller/upload"); // ✅ Navigate if not on upload page
                    }
                  }}
                  variant="default"
                  className="px-6 py-2.5 rounded-[4px] font-semibold text-sm sm:text-base shadow-industrial-sm"
                >
                  <Trophy className="w-4 h-4 mr-2" />
                  Upload to Competition
                </Button>
              </div>

              <p className="text-xs text-foreground-muted mt-3 text-center">
                ⚠️ Upload your template only when the competition has <strong className="text-foreground">started</strong> and you are participating. Otherwise, it will be considered just a normal upload.
              </p>
            </div>

            {/* List */}
            <div className="overflow-y-auto max-h-[70vh] pr-2">
              {loading ? (
                <p className="text-center text-foreground-muted">Loading competitions...</p>
              ) : competitions.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 overflow-visible">
                  {sortedCompetitions.map((comp) => {
                    const start = new Date(comp.start_date).getTime();
                    const end = new Date(comp.end_date).getTime();
                    const countdown = formatCountdown(comp.end_date);
                    const totalMs = end - start;
                    const elapsedMs = now - start;
                    const progress = Math.min(Math.max((elapsedMs / totalMs) * 100, 0), 100);
                    const isJoined = joinedCompetitions.includes(comp._id);
                    const isOver = now > end;

                    return (
                      <motion.div
                        key={comp._id}
                        whileHover={{
                          scale: 1.02,
                        }}
                        transition={{ type: "spring", stiffness: 250, damping: 18 }}
                        className="relative flex flex-col rounded-[4px] bg-surface border border-border shadow-industrial-sm hover:shadow-industrial"
                      >
                        {/* Banner */}
                        <div
                          className={`relative h-24 flex items-center justify-center px-4 ${comp.visibility_type === "public"
                              ? "bg-surface-secondary"
                              : "bg-surface-secondary"
                            }`}
                        >
                          {now >= start && now < end ? (
                            <span className="px-4 py-2 rounded-[4px] bg-background text-metallic-200 text-sm font-bold shadow-industrial-sm border border-border">
                              ⏳ Ends in {countdown}
                            </span>
                          ) : now < start ? (
                            <span className="px-4 py-2 rounded-[4px] bg-background text-foreground-muted text-sm font-bold shadow-industrial-sm border border-border">
                              🚀 Starts in {formatCountdown(comp.start_date)}
                            </span>
                          ) : (
                            <span className="px-4 py-2 rounded-[4px] bg-background text-foreground text-sm font-bold shadow-industrial-sm border border-border">
                              ✅ Finished
                            </span>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex flex-col flex-1">
                          <div className="p-4 flex flex-col gap-2 flex-1">
                            <h4 className="font-bold text-sm sm:text-base text-foreground">
                              {comp.name}
                            </h4>

                            {/* Progress bar */}
                            <div className="relative h-2 w-full bg-surface-secondary rounded-[4px] overflow-hidden">
                              <motion.div
                                animate={{ width: `${progress}%` }}
                                className="absolute top-0 left-0 h-2 bg-metallic-300"
                              />
                            </div>

                            <p className="text-xs text-foreground-muted line-clamp-3">
                              {comp.description}
                            </p>

                            {/* Badges */}
                            <div className="flex flex-wrap gap-1 text-[11px]">
                              <Badge variant="outline" className="px-2 py-0.5 rounded-[4px]">
                                {comp.visibility_type === "public" ? "Public" : "Custom"}
                              </Badge>
                              {comp.prize && (
                                <Badge variant="outline" className="flex items-center gap-1 px-2 py-0.5 rounded-[4px] bg-surface-secondary">
                                  <Trophy className="w-3 h-3 text-metallic-200" /> {comp.prize}
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Actions pinned bottom */}
                          <div className="flex gap-2 p-3 border-t border-border">
                            {/* 👉 Navigate to dedicated page */}
                            {!isOver && (
                              <Button
                                onClick={() => {
                                  onClose();
                                  navigate(`/weekends/${comp._id}`);
                                }}
                                variant="outline"
                                size="sm"
                                className="flex-1 text-xs"
                              >
                                View Competition
                              </Button>
                            )}

                            {isOver && comp.published && (
                              <Button
                                onClick={() => {
                                  onClose();
                                  navigate(`/weekends/${comp._id}`);
                                }}
                                variant="default"
                                size="sm"
                                className="flex-1 text-xs"
                              >
                                🎉 View Results
                              </Button>
                            )}
                            {isOver && !comp.published && (
                              <span className="flex-1 px-3 py-1 text-xs font-semibold bg-surface-secondary text-foreground-muted rounded-[4px] text-center industrial-label">
                                Results Coming Soon
                              </span>
                            )}
                            {!isOver && comp.visibility_type !== "public" && (
                              <>
                                {isJoined ? (
                                  <span className="flex-1 px-3 py-1 text-xs font-semibold bg-surface-secondary text-metallic-200 rounded-[4px] text-center industrial-label">
                                    Joined
                                  </span>
                                ) : expandedCodeInput === comp._id ? (
                                  <div className="flex flex-col sm:flex-row gap-2 flex-1">
                                    <input
                                      type="text"
                                      placeholder="Enter code"
                                      value={enterCode}
                                      onChange={(e) => setEnterCode(e.target.value)}
                                      className="flex-1 px-2 py-1 text-xs border border-border bg-surface rounded-[4px]"
                                    />
                                    <Button
                                      onClick={() => handleJoinCompetition(comp._id)}
                                      size="sm"
                                      className="text-xs"
                                    >
                                      Join
                                    </Button>
                                  </div>
                                ) : (
                                  <Button
                                    onClick={() => setExpandedCodeInput(comp._id)}
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 text-xs"
                                  >
                                    Enter Code
                                  </Button>
                                )}
                              </>
                            )}
                            {!isOver && comp.visibility_type === "public" && (
                              <span className="flex-1 px-3 py-1 text-xs font-semibold bg-surface-secondary text-metallic-200 rounded-[4px] text-center industrial-label">
                                Joined
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>

                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-foreground-muted text-center italic">
                  🎉 New competitions coming soon. Stay tuned!
                </p>
              )}
            </div>

            {/* Details modal */}
            {selectedCompetition && (
              <CompetitionDetailsModal
                competition={selectedCompetition}
                onClose={() => setSelectedCompetition(null)}
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CompetitionsModal;
