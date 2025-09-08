import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Full Stack Developer",
    company: "Google",
    image: "https://images.unsplash.com/photo-1494790108755-2616b62ad6b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    content: "SkillSphere transformed my career completely. The web development courses are incredibly comprehensive and the instructors are world-class.",
    rating: 5
  },
  {
    name: "Michael Chen",
    role: "Data Scientist",
    company: "Microsoft",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    content: "The AI and machine learning courses helped me transition into data science. The practical projects were exactly what I needed.",
    rating: 5
  },
  {
    name: "Emily Rodriguez",
    role: "UX Designer",
    company: "Adobe",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    content: "Amazing platform with high-quality content. The design courses are perfect for both beginners and advanced learners.",
    rating: 5
  },
  {
    name: "David Thompson",
    role: "Business Analyst",
    company: "Amazon",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    content: "The business and analytics courses gave me the skills I needed to advance in my career. Highly recommend SkillSphere!",
    rating: 5
  },
  {
    name: "Lisa Park",
    role: "Digital Marketer",
    company: "Meta",
    image: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    content: "The marketing courses are incredibly detailed and practical. I was able to implement what I learned immediately at work.",
    rating: 5
  },
  {
    name: "James Wilson",
    role: "Software Engineer",
    company: "Netflix",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    content: "Excellent platform for continuous learning. The mobile app makes it easy to learn on the go during my commute.",
    rating: 5
  }
];

function TestimonialsSection() {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
            What Our <span className="text-blue-600">Students</span> Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of satisfied learners who have transformed their careers 
            and achieved their goals with SkillSphere.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index}
              className="group border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-white relative overflow-hidden"
            >
              <CardContent className="p-8">
                {/* Quote Icon */}
                <Quote className="h-8 w-8 text-blue-200 mb-4" />
                
                {/* Rating */}
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                
                {/* Content */}
                <p className="text-gray-600 mb-6 leading-relaxed italic">
                  "{testimonial.content}"
                </p>
                
                {/* Author */}
                <div className="flex items-center">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </div>
              </CardContent>
              
              {/* Decorative Element */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full -mr-10 -mt-10 opacity-50 group-hover:opacity-70 transition-opacity"></div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;
