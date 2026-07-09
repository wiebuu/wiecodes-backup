// TemplateInfo.tsx

import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, easeInOut } from 'framer-motion';
import {
  Star, Video, Eye, ArrowLeft, ShoppingCart, Share2, Check, X, ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useScrollToTop } from '@/hooks/useScrollAnimation';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import Linkify from 'linkify-react';
import CommentsSection, { Comment } from '../components/CommentSection';
import TemplateStoryLayout from "@/components/TemplateStoryLayout";

const TemplateInfo = () => {
  useScrollToTop();
  const { id } = useParams();
  const [template, setTemplate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [suggestedTemplates, setSuggestedTemplates] = useState<any[]>([]);
  const { setCartFromServer } = useCart();
  const [copied, setCopied] = useState(false);
  const templateLink = `${import.meta.env.VITE_FRONTEND_URL}/template/${id}`;
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userRating, setUserRating] = useState<number>(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [userHasDownloaded, setUserHasDownloaded] = useState(false);
  const [averageRating, setAverageRating] = useState<number>(template?.averageRating || 0);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";
  const [isStoryOpen, setIsStoryOpen] = useState(false);

  useEffect(() => {
    const fetchTemplate = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${backendUrl}/api/templates/${id}`);
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || "Failed to fetch template");
        }
        const data = await res.json();
        setTemplate(data);
        setAverageRating(data.averageRating ?? 0);
        setUserHasDownloaded(true);

      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [id, backendUrl]);

  const fetchComments = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/comments/${id}`);
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Failed to fetch comments:", errorText);
        setComments([]);
        return;
      }

      const data = await res.json();

      const token = localStorage.getItem("token");
      let userIdFromToken = null;
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          userIdFromToken = payload.id;
          setCurrentUserId(payload.id);
        } catch (e) {
          console.error("Error decoding token:", e);
        }
      }

      const transformedComments: Comment[] = data.map((c: any) => ({
        id: c._id,
        userName: c.user?.username || "Unknown",
        userId: c.user?._id || null,
        rating: c.rating,
        text: c.text,
        isVerified: c.verifiedDownload ?? false,
        canDelete: c.user?._id === userIdFromToken
      }));

      setComments(transformedComments);

      if (transformedComments.length > 0) {
        const avg =
          transformedComments.reduce((acc, c) => acc + c.rating, 0) /
          transformedComments.length;
        setAverageRating(avg);
      } else {
        setAverageRating(0);
      }
    } catch (error) {
      console.error("Network or other error fetching comments:", error);
      setComments([]);
    }
  };

  useEffect(() => {
    if (id) fetchComments();
  }, [id]);

  const deleteComment = async (commentId: string) => {
    if (!id) return;

    try {
      const res = await fetch(`${backendUrl}/api/comments/${id}/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (res.ok) {
        setComments(prevComments => prevComments.filter(c => c.id !== commentId));
        toast.success("Comment deleted successfully");
      } else {
        const errorText = await res.text();
        console.error('Failed to delete comment:', errorText);
        toast.error("Failed to delete comment");
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error("Error deleting comment");
    }
  };

  const submitCommentToBackend = async (rating: number, text: string) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${backendUrl}/api/comments/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ rating, text }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Failed to submit comment:", errorText);
      throw new Error("Failed to submit comment");
    }

    await fetchComments();
  };

  const linkifyOptions = {
    target: '_blank',
    rel: 'noopener noreferrer',
    className: 'text-metallic-200 hover:text-metallic-100',
  };

  useEffect(() => {
    const fetchTemplateAndSuggestions = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/templates/${id}`);
        const data = await res.json();

        if (!res.ok) {
          setError(data.message || 'Template not found');
          return;
        }

        setTemplate(data);

        const token = localStorage.getItem('token');
        if (token && data.ratings && Array.isArray(data.ratings)) {
          const decoded = JSON.parse(atob(token.split('.')[1]));
          const existing = data.ratings.find((r: any) => r.user === decoded._id);
          if (existing) setUserRating(existing.value);
        }

        if (token) {
          const userRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const userData = await userRes.json();
          if (userRes.ok) setUserRole(userData.role);
        }

        const suggestionsRes = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/templates/${id}/suggestions`
        );
        const suggestionsData = await suggestionsRes.json();
        if (suggestionsRes.ok && Array.isArray(suggestionsData)) {
          setSuggestedTemplates(suggestionsData.filter((t) => t && t._id));
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (err) {
        console.error(err);
        setError('Failed to load template');
      } finally {
        setLoading(false);
      }
    };

    fetchTemplateAndSuggestions();
  }, [id]);

  if (loading) return <div className="text-center mt-20 text-foreground-muted">Loading...</div>;
  if (error || !template) return <div className="text-center mt-20 text-destructive">{error || 'Template not found'}</div>;

  const handleRating = async (value: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return toast.error('You must be logged in to rate.');

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/templates/${id}/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ value }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success('Rating submitted!');
        setUserRating(value);
        setTemplate((prev) => ({ ...prev, averageRating: data.averageRating }));
      } else {
        toast.error('Failed to submit rating', { description: data.message });
      }
    } catch (error) {
      console.error('Rating error:', error);
      toast.error('Network error while submitting rating');
    }
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(templateLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      fallbackCopyToClipboard(templateLink);
    }
  };

  const fallbackCopyToClipboard = (text) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Fallback copy failed:', error);
    }
    document.body.removeChild(textArea);
  };

  const handleAddToCart = async () => {
    if (!template || !template._id) return toast.error('Template not loaded yet');
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ templateId: template._id }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCartFromServer(
          data.cart.map((item: any) => ({
            id: item.template._id,
            title: item.template.title,
            price: item.template.estimatedPrice,
            previewImageUrl: item.template.previewImageUrl,
            category: item.template.framework,
            quantity: item.quantity,
          }))
        );
        toast.success(`${template.title} added to cart`);
      } else {
        toast.error('Failed to add to cart', { description: data.message || 'Try again later.' });
      }
    } catch (err) {
      toast.error('Network error', { description: 'Please try again later.' });
    }
  };

  const getImageUrl = (previewImageUrl: string) => {
    if (!previewImageUrl) return '/default-preview.png';
    if (previewImageUrl.startsWith('https://raw.githubusercontent.com/')) return previewImageUrl;
    if (previewImageUrl.startsWith('uploads/')) return `${import.meta.env.VITE_BACKEND_URL}/${previewImageUrl}`;
    return previewImageUrl;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-8">
        <div className="container mx-auto px-4 mb-8">
          <Link
            to="/templates"
            className="flex flex-col items-center justify-center gap-1 sm:flex-row sm:justify-start sm:items-center text-foreground-muted hover:text-foreground focus-visible:text-foreground active:text-foreground px-3 py-2 rounded-[4px] transition-colors duration-200 text-xs sm:text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Back to Templates</span>
          </Link>
        </div>

        <motion.section
          className="container mx-auto px-4 mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: easeInOut }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative group">
                <a
                  href={template.liveLink}
                  target="_blank"
                  rel="noreferrer"
                  className="block"
                >
                  <img
                    src={getImageUrl(template.previewImageUrl)}
                    alt={`${template.title} preview`}
                    className="w-full h-48 sm:h-80 object-cover rounded-[4px] shadow-industrial-sm transition-all duration-300 group-hover:shadow-industrial"
                  />

                  <div className="absolute inset-0 bg-foreground/5 opacity-0 group-hover:opacity-100 group-active:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300 rounded-[4px]" />

                  <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:flex">
                    <Button className="pointer-events-auto text-sm h-8 px-3 rounded-[4px]">
                      <Eye className="w-4 h-4 mr-1" />
                      Preview
                    </Button>
                  </div>
                </a>
              </div>

              <Card>
                <CardContent className="p-2 sm:p-6">
                  <h3 className="text-xs sm:text-base font-semibold mb-1 sm:mb-2 industrial-label">
                    FILE STRUCTURE
                  </h3>
                  <pre className="bg-surface-secondary p-2 sm:p-3 rounded-[4px] overflow-x-auto text-[10px] sm:text-sm leading-relaxed sm:leading-loose max-h-40 sm:max-h-64 border border-border text-foreground-muted">
                    <code>
                      {template.codePreview || '// No File Structure available'}
                    </code>
                  </pre>
                </CardContent>
              </Card>

              <CommentsSection
                comments={comments}
                averageRating={averageRating}
                userHasDownloaded={userHasDownloaded}
                currentUserId={currentUserId}
                onSubmit={submitCommentToBackend}
                onDelete={deleteComment}
              />

            </motion.div>

            <motion.div className="space-y-6" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
              <div>

                <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 sm:mt-4">
                  {template.title}
                </h1>

                <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
                  {(template.tags || []).map((tag: string) => (
                    <Badge key={tag} variant="secondary" className="text-xs sm:text-sm">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex sm:hidden flex-wrap justify-between items-center gap-2 text-[11px]">
                  <div className="flex flex-wrap items-center gap-1">
                    <span className="text-foreground-muted font-medium font-mono">{template.framework}</span>
                    <Badge variant="outline">
                      {template.theme}
                    </Badge>
                    <Badge>
                      {template.platform}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-0.5">
                      <Star
                        className="w-3.5 h-3.5 fill-metallic-200 text-metallic-200"
                      />
                      <span className="font-semibold">
                        {template.averageRating?.toFixed(1) || '0.0'}
                      </span>
                      <span className="text-foreground-muted">
                        ({template.ratings?.length || 0})
                      </span>
                    </div>

                    <span className="text-foreground-muted whitespace-nowrap">
                      {template.sales} downloads
                    </span>

                    <Badge
                      variant={template.status === 'approved' ? 'default' : template.status === 'pending' ? 'secondary' : 'outline'}
                    >
                      {template.status}
                    </Badge>
                  </div>
                </div>

                <div className="hidden sm:flex flex-wrap sm:items-center sm:justify-between sm:gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-foreground-muted font-medium font-mono">{template.framework}</span>
                    <Badge variant="outline">
                      {template.theme}
                    </Badge>
                    <Badge>
                      {template.platform}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-metallic-200 text-metallic-200" />
                      <span className="font-semibold">
                        {template.averageRating?.toFixed(1) || '0.0'}
                      </span>
                      <span className="text-foreground-muted">
                        ({template.ratings?.length || 0})
                      </span>
                    </div>

                    <span className="text-foreground-muted">{template.sales} downloads</span>

                    <Badge
                      variant={template.status === 'approved' ? 'default' : template.status === 'pending' ? 'secondary' : 'outline'}
                    >
                      {template.status}
                    </Badge>
                  </div>
                </div>

                {(userRole === 'admin' || userRole === 'reviewer') && (
                  <div className="mt-4 sm:mt-6">
                    <h4 className="text-sm font-semibold mb-2 text-foreground-muted industrial-label">
                      RATE THIS TEMPLATE
                    </h4>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className="w-5 h-5 cursor-pointer transition-transform hover:scale-110"
                          onClick={() => handleRating(star)}
                          style={{
                            fill: userRating >= star ? 'var(--metallic-200)' : 'var(--border)',
                            color: userRating >= star ? 'var(--metallic-200)' : 'var(--border)',
                          }}
                        />
                      ))}
                      {userRating > 0 && (
                        <span className="ml-2 text-sm text-foreground-muted">You rated: {userRating}/5</span>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 mt-6 mb-4 sm:mb-8 p-4 sm:p-6 bg-surface border border-border rounded-[4px]">
                  <div>
                    <span
                      className={`text-lg sm:text-3xl font-bold ${template.isFree === true ? 'text-metallic-100' : 'text-foreground'}`}
                    >
                      {template.isFree ? 'Free' : `₹${template.estimatedPrice}`}
                    </span>
                    <span className="text-foreground-muted ml-2 text-xs sm:text-sm">one-time purchase</span>
                  </div>

                  <div className="flex flex-wrap justify-end gap-2">
                    <Button
                      onClick={handleCopyToClipboard}
                      variant="ghost"
                      size="icon"
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-[4px] border border-border"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                      ) : (
                        <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                    </Button>

                    {template.liveLink && (
                      <a
                        href={template.liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-9 h-9 sm:w-10 sm:h-10 rounded-[4px]"
                        >
                          <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
                        </Button>
                      </a>
                    )}

                    {template.uploadType === "affiliate" ? (
                      <a
                        href={template.githubRepo}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          className="px-2.5 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm bg-metallic-300 hover:bg-metallic-200"
                        >
                          Buy on {template.tags?.[0] || "External Site"}
                        </Button>
                      </a>
                    ) : (
                      <>
                        <Button
                          onClick={handleAddToCart}
                          className="px-2.5 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm"
                        >
                          Add to Cart
                          <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
                        </Button>

                        <Link to="/cart">
                          <Button
                            onClick={handleAddToCart}
                            variant="outline"
                            className="px-2.5 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm"
                          >
                            Buy Now
                          </Button>
                        </Link>
                      </>
                    )}
                  </div>
                </div>

                <p className="text-foreground-muted text-sm sm:text-lg leading-relaxed mb-6 sm:mb-8">
                  <Linkify options={linkifyOptions}>
                    {template.description.split('\n').map((line, index) => (
                      <span key={index}>
                        {line}
                        <br />
                      </span>
                    ))}
                  </Linkify>
                </p>

              </div>

              <div className="flex flex-col sm:flex-col gap-4 sm:gap-0 md:gap-0 lg:gap-0 xs:flex-row">
                <Card className="flex-1">
                  <CardContent className="p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 industrial-label">
                      FEATURES INCLUDED
                    </h3>
                    <ul className="space-y-2 sm:space-y-3">
                      {(template.features || []).map((feature: string, index: number) => (
                        <li key={index} className="flex items-start space-x-2 sm:space-x-3">
                          <div className="w-2 h-2 bg-metallic-300 rounded-[4px] mt-2 flex-shrink-0" />
                          <span className="text-foreground-muted text-sm sm:text-base">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="flex-1">
                  <CardContent className="p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 industrial-label">
                      TECHNOLOGY STACK
                    </h3>
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {(template.techStack || []).map((tech: string) => (
                        <Badge key={tech} className="bg-metallic-300 text-foreground">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>

          {suggestedTemplates.length > 0 && (
            <section className="mt-16">
              <div className="text-center mb-12">
                <p className="industrial-label mb-4">SIMILAR TEMPLATES</p>
                <h2 className="text-3xl font-heading font-bold text-foreground">
                  Similar Templates You Might Like
                </h2>
              </div>

              <div
                className="flex space-x-4 overflow-x-auto px-4 sm:px-8 scrollbar-thin snap-x snap-mandatory"
                style={{ scrollPaddingLeft: '1rem', scrollPaddingRight: '1rem' }}
                role="list"
              >
                {Array.from(
                  new Map(suggestedTemplates.map(t => [t._id, t])).values()
                )
                  .slice(0, 10)
                  .map((template, index) => (
                    <Link
                      key={template._id}
                      to={`/template/${template._id}`}
                      className="snap-start flex-shrink-0 w-72 sm:w-80"
                      role="listitem"
                    >
                      <Card
                        className="group cursor-pointer"
                        tabIndex={-1}
                      >
                        <CardContent className="p-0">
                          <div className="relative overflow-hidden rounded-t-[4px]">
                            <img
                              src={getImageUrl(template.previewImageUrl)}
                              alt={template.title}
                              className="w-full h-28 sm:h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.onerror = null;
                                target.src = "/default-preview.png";
                              }}
                            />
                            <Button
                              size="sm"
                              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 md:group-hover:opacity-100 transition-all duration-500 px-2 py-1 text-xs sm:px-4 sm:py-2 sm:text-sm"
                            >
                              <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                              View
                            </Button>
                          </div>
                          <div className="p-3 sm:p-6 space-y-2 sm:space-y-4">
                            <div className="flex justify-between items-center">
                              <h3 className="text-sm sm:text-lg font-semibold text-foreground line-clamp-1">
                                {template.title}
                              </h3>
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-metallic-200 text-metallic-200" />
                                <span className="text-xs sm:text-sm font-medium">
                                  {(template.averageRating ?? 4.5).toFixed(1)}
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-1 sm:gap-2">
                              {(template.tags || []).slice(0, 3).map((tag: string) => (
                                <Badge
                                  key={tag}
                                  variant="outline"
                                  className="text-[10px] sm:text-xs"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            {template.features?.length > 0 && (
                              <ul className="text-xs sm:text-sm text-foreground-muted list-disc list-inside space-y-1">
                                {template.features.slice(0, 3).map((feature: string, i: number) => (
                                  <li key={i}>{feature}</li>
                                ))}
                              </ul>
                            )}
                            <div className="flex justify-between items-center mt-1 sm:mt-2">
                              <span
                                className={`text-base sm:text-xl font-bold ${
                                  template.isFree ? 'text-metallic-100' : 'text-foreground'
                                }`}
                              >
                                {template.isFree ? 'Free' : `₹${template.estimatedPrice}`}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
              </div>
            </section>
          )}

        </motion.section>
      </main>
      <Footer />
    </div>
  );
};

export default TemplateInfo;
