import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { GripVertical } from "lucide-react";
import { Reorder } from "framer-motion";

interface Template {
  _id: string;
  title: string;
  description: string;
  estimatedPrice: number;
  framework?: string;
  platform?: string;
  theme?: string;
  category?: string;
  features?: string[];
  techStack?: string[];
  previewImageUrl?: string;
  uploadedBy: {
    _id: string;
    username: string;
    email: string;
  };
  createdAt: string;
  liveLink?: string;
  githubRepo?: string;
  affiliateLink?: string;
  uploadType?: string;
  stars?: number; // ✅ NEW: Stars for competition
}

interface UserTemplates {
  user: {
    _id: string;
    username: string;
    email: string;
  };
  templates: Template[];
}

interface Competition {
  _id: string;
  name: string;
  description?: string;
  prize?: string;
  prizeLimit?: string;
  prize_description?: string;
  rules?: string;
  info?: string;
  start_date: string;
  end_date: string;
  visibility_type: "public" | "custom";
  join_code?: string;
  winners?: any[];
  published?: boolean;
}

const CompetitionDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userTemplates, setUserTemplates] = useState<UserTemplates[]>([]);
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [winners, setWinners] = useState<Template[]>([]);
  const [openArrange, setOpenArrange] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [publishing, setPublishing] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",   // 👈 Force Indian Standard Time
    timeZoneName: "short",      // 👈 Optional, shows "IST"
  });


  const extractWinnerIds = (raw: any[] | undefined): string[] => {
    if (!raw || !Array.isArray(raw)) return [];
    return raw
      .map((w) => {
        if (typeof w === "string") return w;
        if (w?.template?._id) return String(w.template._id);
        if (w?.template) return String(w.template);
        if (w?._id) return String(w._id);
        return null;
      })
      .filter(Boolean) as string[];
  };

  const uniqueById = (arr: Template[]) => {
    const seen = new Set<string>();
    return arr.filter((t) => (seen.has(t._id) ? false : (seen.add(t._id), true)));
  };

  const saveWinnerIds = useCallback(
    async (winnerIds: string[]) => {
      const token = localStorage.getItem("token");
      const res = await fetch(`${backendUrl}/api/competitions/${id}/winners`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ winners: winnerIds }),
      });
      if (!res.ok) {
        const msg = await res.text().catch(() => null);
        throw new Error(msg || "Failed to save winners");
      }
    },
    [backendUrl, id]
  );

  const reorderTimer = useRef<number | null>(null);
  const scheduleAutoSave = useCallback(
    (winnerIds: string[]) => {
      if (reorderTimer.current) window.clearTimeout(reorderTimer.current);
      reorderTimer.current = window.setTimeout(async () => {
        try {
          await saveWinnerIds(winnerIds);
          toast.success("Winners order saved");
        } catch (e) {
          toast.error("Failed to save new order");
        }
      }, 500);
    },
    [saveWinnerIds]
  );

  const fetchCompetitionData = useCallback(async () => {
    try {
      setLoading(true);

      const compRes = await fetch(`${backendUrl}/api/competitions/${id}`);
      if (!compRes.ok) throw new Error("Failed to fetch competition info");
      const compData: Competition = await compRes.json();
      setCompetition(compData);

      const templatesRes = await fetch(
        `${backendUrl}/api/competitions/${id}/templates`
      );
      if (!templatesRes.ok) throw new Error("Failed to fetch templates");
      const templates: Template[] = await templatesRes.json();

      const grouped: Record<string, UserTemplates> = {};
      templates.forEach((template) => {
        const userId = template.uploadedBy?._id || "unknown";
        if (!grouped[userId])
          grouped[userId] = { user: template.uploadedBy, templates: [] };
        grouped[userId].templates.push(template);
      });
      setUserTemplates(Object.values(grouped));

      const winnerIds = extractWinnerIds(compData.winners);
      if (winnerIds.length) {
        const map = new Map(templates.map((t) => [t._id, t]));
        const orderedWinnerTemplates = winnerIds
          .map((wid) => map.get(wid))
          .filter(Boolean) as Template[];
        setWinners(orderedWinnerTemplates);
      } else {
        setWinners([]);
      }
    } catch (err: any) {
      toast.error(err?.message || "Error fetching competition details");
    } finally {
      setLoading(false);
    }
  }, [backendUrl, id]);

  useEffect(() => {
    if (id) fetchCompetitionData();
  }, [id, fetchCompetitionData]);

  const toggleWinner = async (template: Template) => {
    const currentlyWinner = winners.some((w) => w._id === template._id);
    const prev = winners;

    const next = currentlyWinner
      ? prev.filter((w) => w._id !== template._id)
      : uniqueById([...prev, template]);

    setWinners(next);

    try {
      await saveWinnerIds(next.map((w) => w._id));
      toast.success(currentlyWinner ? "Removed from winners" : "Added to winners");
    } catch (e) {
      setWinners(prev);
      toast.error("Failed to update winners");
    }
  };

  const handleSaveWinners = async () => {
    try {
      await saveWinnerIds(winners.map((w) => w._id));
      toast.success("Winners saved successfully!");
      setOpenArrange(false);
    } catch {
      toast.error("Error saving winners");
    }
  };

  const togglePublish = async () => {
    if (!competition) return;
    try {
      setPublishing(true);
      const token = localStorage.getItem("token");
  
      const endpoint = competition.published
        ? `${backendUrl}/api/competitions/${competition._id}/unpublish`
        : `${backendUrl}/api/competitions/${competition._id}/publish`;
  
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
  
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to update publish status");
      }
  
      toast.success(
        competition.published
          ? "Winners unpublished successfully!"
          : "Winners published successfully!"
      );
  
      setCompetition({ ...competition, published: !competition.published });
    } catch (err: any) {
      toast.error(err?.message || "Error updating publish status");
    } finally {
      setPublishing(false);
    }
  };
  

  const isOver =
    competition && new Date(competition.end_date).getTime() < Date.now();

  const filteredTemplates = userTemplates.map(({ user, templates }) => ({
    user,
    templates: templates.filter(
      (t) =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  }));

  return (
    <div className="p-6 space-y-6">
      <Button
        variant="outline"
        onClick={() =>
          window.open("http://localhost:8080/admin?tab=competitions", "_self")
        }
        className="mb-4"
      >
        &larr; Back
      </Button>

      {competition && (
        <div className="p-4 border rounded-md bg-card shadow-sm space-y-2">
          <h2 className="text-2xl font-bold">{competition.name}</h2>
          {competition.description && <p>{competition.description}</p>}
          <p><strong>Prize:</strong> {competition.prize || "N/A"}</p>
          <p><strong>Prize Limit:</strong> {competition.prizeLimit || "N/A"}</p>
          {competition.prize_description && (
            <div>
              <strong>Prize Details:</strong>
              <p className="mt-1 whitespace-pre-wrap">{competition.prize_description}</p>
            </div>
          )}
          <p><strong>Rules:</strong> {competition.rules || "N/A"}</p>
          {competition.info && (
            <div>
              <strong>Info:</strong>
              <p className="mt-1 whitespace-pre-wrap">{competition.info}</p>
            </div>
          )}
          <p>
            <strong>Dates:</strong> {formatDate(competition.start_date)} -{" "}
            {formatDate(competition.end_date)}
          </p>
          <p><strong>Visibility:</strong> {competition.visibility_type}</p>
          {competition.visibility_type === "custom" && competition.join_code && (
            <p><strong>Join Code:</strong> {competition.join_code}</p>
          )}
        </div>
      )}

      {winners.length > 0 && (
        <Button variant="default" onClick={() => setOpenArrange(true)}>
          Arrange Winners
        </Button>
      )}
 {/* Publish / Unpublish section */}
 {competition && (
        <div className="p-4 border rounded-md bg-yellow-50 text-yellow-800 space-y-3">
          <p>
            ⚠️ This competition has ended.{" "}
            {competition.published ? "Winners are published." : "Winners not published yet."}
          </p>
          <Button
            variant="default"
            onClick={togglePublish}
            disabled={publishing}
          >
            {publishing
              ? "Processing..."
              : competition.published
              ? "Unpublish Winners"
              : "Publish Winners"}
          </Button>
        </div>
      )}
      {/* Search */}
      <div className="max-w-md">
        <Input
          placeholder="Search templates..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-4"
        />
      </div>

      {loading ? (
        <p>Loading templates...</p>
      ) : userTemplates.length === 0 ? (
        <p>No templates uploaded yet.</p>
      ) : (
        <ul className="space-y-4">
          {filteredTemplates.map(({ user, templates }) =>
            templates.map((template) => {
              const isWinner = winners.some((w) => w._id === template._id);
              return (
                <li
                  key={template._id}
                  className="p-4 border rounded-md bg-card shadow-sm space-y-2 relative"
                >
                  {isWinner && (
                    <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      Winner
                    </span>
                  )}

                  {template.previewImageUrl && (
                    <img
                      src={template.previewImageUrl}
                      alt={template.title}
                      className="w-full max-h-60 object-cover rounded-md"
                    />
                  )}

                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold">{template.title}</h3>
                    {template.stars !== undefined && <p className="text-sm font-bold text-yellow-600">{template.stars} Stars</p>}
                    <p className="text-sm text-gray-600">{template.description}</p>
                    <p className="text-sm text-gray-500">
                      Uploaded by {user.username} ({user.email})
                    </p>
                    <p className="text-sm text-gray-500">
                      Uploaded: {formatDate(template.createdAt)}
                    </p>
                  </div>

                  <div className="flex gap-2 flex-wrap mt-2">
                    <Button
                      variant={isWinner ? "destructive" : "secondary"}
                      size="sm"
                      onClick={() => toggleWinner(template)}
                    >
                      {isWinner ? "Remove from Winners" : "Add to Winners"}
                    </Button>

                    {template.liveLink && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => window.open(template.liveLink, "_blank")}
                      >
                        View Live
                      </Button>
                    )}

                    {template.githubRepo && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() =>
                          window.open(
                            template.uploadType === "github"
                              ? `https://github.com/${template.githubRepo}`
                              : template.githubRepo,
                            "_blank"
                          )
                        }
                      >
                        View Repo
                      </Button>
                    )}

                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => navigate(`/admin/template/${template._id}`)}
                    >
                      Detail Page
                    </Button>
                  </div>
                </li>
              );
            })
          )}
        </ul>
      )}

     

      {/* Arrange Winners Modal */}
      <Dialog open={openArrange} onOpenChange={setOpenArrange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Arrange Winners</DialogTitle>
          </DialogHeader>

          <Reorder.Group
            axis="y"
            values={winners}
            onReorder={(items) => {
              setWinners(items);
              scheduleAutoSave(items.map((w) => w._id));
            }}
            className="space-y-2"
          >
            {winners.map((template, index) => (
              <Reorder.Item
                key={template._id}
                value={template}
                className="flex items-center justify-between p-3 border rounded-md bg-white shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`text-sm font-bold px-2 py-1 rounded-full ${
                      index === 0
                        ? "bg-yellow-300 text-yellow-900"
                        : index === 1
                        ? "bg-gray-300 text-gray-900"
                        : index === 2
                        ? "bg-orange-300 text-orange-900"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {["1st", "2nd", "3rd"][index] || `${index + 1}th`}
                  </span>
                  <div>
                    <p className="font-medium">{template.title}</p>
                    <p className="text-xs text-gray-500">
                      by {template.uploadedBy.username}
                    </p>
                  </div>
                </div>
                <GripVertical className="text-gray-400" />
              </Reorder.Item>
            ))}
          </Reorder.Group>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setOpenArrange(false)}>
              Close
            </Button>
            <Button variant="default" onClick={handleSaveWinners}>
              Save Now
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CompetitionDetails;
