// src/pages/admin/components/CompetitionsManager.tsx
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const getCountdown = (endDate: string) => {
  const diff = new Date(endDate).getTime() - new Date().getTime();
  if (diff <= 0) return "Ended";
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  return `${days}d ${hours}h remaining`;
};

// ✅ Helper to always format dates in IST
const formatIST = (dateStr: string) =>
  new Date(dateStr).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
    timeZoneName: "short",
  });

const CompetitionsManager = () => {
  const [competitions, setCompetitions] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingComp, setEditingComp] = useState<any | null>(null);
  const [form, setForm] = useState({
    type: "SPECIAL",
    name: "",
    description: "",
    challenge_question: "",
    requirements: "",
    notes: "",
    prize: "",
    prizeLimit: "",
    prize_description: "",
    rules: "",
    info: "",
    start_date: "",
    end_date: "",
    visibility_type: "public",
    join_code: "",
  });

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const fetchCompetitions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${backendUrl}/api/competitions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch competitions");
      const data = await res.json();
      setCompetitions(data);
    } catch (err: any) {
      toast.error(err.message || "Error loading competitions");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async () => {
    if (form.type === "WIECODES_WEEKEND") {
      if (!form.requirements.trim() || !form.challenge_question.trim()) {
        toast.error("Challenge Question and Requirements are required");
        return;
      }
    } else if (form.type === "SPECIAL") {
      if (!form.name.trim() || !form.start_date || !form.end_date || !form.challenge_question.trim() || !form.requirements.trim()) {
        toast.error("Name, start date, end date, question, and description are required");
        return;
      }
    } else {
      if (!form.name.trim() || !form.start_date || !form.end_date) {
        toast.error("Name, start date, and end date are required");
        return;
      }
    }

    try {
      const url = editingComp
        ? `${backendUrl}/api/competitions/${editingComp._id}`
        : `${backendUrl}/api/competitions`;

      const method = editingComp ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to save competition");
      }

      toast.success(editingComp ? "Competition updated" : "Competition created");
      setIsModalOpen(false);
      setForm({
        type: "SPECIAL",
        name: "",
        description: "",
        challenge_question: "",
        requirements: "",
        notes: "",
        prize: "",
        prizeLimit: "",
        prize_description: "",
        rules: "",
        info: "",
        start_date: "",
        end_date: "",
        visibility_type: "public",
        join_code: "",
      });
      setEditingComp(null);
      fetchCompetitions();
    } catch (err: any) {
      toast.error(err.message || "Error saving competition");
    }
  };

  const handleEditClick = (comp: any) => {
    setEditingComp(comp);
    setForm({
      type: comp.type || "SPECIAL",
      name: comp.name || "",
      description: comp.description || "",
      challenge_question: comp.challenge_question || "",
      requirements: comp.requirements || "",
      notes: comp.notes || "",
      prize: comp.prize || "",
      prizeLimit: comp.prizeLimit || "",
      prize_description: comp.prize_description || "",
      rules: comp.rules || "",
      info: comp.info || "",
      start_date: new Date(comp.start_date).toISOString().slice(0, 16),
      end_date: new Date(comp.end_date).toISOString().slice(0, 16),
      visibility_type: comp.visibility_type || "public",
      join_code: comp.join_code || "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (compId: string) => {
    if (!confirm("Are you sure you want to delete this competition?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${backendUrl}/api/competitions/${compId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete competition");
      toast.success("Competition deleted");
      fetchCompetitions();
    } catch (err: any) {
      toast.error(err.message || "Error deleting competition");
    }
  };

  useEffect(() => {
    fetchCompetitions();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header + Create Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Competitions</h2>
        <Button
          onClick={() => {
            setEditingComp(null);
            setForm({
              type: "SPECIAL",
              name: "",
              description: "",
              challenge_question: "",
              requirements: "",
              notes: "",
              prize: "",
              prizeLimit: "",
              prize_description: "",
              rules: "",
              info: "",
              start_date: "",
              end_date: "",
              visibility_type: "public",
              join_code: "",
            });
            setIsModalOpen(true);
          }}
        >
          + Create Competition
        </Button>
      </div>

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg max-h-[85vh]">
          <DialogHeader>
            <DialogTitle>{editingComp ? "Edit Competition" : "Create Competition"}</DialogTitle>
            <DialogDescription>
              Fill in the details below to {editingComp ? "update" : "create"} a competition.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 overflow-y-auto max-h-[60vh]">
            <label className="text-sm font-medium">Competition Type*</label>
            <Select value={form.type} onValueChange={(value) => setForm({ ...form, type: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select competition type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="WIECODES_WEEKEND">WIECODES WEEKEND</SelectItem>
                <SelectItem value="SPECIAL">Special Competition</SelectItem>
              </SelectContent>
            </Select>

            {form.type === "WIECODES_WEEKEND" && (
              <div className="space-y-4">
                <div className="p-4 bg-surface-secondary border border-border rounded-[4px]">
                  <label className="text-sm font-medium text-foreground-muted">Competition Name</label>
                  <p className="text-lg font-heading font-bold text-foreground">WIECODES WEEKEND XXX (auto-generated)</p>
                </div>
                <Textarea 
                  placeholder="Challenge Question* (supports Markdown for formatting)" 
                  value={form.challenge_question} 
                  onChange={(e) => setForm({ ...form, challenge_question: e.target.value })} 
                  rows={4} 
                />
                <Textarea 
                  placeholder="Requirements* (supports Markdown for tables, links, formatting)" 
                  value={form.requirements} 
                  onChange={(e) => setForm({ ...form, requirements: e.target.value })} 
                  rows={8} 
                />
                <Input placeholder="Prize Limit" value={form.prizeLimit} onChange={(e) => setForm({ ...form, prizeLimit: e.target.value })} />
              </div>
            )}

            {form.type === "SPECIAL" && (
              <>
                <Input placeholder="Competition Name*" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <Textarea 
                  placeholder="Challenge Question* (supports Markdown for formatting)" 
                  value={form.challenge_question} 
                  onChange={(e) => setForm({ ...form, challenge_question: e.target.value })} 
                  rows={4} 
                />
                <Textarea 
                  placeholder="Description* (supports Markdown for tables, links, formatting)" 
                  value={form.requirements} 
                  onChange={(e) => setForm({ ...form, requirements: e.target.value })} 
                  rows={8} 
                />
                <Input placeholder="Prize Limit" value={form.prizeLimit} onChange={(e) => setForm({ ...form, prizeLimit: e.target.value })} />
                <Textarea 
                  placeholder="Prize Details (supports Markdown - How prizes will be distributed)" 
                  value={form.prize_description} 
                  onChange={(e) => setForm({ ...form, prize_description: e.target.value })} 
                  rows={8} 
                />
                <Textarea 
                  placeholder="Competition Info (supports Markdown - How it works, Scoring, Rewards, etc.)" 
                  value={form.info} 
                  onChange={(e) => setForm({ ...form, info: e.target.value })} 
                  rows={8} 
                />
                <label className="text-sm font-medium">Start Date*</label>
                <Input type="datetime-local" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
                <label className="text-sm font-medium">End Date*</label>
                <Input type="datetime-local" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} />
                <label className="text-sm font-medium">Visibility</label>
                <Select value={form.visibility_type} onValueChange={(value) => setForm({ ...form, visibility_type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select visibility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Open</SelectItem>
                    <SelectItem value="custom">Custom (Join code)</SelectItem>
                  </SelectContent>
                </Select>
                {form.visibility_type === "custom" && (
                  <Input placeholder="Join Code" value={form.join_code} onChange={(e) => setForm({ ...form, join_code: e.target.value })} />
                )}
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateOrUpdate}>{editingComp ? "Update" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Competitions List */}
      <div className="space-y-4">
        {loading ? (
          <p>Loading competitions...</p>
        ) : (
          competitions.map((comp) => {
          const hasEnded = new Date(comp.end_date) < new Date();
          return (
            <div key={comp._id} className="p-4 border rounded-md bg-card shadow-sm flex flex-col gap-2">
              <div className="flex justify-between items-start">
                {/* Left Side */}
                <div>
                  <h3 className="font-semibold text-lg">{comp.name}</h3>
                  <p className="text-sm text-muted-foreground">{comp.description}</p>
                  <p className="text-sm">Type: {comp.type}</p>
                  <p className="text-sm">Visibility: {comp.visibility_type === "public" ? "Open" : "Custom"}</p>
                    
                    {comp.visibility_type === "custom" && comp.join_code && (
                      <p className="text-sm text-yellow-600 font-medium flex items-center gap-2">
                        Join Code: {comp.join_code}
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(comp.join_code);
                            toast.success("Join code copied!");
                          }}
                        >
                          Copy
                        </Button>
                      </p>
                    )}

                    <p className="text-sm">Prize: {comp.prize || "—"}</p>
                    <p className="text-sm">Prize Limit: {comp.prizeLimit || "—"}</p>
                    <p className="text-sm font-medium text-green-600">
                      Starts: {formatIST(comp.start_date)}
                    </p>
                    <p className="text-sm font-medium text-red-600">
                      Ends: {formatIST(comp.end_date)}
                    </p>
                    {comp.participants && (
                      <p className="text-sm text-blue-600">
                        Participants: {comp.participants.length}
                      </p>
                    )}

                    {/* ✅ Note if ended but winners not published */}
                    {hasEnded && !comp.published && (
                      <p className="text-yellow-600 text-sm mt-1">
                        ⚠️ Competition ended but winners are not published yet.
                      </p>
                    )}
                  </div>

                  {/* Right Side */}
                  <div className="flex flex-col gap-2 items-end">
                    <div className="font-medium text-primary">{getCountdown(comp.end_date)}</div>
                    <div className="flex flex-col gap-1">
                      <Button size="sm" variant="outline" onClick={() => handleEditClick(comp)}>Edit</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(comp._id)}>Delete</Button>
                      <Button size="sm" variant="secondary" onClick={() => navigate(`/admin/competition/${comp._id}`)}>View</Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CompetitionsManager;
