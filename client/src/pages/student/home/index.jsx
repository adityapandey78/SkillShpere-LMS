import { courseCategories } from "@/config";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useContext, useEffect } from "react";
import { StudentContext } from "@/context/student-context";
import {
  checkCoursePurchaseInfoService,
  fetchStudentViewCourseListService,
} from "@/services";
import { AuthContext } from "@/context/auth-context";
import { useNavigate } from "react-router-dom";
import { 
  BookOpen, 
  Users, 
  Clock, 
  Star, 
  ArrowRight,
  TrendingUp,
  Award,
  Play
} from "lucide-react";

function StudentHomePage() {
  const { studentViewCoursesList, setStudentViewCoursesList } =
    useContext(StudentContext);
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  function handleNavigateToCoursesPage(getCurrentId) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      category: [getCurrentId],
    };
    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate("/student/courses");
  }

  async function fetchAllStudentViewCourses() {
    const response = await fetchStudentViewCourseListService();
    if (response?.success) setStudentViewCoursesList(response?.data);
  }

  async function handleCourseNavigate(getCurrentCourseId) {
    const response = await checkCoursePurchaseInfoService(
      getCurrentCourseId,
      auth?.user?._id
    );

    if (response?.success) {
      if (response?.data) {
        navigate(`/student/course-progress/${getCurrentCourseId}`);
      } else {
        navigate(`/student/course/details/${getCurrentCourseId}`);
      }
    }
  }

  useEffect(() => {
    fetchAllStudentViewCourses();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Get featured courses (first 8)
  const featuredCourses = studentViewCoursesList?.slice(0, 8) || [];
  const popularCategories = courseCategories.slice(0, 8);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16 px-4 lg:px-8">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                  Welcome back, {auth?.user?.userName}!
                </h1>
                <p className="text-xl text-blue-100">
                  Continue your learning journey and discover new skills to advance your career.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                  onClick={() => navigate('/student/courses')}
                >
                  <BookOpen className="mr-2 h-5 w-5" />
                  Explore All Courses
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 font-semibold rounded-lg transition-all duration-200"
                  onClick={() => navigate('/student/student-courses')}
                >
                  <Play className="mr-2 h-5 w-5" />
                  Continue Learning
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold">{studentViewCoursesList?.length || 0}</div>
                  <div className="text-sm text-blue-200">Available Courses</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{popularCategories.length}+</div>
                  <div className="text-sm text-blue-200">Categories</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">24/7</div>
                  <div className="text-sm text-blue-200">Access</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Students learning"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-4 -right-4 bg-white bg-opacity-90 backdrop-blur-sm p-4 rounded-xl shadow-lg">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-6 w-6 text-green-500" />
                  <div>
                    <div className="font-bold text-gray-900">95%</div>
                    <div className="text-sm text-gray-600">Success Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Categories */}
      <section className="py-16 px-4 lg:px-8 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Explore by <span className="text-blue-600">Category</span>
            </h2>
            <p className="text-gray-600 text-lg">
              Find courses in your area of interest and start learning today
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {popularCategories.map((categoryItem) => (
              <Card 
                key={categoryItem.id}
                className="group cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:scale-105 border-0 shadow-md"
                onClick={() => handleNavigateToCoursesPage(categoryItem.id)}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {categoryItem.label}
                  </h3>
                  <div className="flex items-center justify-center text-sm text-gray-500">
                    <span>View Courses</span>
                    <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button
              variant="outline"
              size="lg"
              className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3 font-semibold transition-all duration-200"
              onClick={() => navigate('/student/courses')}
            >
              View All Categories
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-16 px-4 lg:px-8 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured <span className="text-blue-600">Courses</span>
            </h2>
            <p className="text-gray-600 text-lg">
              Discover our most popular and highly-rated courses
            </p>
          </div>

          {featuredCourses.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {featuredCourses.map((courseItem) => (
                  <Card 
                    key={courseItem._id}
                    className="group cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] border-0 shadow-lg overflow-hidden"
                    onClick={() => handleCourseNavigate(courseItem?._id)}
                  >
                    <div className="relative">
                      <img
                        src={courseItem?.image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"}
                        alt={courseItem?.title}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-3 right-3">
                        {courseItem?.pricing === 0 ? (
                          <Badge className="bg-green-500 hover:bg-green-600 text-white">
                            Free
                          </Badge>
                        ) : (
                          <Badge className="bg-blue-500 hover:bg-blue-600 text-white">
                            ${courseItem?.pricing}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <CardContent className="p-6">
                      <h3 className="font-bold text-lg mb-2 text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {courseItem?.title}
                      </h3>
                      
                      <div className="flex items-center text-sm text-gray-600 mb-3">
                        <Users className="h-4 w-4 mr-1" />
                        <span className="mr-4">{courseItem?.instructorName}</span>
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{courseItem?.curriculum?.length || 0} lessons</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium text-gray-700 ml-1">4.8</span>
                          <span className="text-sm text-gray-500 ml-1">
                            ({courseItem?.students?.length || 0})
                          </span>
                        </div>
                        <Button 
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200"
                        >
                          View Course
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center mt-12">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                  onClick={() => navigate('/student/courses')}
                >
                  View All Courses
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Courses Available</h3>
              <p className="text-gray-600 mb-6">
                Courses are being added. Check back soon for new content!
              </p>
              <Button
                onClick={() => navigate('/student/courses')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
              >
                Refresh Courses
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 lg:px-8 bg-blue-600 text-white">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <Award className="h-16 w-16 mx-auto mb-6 text-blue-200" />
            <h2 className="text-3xl font-bold mb-4">
              Ready to Advance Your Skills?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of learners who are already building their future with SkillSphere.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 font-semibold rounded-lg"
                onClick={() => navigate('/student/courses')}
              >
                Start Learning Today
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 font-semibold rounded-lg"
                onClick={() => navigate('/student/student-courses')}
              >
                View My Progress
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default StudentHomePage;
