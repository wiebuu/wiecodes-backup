import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  Edit,
  Trash2,
  Star,
  Download,
  Calendar,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

// Template type with seller populated
export type Template = {
  _id: string;
  title: string;
  uploadedBy: {
    _id: string;
    username: string;
    email?: string;
    rating?: number;
    reviewCount?: number;
  };
  framework: string;
  estimatedPrice: number;
  githubRepo?: string; // ✅ Add this line
  sales?: number;
  rating?: number;
  createdAt: string;
};


export default function AdminPublishedTemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { token, user } = useAuth(); // ✅ Get user info


  useEffect(() => {
    async function fetchTemplates() {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/templates/published`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (data.success && Array.isArray(data.templates)) {
          setTemplates(data.templates);
        } else {
          console.error("Failed to load templates:", data.message);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    }

    fetchTemplates();
  }, [token]);

  const confirmDelete = (id: string) => {
    setSelectedId(id);
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/templates/${selectedId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (data.success) {
        setTemplates((prev) => prev.filter((t) => t._id !== selectedId));
        toast.success("Template deleted successfully.");
      } else {
        toast.error("Delete failed: " + data.message);
      }
    } catch (err) {
      toast.error("Delete error.");
    } finally {
      setSelectedId(null);
      setDialogOpen(false);
    }
  };

  return (
    <div className="overflow-x-auto rounded-lg shadow">
      {templates.length === 0 ? (
        <div className="text-muted-foreground p-4">
          No published templates found.
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Template</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>GitHub Repo</TableHead>
                <TableHead>Framework</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Downloads</TableHead>
                <TableHead>Published</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {templates.map((template) => (
                <TableRow key={template._id}>
                  <TableCell className="font-medium">{template.title}</TableCell>
                  <TableCell>{template.uploadedBy?.email?.split("@")[0] || "Unknown"}</TableCell>
                  <TableCell>
                    {template.githubRepo ? (
                      <a
                        href={`https://github.com/${template.githubRepo}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        {template.githubRepo}
                      </a>
                    ) : (
                      <span className="text-muted-foreground text-sm">N/A</span>
                    )}
                  </TableCell>

                  <TableCell>
                    <Badge variant="outline">{template.framework}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {template.estimatedPrice === 0 ? "Free" : `₹${template.estimatedPrice}`}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{template.rating?.toFixed(1) ?? "-"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Download className="w-4 h-4 text-muted-foreground" />
                      <span>{template.sales ?? 0}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{new Date(template.createdAt).toLocaleDateString()}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Link to={`/template/${template._id}`}>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Link to={`/admin/template/${template._id}`}>
                        <Button
                          size="sm"
                          variant="outline"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>

                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive hover:text-destructive"
                        onClick={() => confirmDelete(template._id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* SINGLE Dialog OUTSIDE of .map */}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent>
              <p>Are you sure you want to delete this template?</p>
              <DialogFooter>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setDialogOpen(false);
                    setSelectedId(null);
                  }}
                >
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}
