import React from 'react';
import { Heart, Users, Award, Target, MessageCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useScrollToTop, useScrollAnimation } from '@/hooks/useScrollAnimation';

const About = () => {
  useScrollToTop();
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation();
  const { ref: valuesRef, isVisible: valuesVisible } = useScrollAnimation();
  const { ref: storyRef, isVisible: storyVisible } = useScrollAnimation();
  const { ref: companyRef, isVisible: companyVisible } = useScrollAnimation();

  return (
    <div className="min-h-screen animate-fade-in">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="py-8 bg-gradient-to-br from-white via-secondary/20 to-accent/30">
          <div className="container mx-auto px-4">
            <div
              ref={heroRef}
              className={`max-w-3xl mx-auto text-center scroll-fade-up ${
                heroVisible ? 'in-view' : ''
              }`}
            >
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-primary mb-3 sm:mb-4 tracking-tight">
                About WIECODES
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-normal sm:leading-relaxed mb-3 sm:mb-4">
  Wiecodes is a creator-first platform and digital services company where developers and
  designers sell templates, share UI kits, and deliver professional web and mobile app
  development services.
</p>

<p className="text-xs sm:text-sm lg:text-base text-muted-foreground leading-normal sm:leading-relaxed mb-3 sm:mb-4">
  We provide ready-to-use templates and build custom websites, SaaS platforms, dashboards,
  and mobile apps for startups, creators, and businesses seeking clean, scalable, and
  practical solutions.
</p>


              <div className="flex items-center justify-center space-x-3 p-3 rounded-lg hover:bg-gradient-to-r hover:from-primary/5 hover:to-accent/5 transition-all duration-300">
                <span className="font-semibold text-green-600">WhatsApp:</span>
                <span className="text-muted-foreground">
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
          </div>
        </section>

        {/* Mission & Values */}
        <section className="py-8 bg-white">
          <div className="container mx-auto px-4">
            {/* Mission Statement */}
            <div className="max-w-xl mx-auto text-center mb-6">
              <h2 className="text-lg sm:text-xl font-heading font-semibold text-primary mb-2">
                Our Mission
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-normal">
                Empowering creators and small teams with clean, affordable templates that just work, while
                delivering solid web and app development services that keep things simple, fast, and effective.
              </p>
            </div>

            {/* Values Grid */}
            <div
              ref={valuesRef}
              className={`grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 scroll-scale ${
                valuesVisible ? 'in-view' : ''
              }`}
            >
              {/* Card 1 */}
              <Card className="elegant-card text-center">
                <CardContent className="p-3 sm:p-4">
                  <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <h3 className="text-base sm:text-lg font-heading font-semibold text-primary mb-1">
                    Verified Quality
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Every template and every client project is reviewed and optimized for performance, UX, and
                    clean implementation.
                  </p>
                </CardContent>
              </Card>

              {/* Card 2 */}
              <Card className="elegant-card text-center">
                <CardContent className="p-3 sm:p-4">
                  <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <h3 className="text-base sm:text-lg font-heading font-semibold text-primary mb-1">
                    Support Indie Devs
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    We feature, promote, and help independent creators earn fairly with low commission and
                    real client opportunities.
                  </p>
                </CardContent>
              </Card>

              {/* Card 3 */}
              <Card className="elegant-card text-center">
                <CardContent className="p-3 sm:p-4">
                  <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Award className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <h3 className="text-base sm:text-lg font-heading font-semibold text-primary mb-1">
                    Real Reviews
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Only verified buyers and clients can leave reviews, keeping feedback clear, relevant, and
                    spam-free.
                  </p>
                </CardContent>
              </Card>

              {/* Card 4 */}
              <Card className="elegant-card text-center">
                <CardContent className="p-3 sm:p-4">
                  <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Target className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <h3 className="text-base sm:text-lg font-heading font-semibold text-primary mb-1">
                    Client & Buyer First
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    We tune pricing, tags, and scopes to match real needs so both buyers and service clients
                    get exactly what fits them.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Story Section */}
<div
  ref={storyRef}
  className={`bg-secondary/30 rounded-lg p-4 text-center mb-8 scroll-fade-up ${
    storyVisible ? 'in-view' : ''
  }`}
>
  <h2 className="text-2xl font-heading font-bold text-primary mb-4">Our Story</h2>

  <div className="max-w-2xl mx-auto text-muted-foreground space-y-3 text-sm">
    <p>
      Wiecodes started as a solo project by{" "}
      <a
        href="https://www.linkedin.com/in/wiebuu/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary font-medium hover:underline"
      >
        Vishwas Singh
      </a>
      , a developer tired of good work getting lost on crowded platforms and
      templates being hard to find, use, or monetize.
    </p>

    <p>
      The idea was simple: give indie developers, freelancers, and small teams a place where they
      can sell high-quality templates or get help shipping full products without being buried or
      overcharged.
    </p>

    <p>
      Creators collaborate with us on GitHub, and we handle the rest: listing, optimization, SEO,
      featuring, and pricing. On top of that, our services team takes on full web and app projects
      for clients who want done-for-you builds.
    </p>

    <p>
      With limited resources and a self-taught background, the goal was always to keep things
      practical: clean code, fair pricing, cashback if you’re not satisfied, and clear processes.
    </p>

    <p>
      Now, Wiecodes helps both beginners and professionals build faster, learn better, earn from
      their work, and ship real products for clients.
    </p>
  </div>
</div>

          </div>
        </section>

        {/* Company Information Sections */}
        <section className="py-8 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div
              ref={companyRef}
              className={`max-w-4xl mx-auto space-y-8 scroll-fade-up ${
                companyVisible ? 'in-view' : ''
              }`}
            >
              {/* About Us */}
              <div id="about-us" className="bg-white rounded-2xl p-6 sm:p-8 shadow-md border">
                <h2 className="text-2xl sm:text-3xl font-heading font-bold text-primary mb-4 text-center">
                  About Us
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed text-sm sm:text-base text-justify">
                  <p>
                    Wiecodes is a creator-first platform and services company built to support indie
                    developers, freelancers, and small businesses. We believe good ideas deserve clean,
                    affordable tools and straightforward execution.
                  </p>
                  <p>
                    On the marketplace side, sellers collaborate with us on GitHub. We take care of listing,
                    pricing, SEO, and marketing so creators can focus on building. Buyers get responsive,
                    production-ready templates with clean code and sensible pricing.
                  </p>
                  <p>
                    Alongside the marketplace, our in-house team works directly with clients on custom
                    websites, landing pages, dashboards, SaaS products, and mobile apps. We handle planning,
                    design, development, and handover in a simple, transparent way.
                  </p>
                  <p>
                    Whether you are a student learning to code, a solo dev with a strong repo, or a business
                    needing a launch-ready product, Wiecodes is built to help you move faster with clarity and
                    less noise.
                  </p>
                </div>
              </div>

              {/* Our Services */}
              <div id="services" className="bg-white rounded-2xl p-6 sm:p-8 shadow-md border">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  <h2 className="text-2xl sm:text-3xl font-heading font-bold text-primary text-center">
                    Our Services
                  </h2>
                </div>
                <div className="space-y-4 text-muted-foreground leading-relaxed text-sm sm:text-base">
                  <p className="text-justify">
                    Beyond templates, Wiecodes works as a compact, focused team for brands, startups, and
                    creators who need end-to-end execution. No fluff, no overcomplication, just clear scopes
                    and working products.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-heading font-semibold text-primary mb-1">
                        Web Development
                      </h3>
                      <p className="text-sm">
                        Landing pages, marketing sites, dashboards, and full-stack web apps built with modern
                        stacks and performance in mind.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-primary mb-1">
                        Mobile & Web Apps
                      </h3>
                      <p className="text-sm">
                        Cross-platform products, tools, and MVPs that help you test ideas fast without losing
                        on quality or UX.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-primary mb-1">
                        UI/UX & Design-to-Code
                      </h3>
                      <p className="text-sm">
                        We turn Figma and design concepts into clean, reusable components and real interfaces
                        ready for production.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-primary mb-1">
                        SaaS & Custom Solutions
                      </h3>
                      <p className="text-sm">
                        Subscription products, internal tools, and custom flows tailored to how your business
                        actually works.
                      </p>
                    </div>
                  </div>
                  <p className="text-sm sm:text-base">
                    If you need something built from scratch or want to start from a Wiecodes template and
                    extend it, you can reach out through our contact page or WhatsApp community and we will
                    scope it with you.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
