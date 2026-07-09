import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { Card, CardContent } from '@/components/ui/card';
import { Target, Users, TrendingUp, Award, Globe, Shield } from 'lucide-react';
import useScrollToTop from '@/hooks/useScrollToTop';
import { useState, useEffect } from 'react';
import { useSellerInitialLoad } from '@/contexts/SellerInitialLoadContext';
import SellerLoadingScreen from '@/components/SellerLoadingScreen';

const SellerAbout = () => {
  useScrollToTop();
  const { isSellerInitialLoad, markSellerInitialLoadComplete } = useSellerInitialLoad();
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation();
  const { ref: missionRef, isVisible: missionVisible } = useScrollAnimation();
  const { ref: valuesRef, isVisible: valuesVisible } = useScrollAnimation();

  const GOALS = {
    activeSellers: 4000,
    templatesSold: 20000,
    payouts: 5000000, // in INR
  };

  const values = [
    {
      title: "Quality First",
      icon: Award,
      description: "We maintain the highest standards for all templates on our platform."
    },
    {
      title: "Fair Earnings",
      icon: TrendingUp,
      description: "Competitive commission rates that reward your hard work and creativity."
    },
    {
      title: "Global Reach",
      icon: Globe,
      description: "Access to developers and businesses from around the world."
    },
    {
      title: "Secure Platform",
      icon: Shield,
      description: "Your intellectual property and earnings are protected with enterprise-grade security."
    },
    {
      title: "Community Driven",
      icon: Users,
      description: "A supportive community of sellers helping each other succeed."
    },
    {
      title: "Innovation Focus",
      icon: Target,
      description: "Always evolving to provide the best tools and features for sellers."
    }
  ];

  const [goalStats, setGoalStats] = useState<{
    activeSellers: number;
    templatesSold: number;
    payouts: number;
  } | null>(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/analytics/goal-stats`)
      .then(res => res.json())
      .then(setGoalStats)
      .catch(err => console.error("Failed to fetch goal stats:", err));
  }, []);

  const formatINRGoal = (amount: number) => {
    if (amount >= 1_00_00_000) {
      return `₹${(amount / 1_00_00_000).toFixed(1)}Cr+`;
    } else if (amount >= 1_00_000) {
      return `₹${(amount / 1_00_000).toFixed(1)}L+`;
    } else {
      return `₹${amount.toLocaleString()}+`;
    }
  };

  if (isSellerInitialLoad) {
    return <SellerLoadingScreen onLoadingComplete={markSellerInitialLoadComplete} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-8">
        <div className="container mx-auto px-4">
{/* Hero Section */}
<div
  ref={heroRef}
  className={`text-center mb-12 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} transition-all duration-700`}
>
  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-2 tracking-tight leading-snug sm:leading-tight">
    About WIECODES
  </h1>

  <p className="text-sm sm:text-base text-foreground-muted mb-4 sm:mb-6">
    Built for indie creators. Powered by purpose.
  </p>

  <p className="text-base sm:text-lg text-foreground-muted max-w-[90%] sm:max-w-3xl mx-auto leading-relaxed">
    Empowering developers to monetize their creativity through our premium template marketplace. <br className="hidden sm:block" />
    We handle the hard parts — you focus on building great products.
  </p>
</div>


          {/* Mission Section */}
          <div
            ref={missionRef}
            className={`max-w-4xl mx-auto mb-16 ${missionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} transition-all duration-700`}
          >
            <Card className="shadow-industrial-sm hover:shadow-industrial transition-all duration-300 border border-border bg-surface">
              <CardContent className="p-8 text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 sm:mb-6 industrial-label">
                Our Mission
              </h2>

              <p className="text-base sm:text-lg text-foreground-muted leading-relaxed max-w-[90%] sm:max-w-3xl mx-auto">
                Wiecodes was born from a simple idea — to give independent developers and students like us
                a real way to earn from our side projects, without needing to be marketers, designers, or influencers.
                <br className="hidden sm:block" /><br className="hidden sm:block" />

                We believe great templates shouldn't get buried just because someone doesn’t know SEO or pricing tricks.
                At Wiecodes, we handle that. You just build. We showcase it to the world.
                <br className="hidden sm:block" /><br className="hidden sm:block" />

                Our mission is to become the most trusted, creator-friendly template marketplace —
                where even one repo can help you build passive income, credibility, and freedom.
              </p>


                {goalStats && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                    {/* Sellers */}
                    <div className="text-center p-4 rounded-[4px] border border-border bg-surface-secondary">
                      <div className="text-2xl font-bold text-foreground mb-1">
                        {GOALS.activeSellers.toLocaleString()}+
                      </div>
                      <div className="text-foreground-muted mb-1">Active Users</div>
                      <div className="text-xs text-foreground-muted mb-1">
                        {Math.round((goalStats.activeSellers / GOALS.activeSellers) * 100)}% to goal
                      </div>
                      <div className="w-full h-1 bg-surface rounded-[4px]">
                        <div
                          className="h-full bg-metallic-300 rounded-[4px]"
                          style={{ width: `${Math.min(100, (goalStats.activeSellers / GOALS.activeSellers) * 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Templates Sold */}
                    <div className="text-center p-4 rounded-[4px] border border-border bg-surface-secondary">
                      <div className="text-2xl font-bold text-foreground mb-1">
                        {GOALS.templatesSold.toLocaleString()}+
                      </div>
                      <div className="text-foreground-muted mb-1">Templates Sold</div>
                      <div className="text-xs text-foreground-muted mb-1">
                        {Math.round((goalStats.templatesSold / GOALS.templatesSold) * 100)}% to goal
                      </div>
                      <div className="w-full h-1 bg-surface rounded-[4px]">
                        <div
                          className="h-full bg-metallic-300 rounded-[4px]"
                          style={{ width: `${Math.min(100, (goalStats.templatesSold / GOALS.templatesSold) * 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Payouts */}
                    <div className="text-center p-4 rounded-[4px] border border-border bg-surface-secondary">
                      <div className="text-2xl font-bold text-foreground mb-1">
                        {formatINRGoal(GOALS.payouts)}
                      </div>
                      <div className="text-foreground-muted mb-1">Paid to Sellers</div>
                      <div className="text-xs text-foreground-muted mb-1">
                        {Math.round((goalStats.payouts / GOALS.payouts) * 100)}% to goal
                      </div>
                      <div className="w-full h-1 bg-surface rounded-[4px]">
                        <div
                          className="h-full bg-metallic-300 rounded-[4px]"
                          style={{
                            width: `${Math.min(100, (goalStats.payouts / GOALS.payouts) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>

                  </div>
                )}


              </CardContent>
            </Card>
          </div>


          {/* Values Section */}
          <div ref={valuesRef} className={`${valuesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} transition-all duration-700`}>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-3 sm:mb-4 px-4 industrial-label">
              Built Different — Here’s Why Sellers Love WIECODES
            </h2>
            <p className="text-sm sm:text-base text-foreground-muted text-center mb-8 sm:mb-12 max-w-[90%] sm:max-w-2xl mx-auto px-4">
              We're committed to providing the best platform for template sellers with these core values.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {values.map((value, index) => (
                <Card key={index} className="hover:scale-105 hover:shadow-industrial transition-all duration-300 border border-border shadow-industrial-sm bg-surface">
                  <CardContent className="p-6 text-center">
                    <div className="inline-flex p-3 bg-surface-secondary rounded-[4px] mb-4 shadow-industrial-sm border border-border">
                      <value.icon className="w-6 h-6 text-metallic-200" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{value.title}</h3>
                    <p className="text-foreground-muted text-sm">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <div className="mt-16 text-center">
            <Card className="max-w-2xl mx-auto shadow-industrial-sm hover:shadow-industrial transition-all duration-300 border border-border bg-surface">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-foreground mb-4 industrial-label">Let’s Build Together</h2>
                <p className="text-foreground-muted mb-6">
                  Got questions, ideas, or feedback? Our team is just one message away.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center justify-center space-x-3 p-3 rounded-[4px] hover:bg-surface-secondary transition-all duration-300 border border-border">
                    <span className="font-semibold text-foreground">Email:</span>
                    <span className="text-foreground-muted">wiecodes@gmail.com</span>
                  </div>
                  <div className="flex items-center justify-center space-x-3 p-3 rounded-[4px] hover:bg-surface-secondary transition-all duration-300 border border-border">
                    <span className="font-semibold text-metallic-200">WhatsApp:</span>
                    <span className="text-foreground-muted">
                      <a
                        href="https://chat.whatsapp.com/HgB59qUe7po6q4FDl462cY?mode=ems_copy_h_c"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                      >
                        Join our community
                      </a>
                    </span>
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

export default SellerAbout;
