import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Code, 
  Palette, 
  BarChart3, 
  Brain, 
  Camera, 
  Music, 
  Briefcase, 
  Globe,
  ArrowRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const categories = [
  {
    id: "web-development",
    name: "Web Development",
    icon: Code,
    color: "bg-blue-100 text-blue-600",
    description: "Master modern web technologies",
    courses: "120+ courses",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: "design",
    name: "Design",
    icon: Palette,
    color: "bg-purple-100 text-purple-600",
    description: "Creative design & user experience",
    courses: "85+ courses",
    image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: "data-science",
    name: "Data Science",
    icon: BarChart3,
    color: "bg-green-100 text-green-600",
    description: "Analytics & machine learning",
    courses: "95+ courses",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: "artificial-intelligence",
    name: "AI & Machine Learning",
    icon: Brain,
    color: "bg-orange-100 text-orange-600",
    description: "Future of technology",
    courses: "75+ courses",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: "photography",
    name: "Photography",
    icon: Camera,
    color: "bg-pink-100 text-pink-600",
    description: "Visual storytelling mastery",
    courses: "60+ courses",
    image: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: "music",
    name: "Music",
    icon: Music,
    color: "bg-indigo-100 text-indigo-600",
    description: "Create beautiful melodies",
    courses: "40+ courses",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: "business",
    name: "Business",
    icon: Briefcase,
    color: "bg-yellow-100 text-yellow-600",
    description: "Entrepreneurship & leadership",
    courses: "110+ courses",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: "languages",
    name: "Languages",
    icon: Globe,
    color: "bg-teal-100 text-teal-600",
    description: "Connect with the world",
    courses: "90+ courses",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
  }
];

function CategoriesSection() {
  const navigate = useNavigate();

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
            Explore Top <span className="text-blue-600">Categories</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover courses across diverse fields taught by industry experts. 
            From technology to creative arts, find your passion and start learning today.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Card 
                key={category.id}
                className="group cursor-pointer border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-white to-gray-50"
                onClick={() => navigate(`/courses?category=${category.id}`)}
              >
                <CardContent className="p-6">
                  <div className="relative overflow-hidden rounded-lg mb-4">
                    <img 
                      src={category.image} 
                      alt={category.name}
                      className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className={`absolute top-3 right-3 p-2 rounded-full ${category.color}`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {category.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">
                      {category.courses}
                    </span>
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button
            size="lg"
            variant="outline"
            className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-200"
            onClick={() => navigate('/courses')}
          >
            View All Categories
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}

export default CategoriesSection;
