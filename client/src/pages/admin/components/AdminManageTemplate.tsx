import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Eye, Upload, Save, CheckCircle, Clock } from 'lucide-react';

import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner'; // ✅ Updated
import { Switch } from '@/components/ui/switch';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useScrollToTop } from '@/hooks/useScrollAnimation';

const ManageTemplate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuth(); // ✅ Get user info
  useScrollToTop();



  const [loading, setLoading] = useState(true);
  const [template, setTemplate] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);


  const [formData, setFormData] = useState({
    title: '',
    description: '',
    estimatedPrice: '',
    category: '',
    framework: '',
    theme: 'Light',
    platform: 'Web',
    tags: '',
    features: '',
    techStack: '',
    liveLink: '',
    githubRepo: '',
    codePreview: '',
    color: '',
    isFree: false,
    isFeatured: false,
    previewImageUrl: '', // ✅ ADD THIS LINE
    stars: 0, // ✅ NEW: Stars for competition
  });


  const [newScreenshot, setNewScreenshot] = useState('');


  useEffect(() => {
    if (!id) {
      toast.error('Template ID is missing');
      setLoading(false);
      return;
    }

    const fetchTemplate = async () => {
      try {
        const token = localStorage.getItem('token'); // or get from your auth context

        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/templates/${id}`, {
          headers: token
            ? {
              Authorization: `Bearer ${token}`,
            }
            : {},
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Failed to fetch template');
        }

        const data = await res.json();

        setTemplate(data);

        setFormData({
          title: data.title || '',
          description: data.description || '',
          estimatedPrice: data.estimatedPrice?.toString() || '',
          category: data.category || '',
          framework: data.framework || '',
          theme: data.theme || 'Light',
          platform: data.platform || 'Web',
          tags: data.tags?.join(', ') || '',
          features: data.features?.join('\n') || '',
          techStack: data.techStack?.join(', ') || '',
          liveLink: data.liveLink || '',
          githubRepo: data.githubRepo || '',
          codePreview: data.codePreview || '',
          color: data.color || '',
          isFree: data.isFree || false,
          isFeatured: data.isFeatured || false,
          previewImageUrl: data.previewImageUrl || '', // ✅ ADD THIS LINE
          stars: data.stars || 0, // ✅ NEW: Stars for competition
        });

      } catch (err) {
        toast.error(`Could not load template. ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [id]);


  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    const isFree = formData.isFree;
    const numericPrice = isFree ? 0 : Number(formData.estimatedPrice.trim());

    if (!isFree && isNaN(numericPrice)) {
      toast.error('Please enter a valid number for price or type "Free".');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/templates/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          githubRepo: formData.githubRepo,
          codePreview: formData.codePreview, // ✅ included here
          estimatedPrice: numericPrice,
          isFree,
          stars: formData.stars, // ✅ NEW: Stars for competition
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
          techStack: formData.techStack.split(',').map(tech => tech.trim()).filter(Boolean),
          features: formData.features.split('\n').map(f => f.trim()).filter(Boolean),
          preview: newScreenshot || template.preview,
        }),
      });

      if (!response.ok) throw new Error('Failed to update');

      toast.success('Template updated successfully');
    } catch (err) {
      toast.error('Failed to update template');
      console.error('handleSave error:', err);
    }
  };




  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this template?')) return;

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Authorization token not found');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/templates/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete');

      toast.success('Template deleted successfully');
      navigate('/admin');
    } catch {
      toast.error('Failed to delete template');
    }
  };

  const handlePreviewUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select an image first');
      return;
    }

    const formData = new FormData();
    formData.append('previewImage', selectedFile);

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/templates/upload/preview/${id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to upload image');
      }

      toast.success('Preview image updated');
      setNewScreenshot(data.template.previewImageUrl);
    } catch (err: any) {
      console.error('Upload error:', err.message);
      toast.error('Failed to upload preview image');
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading template...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/admin">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Manage Template</h1>
          </div>
          <div className="flex space-x-2">
            <Link to={`/template/${template._id}`}>
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
            </Link>
            <Button variant="destructive" size="sm" onClick={handleDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <InputSection label="Template Title" value={formData.title} onChange={e => handleInputChange('title', e.target.value)} />
                <TextareaSection label="Description" value={formData.description} onChange={e => handleInputChange('description', e.target.value)} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SelectSection label="Category" value={formData.category} onValueChange={val => handleInputChange('category', val)} items={['Admin Panel', 'Agency',
                    'Authentication',
                    'Blog',
                    'Coming Soon',
                    'Consulting',
                    'Course',
                    'Crypto',
                    'Dashboard',
                    'Documentation',
                    'E-commerce',
                    'Error Page',
                    'Event',
                    'Fitness',
                    'Forms',
                    'Forum',
                    'Gamified App',          // 🆕 Typing sites like Monkeytype can be gamified
                    'Healthcare',
                    'Landing Page',
                    'Learning App',          // 🆕 Typing site is a self-learning tool
                    'Magazine',
                    'Mobile App',
                    'Music',
                    'NFT',
                    'Non-Profit',
                    'Other',                 // For anything niche or experimental
                    'Photography',
                    'Portfolio',
                    'Practice App',          // 🆕 Directly maps to Monkeytype-style typing practice
                    'Pricing Page',
                    'Productivity Tool',     // 🆕 Typing = boosting productivity
                    'Real Estate',
                    'Restaurant',
                    'Resume',
                    'SaaS Product',
                    'Skill Builder',         // 🆕 Typing skill development
                    'Social Media',
                    'Speed Test',            // 🆕 WPM tracking
                    'Startup',
                    'Typing Test',           // 🆕 Direct, most accurate category
                    'Travel',
                    'Wedding',]} />
                  <InputSection label="Price" value={formData.estimatedPrice} onChange={e => handleInputChange('estimatedPrice', e.target.value)} />
                  <InputSection
                    label="Link"
                    value={formData.githubRepo}
                    onChange={(e) => handleInputChange('githubRepo', e.target.value)}
                  />
                  <InputSection label="Live Demo URL" value={formData.liveLink} onChange={e => handleInputChange('liveLink', e.target.value)} />

                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Technical Details</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <SelectSection label="Framework" value={formData.framework} onValueChange={val => handleInputChange('framework', val)} items={['Angular', 'Astro', 'Bootstrap', 'Django', 'Express.js', 'Flutter', 'Gatsby', 'HTML', 'Laravel', 'Next.js', 'Nuxt.js', 'React', 'React Native', 'Remix', 'Ruby on Rails', 'Svelte', 'Tailwind CSS', 'Vue', 'Other']} />
                  <SelectSection label="Theme" value={formData.theme} onValueChange={val => handleInputChange('theme', val)} items={['Light', 'Dark', 'Both']} />
                  <SelectSection label="Platform" value={formData.platform} onValueChange={val => handleInputChange('platform', val)} items={['Android', 'Cross-platform', 'Desktop', 'iOS', 'Mobile', 'Tablet', 'TV', 'Web', 'Wearables', 'Other']} />
                </div>

                <SelectSection
                  label="Quality Color"
                  value={formData.color}
                  onValueChange={(val) => handleInputChange('color', val)}
                  items={['Gold', 'Blue', 'Green', 'Orange']}
                />
                <TextareaSection
                  label="File Structure (as tree)"
                  value={formData.codePreview}
                  onChange={(e) => handleInputChange('codePreview', e.target.value)}
                  rows={6}
                />

                <InputSection label="Tags (comma separated)" value={formData.tags} onChange={e => handleInputChange('tags', e.target.value)} />
                <InputSection label="Tech Stack (comma separated)" value={formData.techStack} onChange={e => handleInputChange('techStack', e.target.value)} />
                <InputSection label="Competition Stars" value={formData.stars.toString()} onChange={e => handleInputChange('stars', Number(e.target.value))} />
                {/* ✅ New GitHub Repo Link Input */}
                <TextareaSection label="Features (one per line)" value={formData.features} onChange={e => handleInputChange('features', e.target.value)} rows={6} />

              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Template Status</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between"><span>Status:</span><Badge variant="secondary">{template.status}</Badge></div>
                  <div className="flex justify-between"><span>Sales:</span><span>{template.sales || 0}</span></div>
                  <div className="flex justify-between"><span>Rating:</span><span>{template.rating || 0}/5</span></div>
                  <div className="flex items-center justify-between">
                    <span>Is Free?</span>
                    <Switch
                      checked={formData.isFree}
                      onCheckedChange={(val) => handleInputChange('isFree', val)}
                    />
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <span>Featured?</span>
                    <Switch
                      checked={formData.isFeatured}
                      onCheckedChange={(val) => handleInputChange('isFeatured', val)}
                    />
                  </div>


                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preview Image</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Current Preview */}
                  {formData.previewImageUrl && (
                    <img
                      src={formData.previewImageUrl}
                      alt="Preview"
                      className="w-full max-h-64 object-contain rounded-md border shadow"
                    />
                  )}

                  {/* File Input */}
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  />

                  {/* Upload Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={async () => {
                      if (!selectedFile) {
                        toast.error('No file selected');
                        return;
                      }

                      const MAX_FILE_SIZE = 25 * 1024 * 1024;
                      if (selectedFile.size > MAX_FILE_SIZE) {
                        const fileSizeMB = (selectedFile.size / (1024 * 1024)).toFixed(2);
                        toast.error(`File too large: ${fileSizeMB}MB (max 25MB)`);
                        return;
                      }

                      try {
                        // Convert image to base64
                        const base64Content = await new Promise<string>((resolve, reject) => {
                          const reader = new FileReader();
                          reader.onload = () => {
                            const result = reader.result as string;
                            resolve(result.split(',')[1]); // Strip metadata
                          };
                          reader.onerror = reject;
                          reader.readAsDataURL(selectedFile);
                        });

                        const timestamp = Date.now();
                        const ext = selectedFile.name.split('.').pop() || 'png';
                        const fileName = `template-${id}-${timestamp}.${ext}`;
                        const pathInRepo = `screenshots/${fileName}`;

                        // GitHub config
                        const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;
                        const GITHUB_OWNER = import.meta.env.VITE_GITHUB_OWNER;
                        const GITHUB_REPO = import.meta.env.VITE_GITHUB_REPO;

                        if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
                          throw new Error('Missing GitHub environment config');
                        }

                        // Upload to GitHub
                        const githubRes = await fetch(
                          `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${pathInRepo}`,
                          {
                            method: 'PUT',
                            headers: {
                              Authorization: `token ${GITHUB_TOKEN}`,
                              'Content-Type': 'application/json',
                              Accept: 'application/vnd.github.v3+json',
                            },
                            body: JSON.stringify({
                              message: `Add screenshot for template ${id}`,
                              content: base64Content,
                              branch: 'main',
                            }),
                          }
                        );

                        const githubData = await githubRes.json();
                        if (!githubRes.ok) {
                          throw new Error(githubData.message || 'GitHub upload failed');
                        }

                        // Raw image URL
                        const imageUrl = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/main/${pathInRepo}`;

                        // Update backend
                        const backendRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/templates/${id}`, {
                          method: 'PUT',
                          headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                          },
                          body: JSON.stringify({
                            previewImageUrl: imageUrl,
                          }),
                        });

                        if (!backendRes.ok) {
                          const text = await backendRes.text();
                          console.error('Backend error:', text);
                          throw new Error('Failed to update backend with image URL');
                        }

                        // Update local state
                        setFormData((prev) => ({ ...prev, previewImageUrl: imageUrl }));
                        setTemplate((prev: any) => ({ ...prev, previewImageUrl: imageUrl }));
                        setSelectedFile(null);
                        toast.success('Preview uploaded successfully to GitHub');
                      } catch (err: any) {
                        console.error(err);
                        toast.error(err.message || 'Upload failed');
                      }
                    }}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload to GitHub
                  </Button>
                </div>
              </CardContent>
            </Card>


            <Card>
              <CardHeader><CardTitle>Actions</CardTitle></CardHeader>
              <CardContent>
                <Button onClick={handleSave} className="w-full">
                  <Save className="w-4 h-4 mr-2" /> Save Changes
                </Button>
                <Button
                  onClick={async () => {
                    try {
                      const isApproved = template.status === 'approved';
                      const newStatus = isApproved ? 'pending' : 'approved';

                      let response;
                      if (isApproved) {
                        // If currently approved, set back to pending
                        response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/templates/${id}`, {
                          method: 'PUT',
                          headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                          },
                          body: JSON.stringify({ status: 'pending' }),
                        });
                      } else {
                        // If pending, approve it
                        response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/templates/${id}/approve`, {
                          method: 'PUT',
                          headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                          },
                        });
                      }

                      if (!response.ok) throw new Error(`Failed to ${isApproved ? 'set as pending' : 'approve'} template`);

                      toast.success(`Template ${newStatus} successfully`);
                      setTemplate(prev => ({ ...prev, status: newStatus }));

                      // Only navigate if moving to approved state
                      if (newStatus === 'approved') {
                        navigate('/admin?tab=reviews');
                      }
                    } catch {
                      toast.error(`Failed to ${template.status === 'approved' ? 'set as pending' : 'approve'} template`);
                    }
                  }}
                  className={`w-full ${template.status === 'approved'
                    ? 'bg-yellow-600 hover:bg-yellow-700'
                    : 'bg-green-600 hover:bg-green-700'
                    } text-white mt-2`}
                >
                  {template.status === 'approved' ? (
                    <>
                      <Clock className="w-4 h-4 mr-2" />
                      Set as Pending
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve Template
                    </>
                  )}
                </Button>



              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable form components
const InputSection = ({ label, value, onChange }: any) => (
  <div>
    <Label>{label}</Label>
    <Input value={value} onChange={onChange} />
  </div>
);

const TextareaSection = ({ label, value, onChange, rows = 4 }: any) => (
  <div>
    <Label>{label}</Label>
    <Textarea value={value} onChange={onChange} rows={rows} />
  </div>
);

const SelectSection = ({ label, value, onValueChange, items }: any) => (
  <div>
    <Label>{label}</Label>
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger><SelectValue placeholder={`Select ${label}`} /></SelectTrigger>
      <SelectContent>
        {items.map((item: string) => (
          <SelectItem key={item} value={item}>{item}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

export default ManageTemplate;
