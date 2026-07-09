import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Eye, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import { useToast } from '@/hooks/use-toast';
import { useSellerInitialLoad } from '@/contexts/SellerInitialLoadContext';
import SellerLoadingScreen from '@/components/SellerLoadingScreen';

const ManageTemplate = () => {
  const { isSellerInitialLoad, markSellerInitialLoadComplete } = useSellerInitialLoad();
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);

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
    status: '', // ✅ Added this
  });
  

  const [newScreenshot, setNewScreenshot] = useState('');

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/templates/${id}`);
        const data = await res.json();
        setTemplate(data);
        setFormData({
          title: data.title || '',
          description: data.description || '',
          estimatedPrice: data.estimatedPrice || '',
          category: data.category || '',
          framework: data.framework || '',
          theme: data.theme || 'Light',
          platform: data.platform || 'Web',
          tags: data.tags?.join(', ') || '',
          features: data.features?.join('\n') || '',
          techStack: data.techStack?.join(', ') || '',
          liveLink: data.liveLink || '',
          status: data.status || '', // ✅ Add this line
        });
        
      } catch (err) {
        toast({
          title: 'Error',
          description: 'Could not load template.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [id, toast]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };


  const handleDelete = async () => {
    const confirm = window.confirm('Are you sure you want to delete this template? This action cannot be undone.');
    if (!confirm) return;

    try {
      const token = localStorage.getItem('token'); // or wherever you store the JWT

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/templates/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete');

      toast({
        title: 'Template Deleted',
        description: 'Your template has been deleted successfully.',
        variant: 'destructive',
      });

      navigate('/seller/profile');
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to delete template.',
        variant: 'destructive',
      });
    }
  };

  const handleSubmitForReview = async () => {
    const { title, description, estimatedPrice, status } = formData;
  
    // Prevent duplicate submissions from frontend
    if (status === 'pending') {
      toast({
        title: 'Already Submitted',
        description: 'This template is already under review.',
        variant: 'default',
      });
      return;
    }
  
    if (!title || !description || !estimatedPrice) {
      toast({
        title: 'Missing Fields',
        description: 'Please fill in title, description, and estimated price.',
        variant: 'destructive',
      });
      return;
    }
  
    const token = localStorage.getItem('token');
  
    const reviewData = {
      title,
      description,
      estimatedPrice,
      category: formData.category,
      framework: formData.framework,
      theme: formData.theme,
      platform: formData.platform,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      features: formData.features.split('\n').map(f => f.trim()).filter(Boolean),
      techStack: formData.techStack.split(',').map(tech => tech.trim()).filter(Boolean),
      liveLink: formData.liveLink,
    };
  
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/templates/${id}/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });
  
      const responseData = await res.json();
  
      if (!res.ok) {
        console.error('Submit failed with status:', res.status);
        console.error('Response message:', responseData);
        throw new Error(responseData.message || 'Unknown error');
      }
  
      toast({
        title: 'Submitted for Review',
        description: 'Your template has been submitted for review.',
      });
  
      // Optionally update formData.status to "pending"
      setFormData(prev => ({ ...prev, status: 'pending' }));
  
    } catch (error: any) {
      console.error('Submission error:', error);
      toast({
        title: 'Submission Failed',
        description: error.message || 'Could not submit the template for review.',
        variant: 'destructive',
      });
    }
  };
  


  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading template...</p>
      </div>
    );
  }

  if (isSellerInitialLoad) {
    return <SellerLoadingScreen onLoadingComplete={markSellerInitialLoadComplete} />;
  }

  if (!template) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <p>Template not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/seller/profile">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Profile
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-foreground">Manage Template</h1>
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
          {/* Left: Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader><CardTitle className="text-foreground">Basic Information</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Template Title</Label>
                  <Input id="title" value={formData.title} onChange={(e) => handleInputChange('title', e.target.value)} />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)} rows={4} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                      <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="E-commerce">E-commerce</SelectItem>
                        <SelectItem value="Landing Page">Landing Page</SelectItem>
                        <SelectItem value="Dashboard">Dashboard</SelectItem>
                        <SelectItem value="Portfolio">Portfolio</SelectItem>
                        <SelectItem value="Blog">Blog</SelectItem>
                        <SelectItem value="Social Media">Social Media</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="estimatedPrice">Price</Label>
                    <Input id="estimatedPrice" value={formData.estimatedPrice} onChange={(e) => handleInputChange('estimatedPrice', e.target.value)} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Technical Info */}
            <Card>
              <CardHeader><CardTitle className="text-foreground">Technical Details</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="framework">Framework</Label>
                    <Select value={formData.framework} onValueChange={(value) => handleInputChange('framework', value)}>
                      <SelectTrigger><SelectValue placeholder="Select framework" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="React">React</SelectItem>
                        <SelectItem value="Vue">Vue</SelectItem>
                        <SelectItem value="Angular">Angular</SelectItem>
                        <SelectItem value="Next.js">Next.js</SelectItem>
                        <SelectItem value="HTML">HTML</SelectItem>
                        <SelectItem value="React Native">React Native</SelectItem>
                        <SelectItem value="Flutter">Flutter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="theme">Theme</Label>
                    <Select value={formData.theme} onValueChange={(value) => handleInputChange('theme', value)}>
                      <SelectTrigger><SelectValue placeholder="Select theme" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Light">Light</SelectItem>
                        <SelectItem value="Dark">Dark</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="platform">Platform</Label>
                    <Select value={formData.platform} onValueChange={(value) => handleInputChange('platform', value)}>
                      <SelectTrigger><SelectValue placeholder="Select platform" /></SelectTrigger>
                      <SelectContent>
                      <SelectItem value="Desktop">Desktop</SelectItem>
                        <SelectItem value="Web">Web</SelectItem>
                        <SelectItem value="Mobile">Mobile</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="tags">Tags</Label>
                  <Input id="tags" value={formData.tags} onChange={(e) => handleInputChange('tags', e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="techStack">Tech Stack</Label>
                  <Input id="techStack" value={formData.techStack} onChange={(e) => handleInputChange('techStack', e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="liveLink">Live Demo URL</Label>
                  <Input id="liveLink" value={formData.liveLink} onChange={(e) => handleInputChange('liveLink', e.target.value)} />
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardHeader><CardTitle className="text-foreground">Features</CardTitle></CardHeader>
              <CardContent>
                <Label htmlFor="features">Features (one per line)</Label>
                <Textarea id="features" rows={6} value={formData.features} onChange={(e) => handleInputChange('features', e.target.value)} />
              </CardContent>
            </Card>
          </div>

          {/* Right: Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <Card>
              <CardHeader><CardTitle className="text-foreground">Template Status</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between"><span className="text-foreground-muted">Status:</span><Badge variant="secondary">{template.status}</Badge></div>
                  <div className="flex justify-between"><span className="text-foreground-muted">Sales:</span><span className="text-foreground">{template.sales ?? 0}</span></div>
                  <div className="flex justify-between"><span className="text-foreground-muted">Rating:</span><span className="text-foreground">{template.rating ?? 0}/5</span></div>
                </div>
              </CardContent>
            </Card>

            {/* Screenshot */}
            <Card>
              <CardHeader><CardTitle className="text-foreground">Current Preview</CardTitle></CardHeader>
              <CardContent>
                <img src={`${import.meta.env.VITE_BACKEND_URL}/${template.previewImageUrl}` || '/default-preview.png'} alt={template.title} className="w-full h-32 object-cover rounded-[4px] mb-4 border border-border" />
                <Label htmlFor="newScreenshot">Update Screenshot URL</Label>
                <Input id="newScreenshot" value={newScreenshot} onChange={(e) => setNewScreenshot(e.target.value)} />
                <Button variant="outline" size="sm" className="w-full mt-2">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload New Screenshot
                </Button>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader><CardTitle className="text-foreground">Actions</CardTitle></CardHeader>
              <CardContent className="space-y-2">
              <Button onClick={handleSubmitForReview} disabled={formData.status === 'pending'}>
                {formData.status === 'pending' ? 'Under Review' : 'Submit for Review'}
              </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageTemplate;
