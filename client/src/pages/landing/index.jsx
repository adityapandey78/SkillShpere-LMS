import LandingHeader from "@/components/landing-page/header";
import HeroSection from "@/components/landing-page/hero-section";
import CategoriesSection from "@/components/landing-page/categories-section";
import FeaturesSection from "@/components/landing-page/features-section";
import TestimonialsSection from "@/components/landing-page/testimonials-section";
import CtaSection from "@/components/landing-page/cta-section";
import Footer from "@/components/landing-page/footer";
import { useContext, useEffect } from "react";
import { AuthContext } from "@/context/auth-context";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already authenticated, redirect them to their dashboard
    if (auth?.authenticate) {
      if (auth?.user?.role === 'instructor') {
        navigate('/instructor');
      } else {
        navigate('/home');
      }
    }
  }, [auth, navigate]);

  // Show landing page only for unauthenticated users
  if (auth?.authenticate) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <LandingHeader />
      <HeroSection />
      <CategoriesSection />
      <FeaturesSection />
      <TestimonialsSection />
      <CtaSection />
      <Footer />
    </div>
  );
}

export default LandingPage;
