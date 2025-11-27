/**
 * Centralized image src mapping for the SkillSphere LMS project.
 *
 * Replace the URL paths below with actual asset imports or local paths:
 * Example: import logo from './logo.png'; then set `logo: logo`
 *
 * Usage in components:
 *   import images from '@/assets/images';
 *   <img src={images.landingPage.hero} alt="Hero" />
 */

const images = {
  // ===== LANDING PAGE SECTION =====
  landingPage: {
    // Hero Section
    hero: "/images/hero.avif",
    
    // CTA Section
    cta: "/images/landingPageCTA.avif",
    
    // Categories Section
    categories: {
      webDevelopment: "/images/catWebDev.avif",
      design: "/images/catDesign.avif",
      dataScience: "/images/cateDataScience.avif",
      aiMachineLearning: "/images/catAIML.avif",
      photography: "/images/catPhoto.avif",
      music: "/images/catMusic.avif",
      business: "/images/catbusiness.avif",
      languages: "/images/catLang.avif",
    },
    
    // Testimonials Section
    testimonials: {
      sarahJohnson: "/images/sharedDefaultAvatar.avif",
      michaelChen: "/images/textMichael.avif",
      emilyRodriguez: "/images/testEmily.avif",
      davidThompson: "/images/testDavid.avif",
      lisaPark: "/images/testlisa.avif",
      jamesWilson: "/images/testJame.avif",
    }
  },

  // ===== STUDENT VIEW SECTION =====
  studentView: {
    // Student Home Page
    homeHero: "/images/studHeroStudImage.avif",
    
    // Course Placeholders (fallback images)
    coursePlaceholder: "/images/studHeroCoursePlaceholder.avif",
  },

  // ===== INSTRUCTOR VIEW SECTION =====
  instructorView: {
    // Instructor Dashboard
    dashboardWelcome: "/images/instructorDashboardWelcome.avif",
    dashboardStats: "/images/instructorDashBoardStats.avif",
    
    // Instructor Profile
    avatarPlaceholder: "/images/InstructorAvatarPlaceholder.avif",
    
    // Courses
    emptyCoursePlaceholder: "/images/instructorEmptycoursePlaceholder.avif",
  },

  // ===== AUTH PAGE SECTION =====
  authPage: {
    authBackground: "/images/authPage.avif",
  },

  // ===== GENERIC/SHARED =====
  shared: {
    // Default fallbacks
    defaultAvatar: "/images/sharedDefaultAvatar.avif",
    defaultCourse: "/images/shareddefaultCourse.avif",
  }
};

export default images;

// Named export if you prefer named imports
export { images };
