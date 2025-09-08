import { TvMinimalPlay, LogOut } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { useContext } from "react";
import { AuthContext } from "@/context/auth-context";

function StudentViewCommonHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { resetCredentials } = useContext(AuthContext);

  function handleLogout() {
    resetCredentials();
    sessionStorage.clear();
  }

  return (
    <header className="flex items-center justify-between p-4 lg:px-8 border-b bg-white shadow-sm">
      <div className="flex items-center space-x-4">
        <Link to="/student" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
          <span className="text-2xl font-bold text-gray-900">
            SkillSphere
          </span>
        </Link>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            onClick={() => {
              if (!location.pathname.includes("/student/courses")) {
                navigate("/student/courses");
              }
            }}
            className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium transition-colors"
          >
            Explore Courses
          </Button>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex gap-4 items-center">
          <Button
            variant="ghost"
            onClick={() => navigate("/student/student-courses")}
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium transition-colors"
          >
            <TvMinimalPlay className="w-5 h-5" />
            <span className="hidden md:inline">My Courses</span>
          </Button>
          <Button 
            onClick={handleLogout}
            variant="outline"
            className="flex items-center gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">Sign Out</span>
          </Button>
        </div>
      </div>
    </header>
  );
}

export default StudentViewCommonHeader;
