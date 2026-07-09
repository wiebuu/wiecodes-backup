import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Download, Mail, MessageCircle, Clock, Shield, CheckCircle } from 'lucide-react';
import { useScrollToTop, useScrollAnimation } from '@/hooks/useScrollAnimation';

const ShippingDelivery = () => {
  useScrollToTop();
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation();
  const { ref: sectionsRef, isVisible: sectionsVisible } = useScrollAnimation();

  return (
    <div className="min-h-screen animate-fade-in">
      <Header />

      <div className="content-overlay py-8">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div
            ref={heroRef}
            className={`text-center mb-8 px-4 scroll-fade-up ${heroVisible ? 'in-view' : ''}`}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-4xl font-heading font-bold text-primary mb-3 tracking-tight leading-tight">
              Shipping & Delivery
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-md sm:max-w-2xl mx-auto leading-relaxed">
              Instant digital delivery for all your template purchases. No waiting, no shipping costs.
            </p>
          </div>

          {/* Main Content */}
          <div ref={sectionsRef} className={`max-w-4xl mx-auto space-y-8 mb-8 scroll-fade-up ${sectionsVisible ? 'in-view' : ''}`}>
            
            {/* Instant Digital Delivery */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <Download className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-heading font-bold text-primary">
                  Instant Digital Delivery
                </h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                All templates on Wiecodes are digital products delivered instantly after purchase. No physical shipping required!
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Clock className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-green-800 mb-1">Instant Access</h3>
                  <p className="text-sm text-green-700">Available immediately after payment</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Shield className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-blue-800 mb-1">Secure Download</h3>
                  <p className="text-sm text-blue-700">Protected download links</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <CheckCircle className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-purple-800 mb-1">Lifetime Access</h3>
                  <p className="text-sm text-purple-700">Download anytime from your account</p>
                </div>
              </div>
            </div>

            {/* How It Works */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-heading font-bold text-primary mb-4">
                How Digital Delivery Works
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary mb-1">Complete Your Purchase</h3>
                    <p className="text-muted-foreground text-sm">
                      After successful payment, your order is automatically processed.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary mb-1">Receive Download Link</h3>
                    <p className="text-muted-foreground text-sm">
                      You'll receive an email with secure download links and access to your account dashboard.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary mb-1">Download & Use</h3>
                    <p className="text-muted-foreground text-sm">
                      Download your templates and start building immediately. Access is available 24/7 from your account.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* What You Receive */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-heading font-bold text-primary mb-4">
                What You Receive
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-primary mb-2">Template Files</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Complete source code
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Documentation & setup guides
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Dependencies list
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      License information
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-primary mb-2">Additional Resources</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Installation instructions
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Customization guides
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Support documentation
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Future updates (if applicable)
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Download Access */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-heading font-bold text-primary mb-4">
                Download Access & Storage
              </h2>
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-800 mb-2">Lifetime Access</h3>
                  <p className="text-blue-700 text-sm">
                    Once purchased, you have lifetime access to download your templates from your Wiecodes account dashboard.
                  </p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-800 mb-2">Multiple Downloads</h3>
                  <p className="text-green-700 text-sm">
                    Download your templates as many times as you need. Perfect for multiple devices or team members.
                  </p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h3 className="font-semibold text-purple-800 mb-2">Secure Storage</h3>
                  <p className="text-purple-700 text-sm">
                    Your purchased templates are securely stored and accessible 24/7 from your account.
                  </p>
                </div>
              </div>
            </div>

            {/* Support Section */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-heading font-bold text-primary mb-4">
                Need Help with Delivery?
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                If you haven't received your download link or are experiencing issues, we're here to help.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-primary" />
                  <div>
                    <h3 className="font-semibold text-primary">Email Support</h3>
                    <p className="text-sm text-muted-foreground">wiecodes@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <MessageCircle className="w-5 h-5 text-primary" />
                  <div>
                    <h3 className="font-semibold text-primary">WhatsApp Support</h3>
                    <p className="text-sm text-muted-foreground">+91 9193864135</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-heading font-bold text-primary mb-4">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="font-semibold text-primary mb-2">How long does delivery take?</h3>
                  <p className="text-sm text-muted-foreground">
                    Delivery is instant! You'll receive download links immediately after payment confirmation.
                  </p>
                </div>
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="font-semibold text-primary mb-2">What if I don't receive my download link?</h3>
                  <p className="text-sm text-muted-foreground">
                    Check your spam folder first. If you still don't see it, contact our support team and we'll resend it immediately.
                  </p>
                </div>
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="font-semibold text-primary mb-2">Can I download my templates multiple times?</h3>
                  <p className="text-sm text-muted-foreground">
                    Yes! You have unlimited downloads for all your purchased templates from your account dashboard.
                  </p>
                </div>
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="font-semibold text-primary mb-2">Do I need to pay for shipping?</h3>
                  <p className="text-sm text-muted-foreground">
                    No shipping costs! All templates are digital products delivered instantly via download links.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-primary mb-2">What if the download link expires?</h3>
                  <p className="text-sm text-muted-foreground">
                    Download links are valid for 30 days, but you can always access your templates from your account dashboard anytime.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ShippingDelivery; 