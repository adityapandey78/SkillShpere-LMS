import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import { fetchStudentBoughtCoursesService } from "@/services";
import { 
  Watch, 
  BookOpen, 
  Clock, 
  Award, 
  TrendingUp,
  GraduationCap
} from "lucide-react";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function StudentCoursesPage() {
  const { auth } = useContext(AuthContext);
  const { studentBoughtCoursesList, setStudentBoughtCoursesList } =
    useContext(StudentContext);
  const navigate = useNavigate();

  async function fetchStudentBoughtCourses() {
    const response = await fetchStudentBoughtCoursesService(auth?.user?._id);
    if (response?.success) {
      setStudentBoughtCoursesList(response?.data);
    }
  }
  
  useEffect(() => {
    fetchStudentBoughtCourses();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Learning</h1>
              <p className="text-gray-600">
                Continue your learning journey and track your progress
              </p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {studentBoughtCoursesList?.length || 0}
                </div>
                <div className="text-sm text-gray-600">Enrolled Courses</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">85%</div>
                <div className="text-sm text-gray-600">Avg Progress</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {studentBoughtCoursesList && studentBoughtCoursesList.length > 0 ? (
          <>
            {/* Quick Actions */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  className="h-auto p-4 justify-start hover:bg-blue-50 hover:border-blue-200"
                  onClick={() => navigate('/student/courses')}
                >
                  <BookOpen className="h-5 w-5 mr-3 text-blue-600" />
                  <div className="text-left">
                    <div className="font-medium">Browse Courses</div>
                    <div className="text-sm text-gray-600">Find new courses to learn</div>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto p-4 justify-start hover:bg-green-50 hover:border-green-200"
                  onClick={() => navigate('/student')}
                >
                  <TrendingUp className="h-5 w-5 mr-3 text-green-600" />
                  <div className="text-left">
                    <div className="font-medium">View Dashboard</div>
                    <div className="text-sm text-gray-600">See your learning stats</div>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto p-4 justify-start hover:bg-purple-50 hover:border-purple-200"
                >
                  <Award className="h-5 w-5 mr-3 text-purple-600" />
                  <div className="text-left">
                    <div className="font-medium">Certificates</div>
                    <div className="text-sm text-gray-600">View your achievements</div>
                  </div>
                </Button>
              </div>
            </div>

            {/* Courses Grid */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Courses</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {studentBoughtCoursesList.map((course) => (
                  <Card key={course.id} className="group hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] border-0 shadow-md">
                    <CardContent className="p-0">
                      <div className="relative">
                        <img
                          src={course?.courseImage || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"}
                          alt={course?.title}
                          className="w-full h-48 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 right-3 bg-white bg-opacity-90 backdrop-blur-sm px-2 py-1 rounded-full">
                          <span className="text-xs font-medium text-green-600">Enrolled</span>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <h3 className="font-bold text-lg mb-2 text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {course?.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3 flex items-center">
                          <GraduationCap className="h-4 w-4 mr-1" />
                          {course?.instructorName}
                        </p>
                        
                        {/* Progress Bar */}
                        <div className="mb-4">
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Progress</span>
                            <span>65%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                              style={{ width: '65%' }}
                            ></div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>2h 30m left</span>
                          </div>
                          <div className="flex items-center">
                            <BookOpen className="h-4 w-4 mr-1" />
                            <span>12 lessons</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="p-4 pt-0">
                      <Button
                        onClick={() => navigate(`/student/course-progress/${course?.courseId}`)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-all duration-200"
                      >
                        <Watch className="mr-2 h-4 w-4" />
                        Continue Learning
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </>
        ) : (
          // Empty State
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <BookOpen className="h-20 w-20 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No Courses Yet</h3>
              <p className="text-gray-600 mb-8 text-lg">
                Start your learning journey by enrolling in your first course. 
                Explore our wide range of topics and find something that interests you.
              </p>
              
              <div className="space-y-4">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 font-semibold rounded-lg"
                  onClick={() => navigate('/student/courses')}
                >
                  <BookOpen className="mr-2 h-5 w-5" />
                  Browse All Courses
                </Button>
                
                <div className="text-center">
                  <Button
                    variant="link"
                    className="text-blue-600 hover:text-blue-700"
                    onClick={() => navigate('/student')}
                  >
                    Return to Dashboard
                  </Button>
                </div>
              </div>
              
              {/* Features */}
              <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t">
                <div className="text-center">
                  <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="font-medium text-gray-900">Learn at Your Pace</div>
                  <div className="text-sm text-gray-600">Study anytime, anywhere</div>
                </div>
                <div className="text-center">
                  <GraduationCap className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="font-medium text-gray-900">Expert Instructors</div>
                  <div className="text-sm text-gray-600">Learn from the best</div>
                </div>
                <div className="text-center">
                  <Award className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="font-medium text-gray-900">Certificates</div>
                  <div className="text-sm text-gray-600">Earn recognition</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentCoursesPage;
