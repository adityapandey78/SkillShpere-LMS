import LandingHeader from "@/components/landing-page/header";
import HeroSection from "@/components/landing-page/hero-section";
import { useContext, useEffect, lazy, Suspense } from "react";
import { AuthContext } from "@/context/auth-context";
import { useNavigate } from "react-router-dom";

// Lazy load sections below the fold
const CategoriesSection = lazy(() => import("@/components/landing-page/categories-section"));
const FeaturesSection = lazy(() => import("@/components/landing-page/features-section"));
const TestimonialsSection = lazy(() => import("@/components/landing-page/testimonials-section"));
const CtaSection = lazy(() => import("@/components/landing-page/cta-section"));
const Footer = lazy(() => import("@/components/landing-page/footer"));

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
      <Suspense fallback={<div className="h-64 w-full" />}>
        <CategoriesSection />
        <FeaturesSection />
        <TestimonialsSection />
        <CtaSection />
        <Footer />
      </Suspense>
    </div>
  );
}

export default LandingPage;
