
import React from 'react';
import { Check, Star, Crown, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const plans = [
  {
    name: "Free",
    price: 0,
    period: "forever",
    description: "Get started with limited downloads",
    icon: Star,
    features: [
      "2 free template downloads",
      "Basic support",
      "Personal license only",
      "Community forum access"
    ],
    popular: false,
    current: true
  },
  {
    name: "Pro Monthly",
    price: 999,
    period: "month",
    description: "Perfect for active developers",
    icon: Crown,
    features: [
      "Unlimited free template downloads",
      "50% off on 2 paid templates",
      "Priority support",
      "Commercial license included",
      "Advanced customization tools"
    ],
    popular: true,
    current: false
  },
  {
    name: "Pro Plus",
    price: 1499,
    period: "month",
    description: "For power users and teams",
    icon: Zap,
    features: [
      "Unlimited free template downloads",
      "50% off on 5 paid templates",
      "Priority support",
      "Commercial license included",
      "Advanced customization tools",
      "Early access to new releases",
      "Team collaboration features"
    ],
    popular: false,
    current: false
  }
];

const Subscription = () => {
  return (
    <div className="min-h-screen animate-fade-in">
      <Header />
      <main>
        <section className="py-16 section-overlay-light">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h1 className="text-4xl lg:text-5xl font-heading font-bold text-primary mb-4 tracking-tight">
                Choose Your Subscription
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Unlock unlimited downloads and exclusive discounts with our Pro plans
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {plans.map((plan) => {
                const IconComponent = plan.icon;
                return (
                  <Card 
                    key={plan.name} 
                    className={`glass-card relative ${plan.popular ? 'ring-2 ring-primary shadow-xl scale-105' : ''} h-fit`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                          Most Popular
                        </span>
                      </div>
                    )}
                    <CardHeader className="text-center pb-6">
                      <div className="flex justify-center mb-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                          <IconComponent className="w-6 h-6 text-primary" />
                        </div>
                      </div>
                      <CardTitle className="text-xl font-heading font-bold">{plan.name}</CardTitle>
                      <p className="text-muted-foreground text-sm">{plan.description}</p>
                      <div className="mt-3">
                        <span className="text-3xl font-heading font-bold text-primary">
                          {plan.price === 0 ? 'Free' : `₹${plan.price.toLocaleString()}`}
                        </span>
                        {plan.price > 0 && <span className="text-muted-foreground text-sm">/{plan.period}</span>}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <ul className="space-y-2 mb-6">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button 
                        className={`w-full ${plan.popular ? 'classy-button' : ''}`}
                        variant={plan.current ? 'outline' : plan.popular ? 'default' : 'outline'}
                        disabled={plan.current}
                      >
                        {plan.current ? 'Current Plan' : 'Get Started'}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="text-center mt-12">
              <p className="text-muted-foreground mb-2">
                Cancel anytime • No setup fees • Instant activation
              </p>
              <p className="text-sm text-muted-foreground">
                Prices are in Indian Rupees (INR) and include applicable taxes
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Subscription;
