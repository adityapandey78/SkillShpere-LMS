import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  courseCurriculumInitialFormData,
  courseLandingInitialFormData,
} from "@/config";
import { InstructorContext } from "@/context/instructor-context";
import { Delete, Edit, Plus, Users, DollarSign, TrendingUp, BookOpen } from "lucide-react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function InstructorCourses({ listOfCourses }) {
  const navigate = useNavigate();
  const {
    setCurrentEditedCourseId,
    setCourseLandingFormData,
    setCourseCurriculumFormData,
  } = useContext(InstructorContext);

  // Calculate quick stats
  const totalStudents = listOfCourses.reduce((acc, course) => acc + (course?.students?.length || 0), 0);
  const totalRevenue = listOfCourses.reduce((acc, course) => acc + (course?.students?.length * course?.pricing || 0), 0);
  const avgStudentsPerCourse = listOfCourses.length > 0 ? Math.round(totalStudents / listOfCourses.length) : 0;

  return (
    <div className="space-y-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -5 }}
        >
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Courses</p>
                  <p className="text-3xl font-bold text-gray-900">{listOfCourses.length}</p>
                </div>
                <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center">
                  <BookOpen className="h-7 w-7 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ y: -5 }}
        >
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Students</p>
                  <p className="text-3xl font-bold text-gray-900">{totalStudents}</p>
                </div>
                <div className="h-14 w-14 rounded-full bg-green-100 flex items-center justify-center">
                  <Users className="h-7 w-7 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ y: -5 }}
        >
          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Avg. per Course</p>
                  <p className="text-3xl font-bold text-gray-900">{avgStudentsPerCourse}</p>
                </div>
                <div className="h-14 w-14 rounded-full bg-purple-100 flex items-center justify-center">
                  <TrendingUp className="h-7 w-7 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Courses Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="border-0 shadow-xl">
          <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900 mb-1">
                  Your Courses
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Manage and track all your courses in one place
                </p>
              </div>
              <Button
                onClick={() => {
                  setCurrentEditedCourseId(null);
                  setCourseLandingFormData(courseLandingInitialFormData);
                  setCourseCurriculumFormData(courseCurriculumInitialFormData);
                  navigate("/instructor/create-new-course");
                }}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                size="lg"
              >
                <Plus className="mr-2 h-5 w-5" />
                Create New Course
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {listOfCourses && listOfCourses.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="font-semibold text-gray-700">Course Details</TableHead>
                      <TableHead className="font-semibold text-gray-700 text-center">Students</TableHead>
                      <TableHead className="font-semibold text-gray-700 text-center">Revenue</TableHead>
                      <TableHead className="font-semibold text-gray-700 text-center">Status</TableHead>
                      <TableHead className="text-right font-semibold text-gray-700">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {listOfCourses.map((course, index) => (
                      <motion.tr
                        key={course._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-blue-50 transition-colors border-b border-gray-100"
                      >
                        <TableCell>
                          <div className="flex items-center space-x-4">
                            <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg flex-shrink-0">
                              <BookOpen className="h-8 w-8 text-white" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-gray-900 truncate">{course?.title}</p>
                              <p className="text-sm text-gray-500 truncate">{course?.category}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <Users className="h-4 w-4 text-gray-400" />
                            <span className="font-medium text-gray-900">{course?.students?.length || 0}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <DollarSign className="h-4 w-4 text-green-500" />
                            <span className="font-semibold text-green-600">
                              ${((course?.students?.length || 0) * course?.pricing).toLocaleString()}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge 
                            className={`${
                              course?.isPublised 
                                ? "bg-green-100 text-green-700 hover:bg-green-100" 
                                : "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                            }`}
                          >
                            {course?.isPublised ? "Published" : "Draft"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              onClick={() => {
                                navigate(`/instructor/edit-course/${course?._id}`);
                              }}
                              variant="ghost"
                              size="sm"
                              className="hover:bg-blue-100 hover:text-blue-600"
                            >
                              <Edit className="h-5 w-5" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="hover:bg-red-100 hover:text-red-600"
                            >
                              <Delete className="h-5 w-5" />
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                    alt="No courses"
                    className="h-64 w-auto opacity-70 mb-6 rounded-2xl shadow-xl"
                  />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">No Courses Yet</h3>
                  <p className="text-gray-600 mb-6 max-w-md">
                    Start sharing your knowledge! Create your first course and reach students worldwide.
                  </p>
                  <Button
                    onClick={() => {
                      setCurrentEditedCourseId(null);
                      setCourseLandingFormData(courseLandingInitialFormData);
                      setCourseCurriculumFormData(courseCurriculumInitialFormData);
                      navigate("/instructor/create-new-course");
                    }}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl"
                    size="lg"
                  >
                    <Plus className="mr-2 h-5 w-5" />
                    Create Your First Course
                  </Button>
                </motion.div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default InstructorCourses;
