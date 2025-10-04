import InstructorCourses from "@/components/instructor-view/courses";
import InstructorDashboard from "@/components/instructor-view/dashboard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { AuthContext } from "@/context/auth-context";
import { InstructorContext } from "@/context/instructor-context";
import { fetchInstructorCourseListService } from "@/services";
import { BarChart, Book, LogOut, GraduationCap, Menu, X } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function InstructorDashboardpage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { resetCredentials, auth } = useContext(AuthContext);
  const { instructorCoursesList, setInstructorCoursesList } =
    useContext(InstructorContext);

  async function fetchAllCourses() {
    const response = await fetchInstructorCourseListService();
    if (response?.success) setInstructorCoursesList(response?.data);
  }

  useEffect(() => {
    fetchAllCourses();
  }, []);

  const menuItems = [
    {
      icon: BarChart,
      label: "Dashboard",
      value: "dashboard",
      component: <InstructorDashboard listOfCourses={instructorCoursesList} />,
    },
    {
      icon: Book,
      label: "Courses",
      value: "courses",
      component: <InstructorCourses listOfCourses={instructorCoursesList} />,
    },
    {
      icon: LogOut,
      label: "Logout",
      value: "logout",
      component: null,
    },
  ];

  function handleLogout() {
    resetCredentials();
    sessionStorage.clear();
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-72 bg-white shadow-2xl border-r border-gray-200 flex-col">
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <GraduationCap className="h-7 w-7 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">SkillSphere</h2>
              <p className="text-xs text-blue-100">Instructor Portal</p>
            </div>
          </div>
        </div>

        {/* User Profile Section */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                alt="Instructor"
                className="h-14 w-14 rounded-full object-cover border-2 border-blue-600 shadow-lg"
              />
              <div className="absolute bottom-0 right-0 h-4 w-4 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {auth?.user?.userName || "Instructor"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {auth?.user?.userEmail || "instructor@skillsphere.com"}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((menuItem) => (
            <motion.div
              key={menuItem.value}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                className={`w-full justify-start h-12 text-base transition-all duration-200 ${
                  activeTab === menuItem.value
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/50"
                    : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-200"
                }`}
                variant={activeTab === menuItem.value ? "default" : "ghost"}
                onClick={
                  menuItem.value === "logout"
                    ? handleLogout
                    : () => {
                        setActiveTab(menuItem.value);
                        setIsMobileMenuOpen(false);
                      }
                }
              >
                <menuItem.icon className="mr-3 h-5 w-5" />
                {menuItem.label}
              </Button>
            </motion.div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="text-center">
            <p className="text-xs text-gray-500">© 2025 SkillSphere</p>
            <p className="text-xs text-gray-400">All rights reserved</p>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white shadow-md border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">SkillSphere</h2>
              <p className="text-xs text-gray-500">Instructor</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="h-10 w-10"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 20 }}
            className="md:hidden fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl"
          >
            <div className="flex flex-col h-full">
              {/* Mobile Logo */}
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center">
                    <GraduationCap className="h-7 w-7 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">SkillSphere</h2>
                    <p className="text-xs text-blue-100">Instructor Portal</p>
                  </div>
                </div>
              </div>

              {/* Mobile User Profile */}
              <div className="p-6 border-b border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="flex items-center space-x-4">
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                    alt="Instructor"
                    className="h-12 w-12 rounded-full object-cover border-2 border-blue-600"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {auth?.user?.userName || "Instructor"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {auth?.user?.userEmail || "instructor@skillsphere.com"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Mobile Navigation */}
              <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {menuItems.map((menuItem) => (
                  <Button
                    key={menuItem.value}
                    className={`w-full justify-start h-12 text-base ${
                      activeTab === menuItem.value
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                        : "bg-white text-gray-700 hover:bg-blue-50"
                    }`}
                    onClick={
                      menuItem.value === "logout"
                        ? handleLogout
                        : () => {
                            setActiveTab(menuItem.value);
                            setIsMobileMenuOpen(false);
                          }
                    }
                  >
                    <menuItem.icon className="mr-3 h-5 w-5" />
                    {menuItem.label}
                  </Button>
                ))}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto md:p-8 p-4 pt-20 md:pt-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              {menuItems.find((item) => item.value === activeTab)?.label || "Dashboard"}
            </h1>
            <p className="text-gray-600">
              Manage your courses and track your performance
            </p>
          </motion.div>

          {/* Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            {menuItems.map((menuItem) => (
              <TabsContent key={menuItem.value} value={menuItem.value}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {menuItem.component !== null ? menuItem.component : null}
                </motion.div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
    </div>
  );
}

export default InstructorDashboardpage;
