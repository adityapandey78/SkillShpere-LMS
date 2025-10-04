import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DollarSign, Users, BookOpen, TrendingUp, Award, Clock } from "lucide-react";
import { motion } from "framer-motion";

function InstructorDashboard({ listOfCourses }) {
  function calculateTotalStudentsAndProfit() {
    const { totalStudents, totalProfit, studentList } = listOfCourses.reduce(
      (acc, course) => {
        const studentCount = course.students.length;
        acc.totalStudents += studentCount;
        acc.totalProfit += course.pricing * studentCount;

        course.students.forEach((student) => {
          acc.studentList.push({
            courseTitle: course.title,
            studentName: student.studentName,
            studentEmail: student.studentEmail,
          });
        });

        return acc;
      },
      {
        totalStudents: 0,
        totalProfit: 0,
        studentList: [],
      }
    );

    return {
      totalProfit,
      totalStudents,
      studentList,
    };
  }

  const stats = calculateTotalStudentsAndProfit();

  const config = [
    {
      icon: DollarSign,
      label: "Total Revenue",
      value: `$${stats.totalProfit.toLocaleString()}`,
      bgGradient: "from-green-500 to-emerald-600",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      icon: Users,
      label: "Total Students",
      value: stats.totalStudents,
      bgGradient: "from-blue-500 to-indigo-600",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      icon: BookOpen,
      label: "Active Courses",
      value: listOfCourses.length,
      bgGradient: "from-purple-500 to-pink-600",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      icon: Award,
      label: "Course Categories",
      value: new Set(listOfCourses.map(c => c.category)).size,
      bgGradient: "from-yellow-500 to-orange-600",
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white shadow-2xl"
      >
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2">Welcome Back, Instructor! 👋</h2>
          <p className="text-blue-100 text-lg mb-6">
            Here's what's happening with your courses today.
          </p>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span className="text-sm">Last updated: Today</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5" />
              <span className="text-sm">Top Instructor Badge</span>
            </div>
          </div>
        </div>
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 h-48 w-48 rounded-full bg-white opacity-10"></div>
        <div className="absolute bottom-0 right-0 -mb-8 -mr-8 h-32 w-32 rounded-full bg-white opacity-10"></div>
        <img
          src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
          alt="Teaching"
          className="absolute bottom-0 right-8 h-48 w-auto opacity-20 hidden lg:block"
        />
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {config.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300">
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${item.bgGradient} opacity-5`}></div>
              
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {item.label}
                </CardTitle>
                <div className={`h-10 w-10 rounded-full ${item.iconBg} flex items-center justify-center`}>
                  <item.icon className={`h-5 w-5 ${item.iconColor}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 mb-2">{item.value}</div>
                <p className="text-sm text-gray-500">Updated daily</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Students List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="border-0 shadow-xl">
          <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900">Enrolled Students</CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Complete list of students across all your courses
                </p>
              </div>
              <div className="hidden sm:block">
                <div className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm">
                  {stats.totalStudents} Total
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {stats.studentList.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="font-semibold text-gray-700">Course Name</TableHead>
                      <TableHead className="font-semibold text-gray-700">Student Name</TableHead>
                      <TableHead className="font-semibold text-gray-700">Student Email</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats.studentList.map((studentItem, index) => (
                      <TableRow key={index} className="hover:bg-blue-50 transition-colors">
                        <TableCell className="font-medium text-gray-900">
                          <div className="flex items-center space-x-2">
                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                            <span>{studentItem.courseTitle}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-700">{studentItem.studentName}</TableCell>
                        <TableCell className="text-gray-600">{studentItem.studentEmail}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
                  alt="No students"
                  className="h-48 w-auto opacity-50 mb-4 rounded-lg"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Students Yet</h3>
                <p className="text-gray-600">
                  Your courses are waiting for students to enroll!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default InstructorDashboard;
