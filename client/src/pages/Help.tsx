import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Mail, MessageCircle } from 'lucide-react';
import { useScrollToTop, useScrollAnimation } from '@/hooks/useScrollAnimation';

const Help = () => {
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
            className={`text-center mb-6 px-4 scroll-fade-up ${heroVisible ? 'in-view' : ''}`}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-4xl font-heading font-bold text-primary mb-3 tracking-tight leading-tight">
              Help Center
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-md sm:max-w-2xl mx-auto leading-relaxed">
              Get the support you need. We're here to help you succeed — whether you're a buyer, developer, or creator.
            </p>
          </div>


          {/* Help Sections */}
          <div ref={sectionsRef} className={`max-w-4xl mx-auto space-y-8 mb-8 scroll-fade-up ${sectionsVisible ? 'in-view' : ''}`}>
            {/* Documentation */}
            <div
              id="documentation"
              className="bg-white rounded-lg p-4 sm:p-6 shadow-sm"
            >
              <h2 className="text-xl sm:text-2xl font-heading font-bold text-primary mb-3 sm:mb-4">
                Documentation
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-3 sm:mb-4">
                Access detailed guides to help you get started with Wiecodes templates. From quick-start tutorials to code structure explanations, we’ve made it easy.
              </p>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-3 sm:mb-4">
                Whether you're learning or launching a real product, our documentation is written for both beginners and pros.
              </p>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Updated frequently and open-source — you can contribute too via our GitHub documentation repo.
              </p>
            </div>


            {/* Help Center */}
            <div
              id="help-center"
              className="bg-white rounded-lg p-4 sm:p-6 shadow-sm"
            >
              <h2 className="text-xl sm:text-2xl font-heading font-bold text-primary mb-3 sm:mb-4">
                Help Center
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-3 sm:mb-4">
                Have a question or facing an issue? Explore our FAQs and guides sorted by category: installation, GitHub collaboration, free vs paid templates, licensing, billing, and more.
              </p>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-3 sm:mb-4">
                We focus on self-serve help so you can get solutions fast — with clear explanations, working examples, and no jargon.
              </p>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Still stuck? Reach out to our support team directly below.
              </p>
            </div>


            {/* Contact Us */}
            <div id="contact-us" className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-heading font-bold text-primary mb-3 sm:mb-4">
                Contact Us
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-3 sm:mb-4">
                Need personalized assistance? We're here to help.
              </p>
              <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="text-sm sm:text-base font-semibold text-primary">Email Support:</div>
                  <div className="text-sm sm:text-base text-muted-foreground">
                    wiecodes@gmail.com – We typically reply within 24 hours.
                  </div>
                </div>
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="text-sm sm:text-base font-semibold text-primary">Phone Support:</div>
                  <div className="text-sm sm:text-base text-muted-foreground">
                    +91 9193864135 – Mon–Fri, 10AM–4PM IST
                  </div>
                </div>
              </div>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                For technical issues, please include browser version, OS, steps to reproduce, and a screenshot if possible.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
                {/* Privacy Policy */}
                <div id="privacy-policy" className="flex-1 bg-white rounded-lg p-6 shadow-sm">
                  <h2 className="text-2xl font-heading font-bold text-primary mb-4">Privacy Policy</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    At Wiecodes, your privacy is our priority. This policy outlines how we collect, use, and safeguard your personal data when you engage with our platform.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    We only collect the information required to operate effectively — such as your name, email address, GitHub username (if you're a seller), analytics for platform improvement, and payment-related data for transactions.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    We never sell or share your personal data with third parties. All sensitive data is protected using industry-standard encryption and stored securely.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    You may request to access, update, or permanently delete your account and data by contacting our privacy team at <a href="mailto:wiecodes@gmail.com" className="text-primary underline">wiecodes@gmail.com</a>.
                  </p>
                </div>

                {/* Terms of Service */}
                <div id="terms-of-service" className="flex-1 bg-white rounded-lg p-6 shadow-sm">
                  <h2 className="text-2xl font-heading font-bold text-primary mb-4">Terms of Service</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    By using Wiecodes, you agree to these terms of service. Our platform connects creators and buyers through a GitHub-based template system designed to ensure quality, security, and fair use.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Templates purchased on Wiecodes are licensed for both personal and commercial use. Buyers may modify and use templates in client work or projects, but reselling the original template files or redistributing them outside your organization is strictly prohibited.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Sellers agree to collaborate with Wiecodes via GitHub and allow us to manage listing quality, pricing, and SEO optimization to improve sales. Sellers retain ownership of their original code, and we handle distribution rights while they’re hosted on the platform.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    We reserve the right to suspend accounts for misuse, fraud, plagiarism, or abuse of the refund system. All disputes should first be reported via our support channels for a fair resolution.
                  </p>
                </div>
              </div>

            {/* Refund Policy */}
            <div id="refund-policy" className="bg-white rounded-2xl p-6 shadow-md border border-muted">
              <h2 className="text-3xl font-bold font-heading text-primary mb-4">Refund Policy</h2>

              <p className="text-muted-foreground leading-relaxed mb-6">
                We want you to feel confident when purchasing templates from Wiecodes. If you're not satisfied, we offer an
                <span className="text-green-700 font-semibold"> ~85% cashback guarantee</span>.
              </p>

              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                <h3 className="text-lg font-semibold text-green-800 mb-1">~85% Cashback Policy</h3>
                <p className="text-green-700 text-sm">
                  Request a refund within 7 days of purchase with a valid reason. You'll receive ~85% of the amount back —
                  15% covers platform and transaction processing fees.
                </p>
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-semibold text-primary mb-2">Refund Conditions:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Requests must be made within 7 days of purchase.</li>
                  <li>Buyers must provide a valid and specific reason (e.g., bugs, doesn't match demo).</li>
                  <li>~85% of the amount will be refunded to the original payment method.</li>
                  <li>Wiecodes retains 15% to cover transaction and platform costs.</li>
                  <li>Refunds will be credited in your account within 5–7 days.</li>
                </ul>
              </div>

              <p className="text-muted-foreground leading-relaxed mb-4">
                To request a refund, contact us with your order details and reason:
              </p>

              <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  Email: <a href="mailto:wiecodes@gmail.com" className="text-primary underline">wiecodes@gmail.com</a>
                </li>
                <li className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-primary" />
                  WhatsApp: <a href="https://wa.me/9193864135" target="_blank" rel="noopener noreferrer" className="text-primary underline">+91 9193864135</a>
                </li>
              </ul>

              <p className="text-sm text-muted-foreground">
                Every request is reviewed carefully to ensure fairness. Abuse of the refund policy may result in account suspension.
              </p>
            </div>

          </div>

          {/* Additional Resources */}
          {/* <div className="bg-secondary/50 rounded-lg p-4 text-center">
            <h3 className="text-xl font-heading font-bold text-primary mb-3">
              Still Need Help?
            </h3>
            <p className="text-muted-foreground mb-4 max-w-xl mx-auto text-sm">
              Can’t find what you’re looking for? Check out our community discussions or deep-dive articles.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button className="bg-white text-primary border border-primary/20 hover:bg-primary/5 px-4 py-2 rounded text-sm transition-colors">
                Community Forum
              </button>
              <button className="bg-white text-primary border border-primary/20 hover:bg-primary/5 px-4 py-2 rounded text-sm transition-colors">
                Knowledge Base
              </button>
            </div>
          </div> */}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Help;