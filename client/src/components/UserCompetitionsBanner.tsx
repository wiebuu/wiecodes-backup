import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface Competition {
  _id: string;
  name: string;
  visibility_type: "public" | "custom";
  start_date: string;
  end_date: string;
}

const UserCompetitionsBanner = () => {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchCompetitions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Fetch all public competitions
      const publicRes = await fetch(`${backendUrl}/api/competitions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!publicRes.ok) throw new Error("Failed to fetch weekend challenges");
      const allCompetitions: Competition[] = await publicRes.json();
      const publicCompetitions = allCompetitions.filter(
        (c) => c.visibility_type === "public"
      );

      // Fetch user's joined competitions
      const joinedRes = await fetch(`${backendUrl}/api/competitions/my/joined`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!joinedRes.ok) throw new Error("Failed to fetch joined weekend challenges");
      const joinedIds: string[] = await joinedRes.json();

      // Get full details of joined competitions
      const joinedCustom: Competition[] = await Promise.all(
        joinedIds.map(async (id) => {
          const res = await fetch(`${backendUrl}/api/competitions/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!res.ok) throw new Error("Failed to fetch weekend challenge details");
          const data: Competition = await res.json();
          return data.visibility_type === "custom" ? data : null;
        })
      ).then((arr) => arr.filter(Boolean) as Competition[]);

      // Merge public + joined custom (avoid duplicates)
      const merged = [
        ...publicCompetitions,
        ...joinedCustom.filter((c) => !publicCompetitions.some((pc) => pc._id === c._id)),
      ];

      setCompetitions(merged);
    } catch (err: any) {
      toast.error(err.message || "Error loading weekend challenges");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompetitions();
  }, []);

  if (loading || competitions.length === 0) return null;

  const now = new Date();
  const liveCompetitions = competitions.filter(
    (c) => new Date(c.start_date) <= now && new Date(c.end_date) >= now
  );
  const upcomingCompetitions = competitions.filter(
    (c) => new Date(c.start_date) > now
  );

  const showCompetitions = liveCompetitions.length > 0 ? liveCompetitions : upcomingCompetitions;
  const isLive = liveCompetitions.length > 0;

  if (showCompetitions.length === 0) return null;

  return (
    <>
      <div className="p-5 mb-8 max-w-2xl mx-auto rounded-[4px] text-center bg-surface border border-border shadow-industrial-sm">
        {/* Title */}
        <p className="font-semibold text-lg mb-2 flex items-center justify-center gap-2">
          <Trophy className="w-4 h-4 text-metallic-200" />
          {isLive
            ? "Your Upload Joins Live Competitions 🚀"
            : "Coming Soon Competitions ⏳"}
        </p>

        {/* Text */}
        <p className="text-sm text-foreground-muted mb-4">
          {isLive
            ? "The template you’re uploading will also compete in these active competitions:"
            : "These competitions are starting soon. Stay tuned and get ready!"}
        </p>

        {/* Competitions badges */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {showCompetitions.map((comp) => (
            <Link key={comp._id} to={`/weekends/${comp._id}`}>
              <Badge
                variant="outline"
                className="text-xs sm:text-sm px-3 py-1 rounded-[4px] bg-surface-secondary cursor-pointer hover:bg-surface-secondary/80"
              >
                {comp.name}
              </Badge>
            </Link>
          ))}
        </div>

        {/* Button */}
        <Link to="/weekends">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-5 py-2 rounded-[4px] text-sm font-semibold bg-surface-secondary text-foreground border border-border hover:bg-metallic-300/20 transition-all"
          >
            View Competitions
          </motion.button>
        </Link>

        {/* ⚠️ Note */}
        <p className="text-xs text-foreground-muted mt-3">
          ⚠️ Upload your template only when the competition has <strong className="text-foreground">started</strong> and you are participating. Otherwise, it will be considered just a normal upload.
        </p>
      </div>
    </>
  );
};

export default UserCompetitionsBanner;
