
import React from 'react';
import { Check, Star, Crown, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const plans = [
  {
    name: "Starter",
    price: 999,
    period: "month",
    description: "Perfect for individual developers",
    icon: Zap,
    features: [
      "5 template downloads per month",
      "Basic support",
      "Personal license",
      "Access to free templates",
      "Community forum access"
    ],
    popular: false
  },
  {
    name: "Professional",
    price: 2499,
    period: "month",
    description: "Ideal for growing teams",
    icon: Star,
    features: [
      "25 template downloads per month",
      "Priority support",
      "Commercial license",
      "Access to all templates",
      "Advanced customization tools",
      "Team collaboration features"
    ],
    popular: true
  },
  {
    name: "Enterprise",
    price: 4999,
    period: "month",
    description: "For large organizations",
    icon: Crown,
    features: [
      "Unlimited downloads",
      "24/7 dedicated support",
      "Extended commercial license",
      "Custom template requests",
      "White-label solutions",
      "API access",
      "Advanced analytics"
    ],
    popular: false
  }
];

const Pricing = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h1 className="text-4xl lg:text-5xl font-heading font-bold text-primary mb-4 tracking-tight">
                Choose Your Plan
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Select the perfect subscription plan for your development needs
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {plans.map((plan) => {
                const IconComponent = plan.icon;
                return (
                  <Card 
                    key={plan.name} 
                    className={`elegant-card relative ${plan.popular ? 'ring-2 ring-primary shadow-lg scale-105' : ''}`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <span className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium">
                          Most Popular
                        </span>
                      </div>
                    )}
                    <CardHeader className="text-center pb-8">
                      <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                          <IconComponent className="w-8 h-8 text-primary" />
                        </div>
                      </div>
                      <CardTitle className="text-2xl font-heading font-bold">{plan.name}</CardTitle>
                      <p className="text-muted-foreground">{plan.description}</p>
                      <div className="mt-4">
                        <span className="text-4xl font-heading font-bold text-primary">
                          ₹{plan.price.toLocaleString()}
                        </span>
                        <span className="text-muted-foreground">/{plan.period}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3 mb-8">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center space-x-3">
                            <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button 
                        className={`w-full ${plan.popular ? 'classy-button' : ''}`}
                        variant={plan.popular ? 'default' : 'outline'}
                      >
                        Get Started
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="text-center mt-16">
              <p className="text-muted-foreground mb-4">
                All plans include 14-day free trial • Cancel anytime • No setup fees
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

export default Pricing;
