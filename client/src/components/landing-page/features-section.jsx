import { Card, CardContent } from "@/components/ui/card";
import { 
  Users, 
  Award, 
  Clock, 
  Globe, 
  BookOpen, 
  Zap 
} from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Expert Instructors",
    description: "Learn from industry professionals with years of real-world experience",
    color: "text-blue-600"
  },
  {
    icon: Award,
    title: "Certificates",
    description: "Earn recognized certificates to showcase your skills to employers",
    color: "text-purple-600"
  },
  {
    icon: Clock,
    title: "Learn at Your Pace",
    description: "Access courses 24/7 and learn on your own schedule from anywhere",
    color: "text-green-600"
  },
  {
    icon: Globe,
    title: "Global Community",
    description: "Join millions of learners worldwide and connect with like-minded peers",
    color: "text-orange-600"
  },
  {
    icon: BookOpen,
    title: "Comprehensive Content",
    description: "Get access to high-quality video lectures, assignments, and resources",
    color: "text-pink-600"
  },
  {
    icon: Zap,
    title: "Instant Access",
    description: "Start learning immediately with lifetime access to course materials",
    color: "text-indigo-600"
  }
];

function FeaturesSection() {
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
            Why Choose <span className="text-blue-600">SkillSphere</span>?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We provide the best online learning experience with cutting-edge features 
            and world-class content to help you achieve your goals.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card 
                key={index}
                className="group border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-white"
              >
                <CardContent className="p-8 text-center">
                  <div className={`inline-flex p-4 rounded-full bg-gray-100 group-hover:bg-blue-50 transition-colors duration-300 mb-6`}>
                    <IconComponent className={`h-8 w-8 ${feature.color}`} />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
