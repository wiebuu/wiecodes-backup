import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

const PaymentSuccess = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const paymentId = params.get('payment_id');
  const orderId = params.get('order_id');

  const handleGoToDownloads = () => {
    navigate('/download');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center bg-secondary/30 px-4 py-20">
        <div className="bg-white p-10 rounded-lg shadow text-center max-w-md w-full space-y-4">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
          <h1 className="text-2xl font-bold text-green-600">Payment Successful</h1>
          <p className="text-muted-foreground">
            Thank you for your purchase! Your templates will be available in your downloads.
          </p>

          <div className="text-left text-sm text-gray-700 mt-4 space-y-1">
            <p><strong>Payment ID:</strong> {paymentId}</p>
            <p><strong>Order ID:</strong> {orderId}</p>
          </div>

          <Button className="mt-6 w-full" onClick={handleGoToDownloads}>
            Go to Downloads
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentSuccess;
