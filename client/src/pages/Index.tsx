
import { useRole } from '@/contexts/RoleContext';
import FeaturedTemplates from '@/components/FeaturedTemplates';
import CtaSection from '@/components/CtaSection';
import FinalSection from '@/components/FinalSection';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import Stats from '@/components/Stats';
import SellerHome from '@/pages/seller/SellerHome';

const Index = () => {
  const { isSeller } = useRole();

  if (isSeller) {
    return <SellerHome />;
  }

  return (
    <div className="min-h-screen animate-fade-in">
      <Header />
      <Hero />
      <CtaSection />
      <FeaturedTemplates />
      <Stats />
      <FinalSection />
      <Footer />
    </div>
  );
};

export default Index;
