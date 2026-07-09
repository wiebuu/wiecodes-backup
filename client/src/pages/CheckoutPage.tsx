import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { useState } from 'react';

const CheckoutPage = () => {
  const { cart } = useCart();
  const navigate = useNavigate();

  const subtotal = cart.reduce((sum, item) => sum + (item.price || 0), 0);
  const tax = parseFloat((subtotal * 0.18).toFixed(2));
  const totalAmount = Math.round(subtotal + tax);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      toast.error('Please sign in to continue checkout');
      navigate('/signin');
      return;
    }

    if (!cart || cart.length === 0) {
      toast.error('🛒 Your cart is empty.');
      return;
    }

    setIsProcessing(true); // 👈 Start loading

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/purchase/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: totalAmount }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create Razorpay order');

      const razor = new (window as any).Razorpay({
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: 'INR',
        name: 'Wiecodes',
        description: 'Template Purchase',
        order_id: data.id,
        theme: { color: '#6366f1' },
        prefill: {
          email: localStorage.getItem('email') || '',
        },
        handler: async function (response: any) {
          const { razorpay_payment_id, razorpay_order_id } = response;

          try {
            const confirmRes = await fetch(
              `${import.meta.env.VITE_BACKEND_URL}/api/purchase/purchase-success`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            const confirmData = await confirmRes.json();
            if (!confirmRes.ok) throw new Error(confirmData.message || 'Failed to finalize purchase');

            toast.success('✅ Purchase successful. Templates unlocked!');
            navigate(`/payment-success?payment_id=${razorpay_payment_id}&order_id=${razorpay_order_id}`);
          } catch (err: any) {
            console.error('❌ Finalization error:', err);
            toast.error(err.message || 'Purchase completed, but failed to unlock templates.');
          }
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false); // 👈 Reset on cancel
          },
        },
      });

      razor.open();
    } catch (error: any) {
      console.error('❌ Payment Error:', error);
      toast.error(error.message || 'Something went wrong during checkout');
      setIsProcessing(false); // 👈 Reset on error
    }
  };



  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center px-4 bg-secondary/30 py-24">
        {isProcessing ? (
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-lg font-medium text-primary">Processing Payment...</p>
            <p className="text-sm text-muted-foreground">Please do not refresh or close this tab</p>
          </div>
        ) : (
          <div className="max-w-xl w-full bg-white rounded-xl shadow-md p-8 text-center space-y-6">
            <ShoppingBag className="w-12 h-12 text-primary mx-auto" />
            <h1 className="text-2xl font-bold text-primary">Checkout</h1>

            {cart.length === 0 ? (
              <p className="text-muted-foreground">Your cart is empty.</p>
            ) : (
              <>
                <ul className="text-left text-sm">
                  {cart.map((item) => (
                    <li key={item.id} className="mb-1">
                      <span className="font-medium">{item.title}</span> – ₹{item.price}
                    </li>
                  ))}
                </ul>
                <div className="text-right font-medium text-sm text-muted-foreground">
                  Subtotal: ₹{subtotal.toFixed(2)} <br />
                  GST (18%): ₹{tax.toFixed(2)}
                </div>
                <div className="text-right font-semibold text-lg text-primary">
                  Total: ₹{totalAmount}
                </div>
                <Button onClick={handlePayment} className="w-full" disabled={cart.length === 0}>
                  Pay & Download
                </Button>
              </>
            )}

            <Button
              variant="outline"
              onClick={() => navigate('/cart')}
              className="w-full"
            >
              Back to Cart
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CheckoutPage;
