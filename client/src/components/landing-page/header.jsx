import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Menu, 
  X, 
  ChevronDown,
  Play
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LandingHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const categories = [
    "Web Development",
    "Data Science", 
    "Design",
    "Business",
    "Photography",
    "Music"
  ];

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="relative">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            <span className="text-2xl font-bold text-gray-900">SkillSphere</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <div className="relative group">
              <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors py-2">
                <span className="font-medium">Categories</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              
              {/* Dropdown */}
              <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-xl border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                      onClick={() => navigate(`/courses?category=${category.toLowerCase().replace(' ', '-')}`)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <button 
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              onClick={() => navigate('/auth')}
            >
              Courses
            </button>
            
            <button 
              className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors font-medium"
              onClick={() => navigate('/auth')}
            >
              <Play className="h-4 w-4" />
              <span>Teach</span>
            </button>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for anything..."
                className="pl-10 pr-4 py-2 w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
              />
            </div>
          </div>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <Button 
              variant="ghost"
              className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-semibold"
              onClick={() => navigate('/auth')}
            >
              Log in
            </Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
              onClick={() => navigate('/auth')}
            >
              Sign up
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t bg-white">
            <div className="py-4 space-y-2">
              {/* Mobile Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search courses..."
                  className="pl-10 pr-4 py-2 w-full border-gray-300 focus:border-blue-500 rounded-lg"
                />
              </div>
              
              <button 
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md font-medium"
                onClick={() => navigate('/auth')}
              >
                All Courses
              </button>
              
              <div className="px-4 py-2">
                <div className="text-sm font-medium text-gray-500 mb-2">Categories</div>
                {categories.map((category) => (
                  <button
                    key={category}
                    className="block w-full text-left px-2 py-1 text-gray-600 hover:text-blue-600 text-sm"
                    onClick={() => navigate(`/courses?category=${category.toLowerCase().replace(' ', '-')}`)}
                  >
                    {category}
                  </button>
                ))}
              </div>
              
              <hr className="my-4" />
              
              <button 
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md font-medium"
                onClick={() => navigate('/auth')}
              >
                Teach on SkillSphere
              </button>
              
              <div className="px-4 py-2 space-y-2">
                <Button 
                  variant="outline"
                  className="w-full justify-center border-blue-600 text-blue-600 hover:bg-blue-50"
                  onClick={() => navigate('/auth')}
                >
                  Log in
                </Button>
                <Button 
                  className="w-full justify-center bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => navigate('/auth')}
                >
                  Sign up
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default LandingHeader;
