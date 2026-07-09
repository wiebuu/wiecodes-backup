import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, Clock, Info, Users, Gift, Eye, Trophy } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

const CompetitionDetailsModal = ({ competition, onClose }) => {
  const [fullCompetition, setFullCompetition] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState("");
  const [status, setStatus] = useState(""); // "upcoming", "ongoing", "finished"
  const [activeTab, setActiveTab] = useState<"details" | "templates">("details");
  const [userRole, setUserRole] = useState<"admin" | "reviewer" | "user">("user");
  const [showConfetti, setShowConfetti] = useState(false); // Confetti state

  const { width, height } = useWindowSize(); // For confetti

  // Fetch competition details
  useEffect(() => {
    if (!competition?._id) return;
    const fetchCompetition = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/competitions/${competition._id}`
        );
        if (!res.ok) throw new Error("Failed to fetch weekend challenge details");
        const data = await res.json();
        setFullCompetition(data);
      } catch (err) {
        console.error(err);
        setFullCompetition(competition);
      }
    };
    fetchCompetition();
  }, [competition]);

  // Fetch templates
  useEffect(() => {
    if (!competition?._id) return;
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/competitions/${competition._id}/templates`
        );
        if (!res.ok) throw new Error("Failed to fetch templates");
        const data = await res.json();
        setTemplates(data || []);
      } catch (err) {
        console.error(err);
        setTemplates([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTemplates();
  }, [competition]);

  // Fetch user role
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setUserRole(data.role))
      .catch(() => setUserRole("user"));
  }, []);

  // Countdown Timer
  useEffect(() => {
    if (!fullCompetition) return;
    const updateClock = () => {
      const now = new Date();
      const start = new Date(fullCompetition.start_date).getTime();
      const end = new Date(fullCompetition.end_date).getTime();
      const nowTime = now.getTime();

      if (nowTime < start) {
        setStatus("upcoming");
        setTimeLeft(formatTime(start - nowTime));
      } else if (nowTime >= start && nowTime < end) {
        setStatus("ongoing");
        setTimeLeft(formatTime(end - nowTime));
      } else {
        setStatus("finished");
        setTimeLeft("00:00:00");
      }
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, [fullCompetition]);

  // Show confetti if competition has finished and published winners
  useEffect(() => {
    if (
      fullCompetition &&
      new Date(fullCompetition.end_date) < new Date() && // ✅ competition finished
      fullCompetition.published && // ✅ results published
      fullCompetition.winners?.length > 0 // ✅ winners exist
    ) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000); // Stop after 5s
      return () => clearTimeout(timer);
    }
  }, [fullCompetition]);

  const formatTime = (ms: number) => {
    if (ms <= 0) return "00:00:00";
    const totalSeconds = Math.floor(ms / 1000);
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  const openLivePreview = (link: string) => {
    if (!link) return;
    window.open(link, "_blank");
  };

  if (!fullCompetition) return null;

  return (
    <AnimatePresence>
      {competition && (
        <motion.div
          className="fixed inset-0 bg-background/95 backdrop-blur-md flex items-center justify-center z-50 p-2 sm:p-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-surface border border-border rounded-[4px] shadow-industrial-xl max-w-full sm:max-w-4xl w-full p-4 sm:p-6 relative overflow-y-auto max-h-[90vh]"
          >
            {/* Confetti */}
            {showConfetti && <Confetti width={width} height={height} numberOfPieces={300} recycle={false} />}

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 bg-surface-secondary rounded-[4px] border border-border hover:bg-metallic-300/20 transition-colors"
            >
              <X className="w-4 h-4 text-foreground" />
            </button>

            {/* Title */}
            <div className="text-center mb-4 sm:mb-6">
              <Badge variant="outline" className="mb-4">
                <Trophy className="w-3.5 h-3.5 mr-1 text-metallic-200" />
                COMPETITION
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-heading text-foreground mb-4">
                {fullCompetition.name}
              </h2>
            </div>

            {/* Countdown Timer */}
            <div className="flex flex-col items-center mb-4 sm:mb-6">
              <div className="flex items-center gap-2 text-base sm:text-lg font-semibold text-foreground-muted">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-metallic-200" />
                {status === "upcoming" && <span>Starts in</span>}
                {status === "ongoing" && <span>Ends in</span>}
                {status === "finished" && <span>Competition Finished</span>}
              </div>
              {status !== "finished" && (
                <div className="mt-1 text-2xl sm:text-3xl font-mono font-bold text-metallic-200">
                  {timeLeft}
                </div>
              )}
            </div>

            {/* Tab Buttons */}
            <div className="flex justify-center gap-2 sm:gap-4 mb-4 sm:mb-6 flex-wrap">
              <Button
                onClick={() => setActiveTab("details")}
                variant={activeTab === "details" ? "default" : "outline"}
                size="sm"
                className="px-4 sm:px-5"
              >
                <Info className="w-4 h-4 mr-2" />
                Details
              </Button>

              <Button
                onClick={() => setActiveTab("templates")}
                variant={activeTab === "templates" ? "default" : "outline"}
                size="sm"
                className="px-4 sm:px-5"
              >
                <FileText className="w-4 h-4 mr-2" />
                Submissions
              </Button>
            </div>

            {/* Details Tab */}
            {activeTab === "details" && (
              <div className="p-4 sm:p-6 rounded-[4px] bg-surface-secondary border border-border mb-6 space-y-4">
                {/* Prize */}
                {fullCompetition.prize && (
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Gift className="w-5 h-5 text-metallic-200" />
                        <span className="font-semibold text-foreground industrial-label">
                          Rewards
                        </span>
                        <span className="font-normal text-foreground-muted">
                          {fullCompetition.prize}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Description */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <FileText className="w-5 h-5 text-metallic-200" />
                      <span className="text-lg font-bold text-foreground industrial-label">
                                Competition Overview
                              </span>
                    </div>
                    <p className="text-foreground-muted leading-relaxed">
                      {fullCompetition.description}
                    </p>
                  </CardContent>
                </Card>

                {/* Rules */}
                {fullCompetition.rules && (
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Info className="w-5 h-5 text-metallic-200" />
                        <span className="font-semibold text-foreground industrial-label">
                          Guidelines
                        </span>
                      </div>
                      <p className="text-foreground-muted leading-relaxed">
                        {fullCompetition.rules}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Participants */}
                {fullCompetition.type !== "open" && fullCompetition.visibility_type !== "public" && (
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-metallic-200" />
                        <span className="font-semibold text-foreground industrial-label">
                          Participants
                        </span>
                        <span className="font-normal text-foreground-muted">
                          {fullCompetition.participants?.length || 0}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Visibility */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Eye className="w-5 h-5 text-metallic-200" />
                      <span className="font-semibold text-foreground industrial-label">
                        Visibility
                      </span>
                      <span className="font-normal text-foreground-muted">
                        {fullCompetition.visibility_type}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Winners Section */}
                {new Date(fullCompetition.end_date) < new Date() &&
                  fullCompetition.winners?.length > 0 && (
                    <div className="mt-6 sm:mt-10">
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-foreground mb-4 sm:mb-6">
                                🏆 Competition Winners
                              </h2>

                      {/* Mobile scrollable, desktop flex */}
                      <div className="flex flex-row overflow-x-auto sm:overflow-x-visible gap-4 sm:gap-6 pb-2 sm:justify-center">
                        {fullCompetition.winners.map((winner: any, idx: number) => {
                          const template = templates.find((t) => t._id === winner.template);
                          if (!template) return null;

                          const podiumHeightsMobile = [160, 140, 120];
                          const colors = [
                            "bg-surface-secondary",
                            "bg-surface-secondary",
                            "bg-surface-secondary",
                          ];

                          return (
                            <motion.div
                              key={idx}
                              whileHover={{ scale: 1.05 }}
                              transition={{ type: "spring", stiffness: 200, damping: 15 }}
                              className={`relative flex-shrink-0 rounded-[4px] flex flex-col items-center justify-end shadow-industrial border border-border ${colors[idx] || "bg-surface-secondary"} backdrop-blur text-foreground`}
                              style={{
                                width: "150px",
                                minHeight: `${podiumHeightsMobile[idx] || 140}px`,
                              }}
                              onClick={() => openLivePreview(template.liveLink)}
                            >
                              {/* Rank Badge */}
                              <div className="absolute -top-3 px-3 py-1 rounded-[4px] bg-surface text-xs font-bold shadow-industrial border border-border">
                                {idx === 0
                                  ? "🥇 1st"
                                  : idx === 1
                                    ? "🥈 2nd"
                                    : idx === 2
                                      ? "🥉 3rd"
                                      : `#${idx + 1}`}
                              </div>

                              {/* Template Title */}
                              <span className="text-sm font-bold text-center px-2">
                                {template.title}
                              </span>
                              <span className="text-[11px] text-foreground-muted text-center mt-1">
                                by {template.uploadedBy?.username || "Unknown"}
                              </span>

                              <Button
                                size="sm"
                                variant="outline"
                                className="mt-2 mb-3 text-xs"
                              >
                                Preview
                              </Button>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  )}
              </div>
            )}

            {/* Templates Tab */}
            {activeTab === "templates" && (
              <div className="mt-4 sm:mt-6">
                {loading ? (
                  <p className="text-foreground-muted text-center text-sm sm:text-base">Loading submissions...</p>
                ) : templates.length > 0 ? (
                  <ul className="space-y-2 sm:space-y-3">
                    {templates.map((t) => (
                      <li
                        key={t._id}
                        className="p-3 sm:p-4 rounded-[4px] bg-surface-secondary border border-border flex flex-col gap-2 sm:gap-3 hover:shadow-industrial transition-shadow cursor-pointer"
                        onClick={() => openLivePreview(t.liveLink)}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex flex-col">
                            <span className="font-semibold text-foreground text-sm sm:text-base">
                              {t.title}
                            </span>
                            <span className="text-xs sm:text-sm text-foreground-muted">
                              Uploaded by: {t.uploadedBy?.username || "Unknown"}
                            </span>
                          </div>
                          <span className="text-xs sm:text-sm text-metallic-200 industrial-label">
                            Click to Preview
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-foreground-muted text-center text-sm sm:text-base">No submissions yet.</p>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CompetitionDetailsModal;
