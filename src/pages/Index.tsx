import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/sections/Hero';
import Categories from '@/components/sections/Categories';
import HowItWorks from '@/components/sections/HowItWorks';
import FeaturedItems from '@/components/sections/FeaturedItems';
import TrustSection from '@/components/sections/TrustSection';
import CTA from '@/components/sections/CTA';
import Footer from '@/components/layout/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <Categories />
        <FeaturedItems />
        <HowItWorks />
        <TrustSection />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
