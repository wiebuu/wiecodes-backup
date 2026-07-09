import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { Card, CardContent } from '@/components/ui/card';
import {
  HelpCircle,
  Upload,
  DollarSign,
  MessageCircle,
  FileText,
  GitBranch,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';
import useScrollToTop from '@/hooks/useScrollToTop';
import { useSellerInitialLoad } from '@/contexts/SellerInitialLoadContext';
import SellerLoadingScreen from '@/components/SellerLoadingScreen';

const SellerHelp = () => {
  useScrollToTop();
  const { isSellerInitialLoad, markSellerInitialLoadComplete } = useSellerInitialLoad();
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation();
  const { ref: sectionsRef, isVisible: sectionsVisible } = useScrollAnimation();

  const helpSections = [
    {
      title: 'Getting Started',
      icon: HelpCircle,
      content:
        'To begin, simply add our GitHub account as a collaborator to your repo, then fill out the short submission form with details. No file uploads needed.',
    },
    {
      title: 'Template Submission',
      icon: Upload,
      content:
        'Suggest a title, description, and tags — we’ll refine the content for SEO, handle pricing, and list the template for you.',
    },
    {
      title: 'Earnings & Payments',
      icon: DollarSign,
      content:
        'You earn ~80–85% commission on each sale. Payments are processed weekly, directly to your bank account or PayPal once the ₹ threshold is met.',
    },
    {
      title: 'Marketing & Optimization',
      icon: FileText,
      content:
        'We promote top templates via homepage, and socials. Prices and tags are optimized regularly to boost visibility.',
    },
    {
      title: 'Community & Support',
      icon: MessageCircle,
      content:
        'You’re never alone — reach out to our support or join our seller Discord for guidance, collaboration, and real-time updates.',
    },
    {
      title: 'Control',
      icon: RefreshCw,
      content:
        "Changed your mind? You're free to delete your template anytime. We respect your choice — no strings attached.",
    },
    {
      title: 'Security & Ownership',
      icon: ShieldCheck,
      content:
        'Your repo stays untouched. We just fork it to list and deploy — you keep full control.',
    },
    {
      title: 'Version Control Support',
      icon: GitBranch,
      content:
        'We support version-based releases. Update your GitHub repo anytime — we’ll handle the rest automatically.',
    },
  ];

  if (isSellerInitialLoad) {
    return <SellerLoadingScreen onLoadingComplete={markSellerInitialLoadComplete} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="py-8">
        <div className="container mx-auto px-4">
          <div ref={heroRef} className={`text-center mb-8 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} transition-all duration-700`}>
            <h2 className="industrial-label mb-4">SELLER HELP</h2>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-2 sm:mb-4 tracking-tight">
              Help Center
            </h1>
            <p className="text-sm sm:text-lg text-foreground-muted max-w-md sm:max-w-2xl mx-auto">
              Everything you need to know to succeed as a seller on WIECODES.
            </p>
          </div>


          <div ref={sectionsRef} className={`max-w-5xl mx-auto ${sectionsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} transition-all duration-700 delay-200`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {helpSections.map((section, index) => (
                <Card key={index} className="bg-surface border border-border shadow-industrial-sm hover:shadow-industrial transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-surface-secondary rounded-[4px] border border-border">
                        <section.icon className="w-6 h-6 text-metallic-200" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">{section.title}</h3>
                        <p className="text-foreground-muted text-sm">{section.content}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* FAQ Section */}
            <Card className="bg-surface border border-border shadow-industrial-sm">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6 text-center industrial-label">
                  FREQUENTLY ASKED QUESTIONS
                </h2>
                <div className="space-y-6">
                  <div className="p-4 rounded-[4px] bg-surface-secondary border border-border">
                    <h3 className="font-semibold text-foreground mb-2">Who controls pricing?</h3>
                    <p className="text-foreground-muted">
                      Pricing is set by the WIECODES team after reviewing template quality, depth, and competition. You can suggest a price range.
                    </p>
                  </div>
                  <div className="p-4 rounded-[4px] bg-surface-secondary border border-border">
                    <h3 className="font-semibold text-foreground mb-2">Can I remove my template later?</h3>
                    <p className="text-foreground-muted">
                      Yes. You may delete or delist your template at any time. All access is revoked instantly and it’s removed from public view.
                    </p>
                  </div>
                  <div className="p-4 rounded-[4px] bg-surface-secondary border border-border">
                    <h3 className="font-semibold text-foreground mb-2">How do reviews work?</h3>
                    <p className="text-foreground-muted">
                      Only verified buyers can leave a review. No bots, no spam — just real, valuable feedback to build trust.
                    </p>
                  </div>
                  <div className="p-4 rounded-[4px] bg-surface-secondary border border-border">
                    <h3 className="font-semibold text-foreground mb-2">What if I need help?</h3>
                    <p className="text-foreground-muted">
                      Email wiecodes@gmail.com or join our seller Discord for quick assistance.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SellerHelp;
