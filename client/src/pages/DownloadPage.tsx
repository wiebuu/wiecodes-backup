import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

type PurchasedTemplate = {
  _id: string;
  title: string;
  estimatedPrice: number;
  previewImageUrl?: string;
  framework?: string;
  githubRepo?: string; // ✅ Add this
};


const DownloadPage = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<PurchasedTemplate[]>([]);
  const [loadingIds, setLoadingIds] = useState<string[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('You must be logged in to view your downloads.');
          return navigate('/sign-in');
        }

        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const purchasedTemplates = res.data.purchasedTemplates || [];

        const enriched = purchasedTemplates
          .map((t: any) => ({
            _id: t._id,
            title: t.title,
            estimatedPrice: t.estimatedPrice,
            previewImageUrl: t.previewImageUrl,
            framework: t.framework,
            githubRepo: t.githubRepo || '', // ✅ Add this if needed
          }))

          .sort(
            (a, b) =>
              new Date(b.purchaseDate || '').getTime() - new Date(a.purchaseDate || '').getTime()
          );

        setTemplates(enriched);
      } catch (err) {
        console.error('❌ Failed to fetch templates:', err);
        toast.error('Could not load your downloads.');
      }
    };

    fetchTemplates();
  }, []);

  const handleDownload = async (templateId: string) => {
    const token = localStorage.getItem('token');

    if (!token) {
      toast.error('You must be logged in to download templates.');
      return navigate('/sign-in');
    }

    try {
      setLoadingIds((prev) => [...prev, templateId]);

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/purchase/templates/${templateId}/purchase`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: 'blob', // 👈 important for ZIP files
        }
      );

      const contentType = res.headers['content-type'] || '';
      if (!contentType.includes('application/zip')) {
        toast.error('Unexpected file type. Download failed.');
        return;
      }

      const blob = new Blob([res.data], { type: 'application/zip' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');

      const disposition = res.headers['content-disposition'] || '';
      const filename =
        disposition?.split('filename=')[1]?.replace(/"/g, '') ??
        `template-${templateId}.zip`;

      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('✅ Template downloaded!');
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 403) {
        toast.error('You do not have access to this template.');
      } else if (status === 404) {
        toast.error('Template not found or file missing.');
      } else {
        toast.error('Download failed. Please try again.');
      }
      console.error('❌ Download error:', err);
    } finally {
      setLoadingIds((prev) => prev.filter((id) => id !== templateId));
    }
  };


  const formatDate = (isoDate?: string) => {
    if (!isoDate) return null;
    return new Date(isoDate).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const filteredTemplates = templates.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  const paid = filteredTemplates.filter((t) => t.estimatedPrice > 0);
  const free = filteredTemplates.filter((t) => t.estimatedPrice === 0);

  return (
    <div className="min-h-screen py-16 bg-muted/10">
      <div className="container mx-auto px-4 max-w-3xl">

        {/* 🔙 Back Button */}
        <div className="mb-4">
          <Button
            variant="ghost"
            className="text-sm px-2 py-1"
            onClick={() => navigate(-1)}
          >
            ← Back
          </Button>
        </div>
        <h1 className="text-3xl font-bold text-primary mb-6">Download Your Templates</h1>

        <Input
          placeholder="Search templates..."
          className="mb-6 w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {filteredTemplates.length === 0 ? (
          <div className="bg-white p-6 rounded-md shadow text-center">
            <p className="text-muted-foreground text-sm mb-4">
              No templates available for download.
            </p>
            <Button onClick={() => navigate('/templates')} variant="secondary">
              Browse Templates
            </Button>
          </div>
        ) : (
          <>
            {paid.length > 0 && (
              <div className="mb-10">
                <h2 className="text-xl font-semibold mb-3">💸 Paid Downloads</h2>
                <div className="space-y-4">
                  {paid.map((item) => (
                    <div
                      key={item._id}
                      className="bg-white p-4 rounded-lg shadow flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        {item.previewImageUrl && (
                          <img
                            src={item.previewImageUrl}
                            alt={item.title}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <div>
                          <h3 className="font-medium text-lg text-foreground">{item.title}</h3>
                          <p className="text-sm text-muted-foreground">{item.framework}</p>
                          <p className="text-sm text-foreground font-medium mt-1">
                            ₹{item.estimatedPrice}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => handleDownload(item._id)}
                        disabled={loadingIds.includes(item._id)}
                      >
                        {loadingIds.includes(item._id) ? 'Downloading...' : 'Download ZIP'}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {free.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-3">🎁 Free Downloads</h2>
                <div className="space-y-4">
                  {free.map((item) => (
                    <div
                      key={item._id}
                      className="bg-white p-4 rounded-lg shadow flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        {item.previewImageUrl && (
                          <img
                            src={item.previewImageUrl}
                            alt={item.title}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <div>
                          <h3 className="font-medium text-lg text-foreground">{item.title}</h3>
                          <p className="text-sm text-muted-foreground">{item.framework}</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => handleDownload(item._id)}
                        disabled={loadingIds.includes(item._id)}
                      >
                        {loadingIds.includes(item._id) ? 'Downloading...' : 'Download ZIP'}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DownloadPage;
