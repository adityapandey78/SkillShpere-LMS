import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Users, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";

function CtaSection() {
  const navigate = useNavigate();

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-5xl font-bold leading-tight">
                Ready to Start Your
                <br />
                Learning Journey?
              </h2>
              <p className="text-xl text-blue-100 leading-relaxed">
                Join over 50,000 students and professionals who are already 
                advancing their careers with SkillSphere. Start learning today 
                and unlock your potential.
              </p>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-center space-x-3">
                <Users className="h-8 w-8 text-blue-200" />
                <div>
                  <div className="text-2xl font-bold">50K+</div>
                  <div className="text-blue-200 text-sm">Active Students</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Award className="h-8 w-8 text-blue-200" />
                <div>
                  <div className="text-2xl font-bold">1000+</div>
                  <div className="text-blue-200 text-sm">Certificates Issued</div>
                </div>
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                onClick={() => navigate('/auth')}
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-200"
                onClick={() => navigate('/auth')}
              >
                <Play className="mr-2 h-5 w-5" />
                Browse Courses
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="pt-8">
              <p className="text-blue-200 text-sm mb-4">Trusted by employees at:</p>
              <div className="flex flex-wrap items-center gap-6 opacity-75">
                <div className="text-white font-semibold text-lg">Google</div>
                <div className="text-white font-semibold text-lg">Microsoft</div>
                <div className="text-white font-semibold text-lg">Amazon</div>
                <div className="text-white font-semibold text-lg">Apple</div>
                <div className="text-white font-semibold text-lg">Netflix</div>
              </div>
            </div>
          </div>

          {/* Right Content - Visual */}
          <div className="relative">
            <div className="relative z-10">
              <img
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Person learning online"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 bg-white bg-opacity-20 backdrop-blur-sm p-4 rounded-xl z-20">
              <div className="text-center">
                <div className="text-2xl font-bold">95%</div>
                <div className="text-sm text-blue-100">Completion Rate</div>
              </div>
            </div>
            
            <div className="absolute -bottom-4 -left-4 bg-white bg-opacity-20 backdrop-blur-sm p-4 rounded-xl z-20">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold">24/7 Support</span>
              </div>
            </div>
            
            {/* Background Decoration */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl transform rotate-3 opacity-20"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CtaSection;
