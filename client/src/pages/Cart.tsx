import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2, ShoppingBag, Download, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import DownloadProgressModal from '@/components/DownloadProgressModal';

const Cart = () => {
  const { cart, removeFromCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showHelp, setShowHelp] = useState(false);
  const [downloadIndex, setDownloadIndex] = useState(0);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleRemove = async (templateId: string) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/users/cart/remove/${templateId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      removeFromCart(templateId);
    } catch (err) {
      console.error('Failed to remove item:', err);
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price || 0), 0);
  const tax = subtotal * 0.18;
  const total = subtotal + tax;
  const allFree = cart.length > 0 && cart.every(item => item.price === 0);

  const handleCheckout = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      toast.error('Please sign in to download templates');
      navigate('/signin');
      return;
    }

    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    if (allFree) {
      setDownloading(true);
      let successCount = 0;

      for (let i = 0; i < cart.length; i++) {
        setDownloadIndex(i + 1);

        const item = cart[i];

        try {
          const response = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/purchase/templates/${item.id}/purchase`,
            {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!response.ok) throw new Error('Failed to download ' + item.title);

          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);

          const a = document.createElement('a');
          a.href = url;
          a.download = `${item.title.replace(/\s+/g, '_')}.zip`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          window.URL.revokeObjectURL(url);

          successCount++;
        } catch (error) {
          console.error('❌ Download failed:', error);
          toast.error(`Failed to download ${item.title}`);
        }
      }

      setDownloading(false);

      if (successCount > 0) {
        toast.success(`✅ ${successCount} template${successCount > 1 ? 's' : ''} downloaded successfully`);
      }
    } else {
      localStorage.setItem('checkout_amount', total.toString());
      navigate('/checkout');
    }
  };



  const getImageUrl = (previewImageUrl: string) => {
    if (!previewImageUrl) return '/default-preview.png';
    if (previewImageUrl.startsWith('https://raw.githubusercontent.com/')) return previewImageUrl;
    if (previewImageUrl.startsWith('uploads/')) return `${import.meta.env.VITE_BACKEND_URL}/${previewImageUrl}`;
    return previewImageUrl;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <p className="industrial-label mb-4">YOUR CART</p>
              <h1 className="text-4xl font-bold text-foreground">
                Your Shopping Cart
              </h1>
            </div>

            {/* Approval Warning */}
            <div className="bg-surface border border-border rounded-[4px] p-5 mb-5 shadow-industrial-sm">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 mt-1 text-metallic-200" />
                <div>
                  <p className="font-medium mb-1 text-foreground">Important: Only Download Approved Templates</p>
                  <p className="text-sm mb-2 text-foreground-muted">
                    Please make sure the template you're downloading has an
                    <span className="text-metallic-200 font-semibold"> "approved"</span> tag on its detail
                    page. Unapproved templates may be incomplete or under review.
                  </p>
                  <p className="text-sm text-foreground-muted font-medium">
                    ⚠️ Reselling, redistributing, or claiming downloaded templates as your own is strictly
                    prohibited. Legal action may be taken against violators.
                  </p>
                </div>
              </div>
            </div>

            <DownloadProgressModal
              open={downloading}
              current={downloadIndex}
              total={cart.length}
              title="free templates"
            />

            {/* Full Functionality Info */}
            <Card className="bg-surface border border-border rounded-[4px] shadow-industrial-sm mb-10">
              <button
                onClick={() => setShowHelp(!showHelp)}
                className="flex items-center justify-between w-full px-4 py-3 text-left font-medium text-foreground hover:bg-surface-secondary transition rounded-t-[4px]"
              >
                <span className="flex items-center space-x-2">
                  <Info className="w-5 h-5 text-metallic-200" />
                  <span>Need full functionality? (backend + deployment)</span>
                </span>
                {showHelp ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>

              {showHelp && (
                <CardContent className="text-sm space-y-4 border-t border-border pt-4 px-4 pb-5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-surface border border-border rounded-[4px] p-4 shadow-industrial-sm">
                      <h4 className="font-medium text-foreground">Frontend Setup</h4>
                      <p className="text-sm text-foreground-muted">Starts at ₹499</p>
                    </div>
                    <div className="bg-surface border border-border rounded-[4px] p-4 shadow-industrial-sm">
                      <h4 className="font-medium text-foreground">Backend Integration</h4>
                      <p className="text-sm text-foreground-muted">Starts at ₹999</p>
                    </div>
                    <div className="bg-surface border border-border rounded-[4px] p-4 shadow-industrial-sm">
                      <h4 className="font-medium text-foreground">Full Stack + Deployment</h4>
                      <p className="text-sm text-foreground-muted">Starts at ₹1499</p>
                    </div>
                  </div>

                  <p className="mt-2">
                    <span className="font-semibold">Interested?</span>{' '}
                    <a
                      href="https://wa.me/9193864135"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-metallic-200 hover:text-metallic-100 underline"
                    >
                      WhatsApp us at +91 9193864 135
                    </a>
                  </p>

                  <div className="mt-4 space-y-2">
                    <details className="bg-surface rounded-[4px] border border-border px-4 py-2 text-sm shadow-industrial-sm">
                      <summary className="cursor-pointer font-medium">What’s included in full setup?</summary>
                      <p className="mt-2 text-foreground-muted">
                        Frontend polish, backend API setup, database integration (MongoDB/Firebase),
                        deployment (Vercel/Render), and basic admin panel if needed.
                      </p>
                    </details>

                    <details className="bg-surface rounded-[4px] border border-border px-4 py-2 text-sm shadow-industrial-sm">
                      <summary className="cursor-pointer font-medium">How long does it take?</summary>
                      <p className="mt-2 text-foreground-muted">
                        Usually 2–5 days depending on complexity. We’ll confirm timeline after you share the template.
                      </p>
                    </details>

                    <details className="bg-surface rounded-[4px] border border-border px-4 py-2 text-sm shadow-industrial-sm">
                      <summary className="cursor-pointer font-medium">Do I get support after delivery?</summary>
                      <p className="mt-2 text-foreground-muted">
                        Yes, we offer free bug fixes for 7 days and affordable ongoing support after that.
                      </p>
                    </details>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Cart Content */}
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-metallic-200"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-5">
                  {cart.length === 0 ? (
                    <div className="text-center text-foreground-muted text-lg py-12 bg-surface rounded-[4px] shadow-industrial-sm border border-border">
                      <p>Your cart is empty. Start exploring templates!</p>
                    </div>
                  ) : (
                    cart.map((item) => (
                      <Card
                        key={item.id}
                        className="hover:bg-surface-secondary cursor-pointer transition border border-border"
                        onClick={() => navigate(`/template/${item.id}`)}
                      >
                        <CardContent className="px-4 py-3">
                          <div className="flex items-start gap-3">
                            {/* Thumbnail */}
                            <img
                              src={getImageUrl(item.previewImageUrl)}
                              alt={item.title}
                              className="w-12 h-12 object-cover rounded-[4px] border border-border"
                            />

                            {/* Info Section */}
                            <div className="flex-1 space-y-1">
                              <div className="flex justify-between items-center">
                                <h3 className="text-sm font-medium text-foreground line-clamp-1">
                                  {item.title}
                                </h3>
                                <p className="text-sm font-bold text-foreground">
                                  ₹{item.price?.toLocaleString()}
                                </p>
                              </div>

                              <div className="flex justify-between items-center text-xs text-foreground-muted">
                                <span>{item.category}</span>

                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="text-destructive hover:text-destructive/80 hover:bg-surface-secondary"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemove(item.id);
                                  }}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>

                {/* Order Summary */}
                <div>
                  <Card className="border border-border shadow-industrial-sm sticky top-24 max-w-full sm:max-w-none mx-auto sm:mx-0 bg-surface">
                    <CardHeader className="px-4 sm:px-5 pt-4 pb-2">
                      <CardTitle className="text-lg sm:text-xl font-bold text-foreground">Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 sm:px-5 pb-5 pt-2 space-y-3 sm:space-y-4 text-sm sm:text-base">
                      <div className="flex justify-between text-foreground-muted">
                        <span>Subtotal</span>
                        <span>₹{subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-foreground-muted">
                        <span>Tax (GST 18%)</span>
                        <span>₹{tax.toLocaleString()}</span>
                      </div>
                      <div className="border-t border-border pt-3 sm:pt-4 flex justify-between font-semibold text-base sm:text-lg text-foreground">
                        <span>Total</span>
                        <span>₹{total.toLocaleString()}</span>
                      </div>

                      <Button
                        className="w-full mt-3 sm:mt-4"
                        onClick={handleCheckout}
                        disabled={cart.length === 0}
                      >
                        {allFree ? (
                          <>
                            <Download className="w-5 h-5 mr-2" />
                            Download Now
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-5 h-5 mr-2" />
                            Proceed to Checkout
                          </>
                        )}
                      </Button>

                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => navigate('/download')}
                      >
                        Your Downloaded Templates
                      </Button>
                    </CardContent>
                  </Card>

                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
