import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, X } from "lucide-react";
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

type Template = {
  _id: string;
  title: string;
  description: string;
  estimatedPrice: number;
  framework: string;
  platform: string;
  theme: string;
  githubRepo: string;
  uploadType: string;
  previewImageUrl?: string;
  tags: string[];
  features: string[];
  techStack: string[];
  codePreview?: string;
  liveLink?: string;
  status: string;
  uploadedBy: {
    _id: string;
    username: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
};

export default function ReviewRequestsList() {
  const [pendingUploads, setPendingUploads] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);

  const { token, user } = useAuth(); // ✅ Get user info
  const navigate = useNavigate();


  const fetchPendingTemplates = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Authentication token missing');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/templates`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (data.success) {
        setPendingUploads(data.pendingUploads ?? []);
      } else {
        toast.error(data.message || 'Failed to load templates');
      }
    } catch (err) {
      toast.error('Server error while fetching templates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingTemplates();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        Loading pending templates...
      </div>
    );
  }

  // Helper function to get the correct image URL
  const getImageUrl = (previewImageUrl) => {
    if (!previewImageUrl) return '/default-preview.png';

    // If it's already a GitHub URL, use it directly
    if (previewImageUrl.startsWith('https://raw.githubusercontent.com/')) {
      return previewImageUrl;
    }

    // If it's a local file path, prepend the backend URL
    if (previewImageUrl.startsWith('uploads/')) {
      return `${import.meta.env.VITE_BACKEND_URL}/${previewImageUrl}`;
    }

    // Fallback for any other format
    return previewImageUrl;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {pendingUploads.length === 0 && (
        <p className="text-center col-span-full text-muted-foreground">
          No pending templates for review.
        </p>
      )}

      {pendingUploads.map((template) => (
        <Card key={template._id}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {template.title}
              <Badge variant="secondary" className="ml-2">
                New Upload
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {template.previewImageUrl && (
              <img
                src={getImageUrl(template.previewImageUrl)}
                alt={`${template.title} preview`}
                className="w-full h-40 object-cover rounded-md mb-4"
              />
            )}

            <p className="text-sm mb-2">{template.description}</p>

            <div className="mb-2 space-y-1 text-sm">
              <p><strong>Framework:</strong> {template.framework}</p>
              <p><strong>Platform:</strong> {template.platform}</p>
              <p><strong>Theme:</strong> {template.theme}</p>
              <p><strong>Upload Type:</strong> {template.uploadType}</p>
              <p>
                <strong>Link:</strong>{' '}
                <a
                  href={
                    template.uploadType === 'github'
                      ? `https://github.com/${template.githubRepo}`
                      : template.githubRepo
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {template.uploadType === 'github'
                    ? template.githubRepo
                    : template.githubRepo}
                </a>
              </p>

              <p><strong>Estimated Price:</strong> ₹{template.estimatedPrice}</p>
              <p><strong>Uploaded By:</strong> {template.uploadedBy.username} ({template.uploadedBy.email})</p>
            </div>

            <div className="flex gap-2 mt-4">
              <Button
                variant="destructive"
                className="flex-1"
                onClick={() => toast.info("Rejection endpoint not set for direct uploads.")}
              >
                <X className="w-4 h-4 mr-1" /> Reject
              </Button>
            </div>

            <Button
              variant="outline"
              className="w-full mt-2"
              onClick={() => navigate(`/admin/template/${template._id}`)}
            >
              <Eye className="w-4 h-4 mr-2" /> Manage Template
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
