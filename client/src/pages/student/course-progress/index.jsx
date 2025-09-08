import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VideoPlayer from "@/components/video-player";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import {
  getCurrentCourseProgressService,
  markLectureAsViewedService,
  resetCourseProgressService,
} from "@/services";
import { 
  Check, 
  ChevronLeft, 
  Play, 
  Clock, 
  Award, 
  BookOpen, 
  SkipBack, 
  SkipForward,
  Menu,
  X,
  CheckCircle2,
  Star,
  Target
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useNavigate, useParams } from "react-router-dom";

function StudentViewCourseProgressPage() {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const { studentCurrentCourseProgress, setStudentCurrentCourseProgress } =
    useContext(StudentContext);
  const [lockCourse, setLockCourse] = useState(false);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [showCourseCompleteDialog, setShowCourseCompleteDialog] =
    useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);
  const [currentLectureIndex, setCurrentLectureIndex] = useState(0);
  const { id } = useParams();

  async function fetchCurrentCourseProgress() {
    const response = await getCurrentCourseProgressService(auth?.user?._id, id);
    if (response?.success) {
      if (!response?.data?.isPurchased) {
        setLockCourse(true);
      } else {
        setStudentCurrentCourseProgress({
          courseDetails: response?.data?.courseDetails,
          progress: response?.data?.progress,
        });

        if (response?.data?.completed) {
          setCurrentLecture(response?.data?.courseDetails?.curriculum[0]);
          setCurrentLectureIndex(0);
          setShowCourseCompleteDialog(true);
          setShowConfetti(true);
          return;
        }

        if (response?.data?.progress?.length === 0) {
          setCurrentLecture(response?.data?.courseDetails?.curriculum[0]);
          setCurrentLectureIndex(0);
        } else {
          const lastIndexOfViewedAsTrue = response?.data?.progress.reduceRight(
            (acc, obj, index) => {
              return acc === -1 && obj.viewed ? index : acc;
            },
            -1
          );

          const nextLectureIndex = lastIndexOfViewedAsTrue + 1;
          setCurrentLecture(
            response?.data?.courseDetails?.curriculum[nextLectureIndex]
          );
          setCurrentLectureIndex(nextLectureIndex);
        }
      }
    }
  }

  async function updateCourseProgress() {
    if (currentLecture) {
      const response = await markLectureAsViewedService(
        auth?.user?._id,
        studentCurrentCourseProgress?.courseDetails?._id,
        currentLecture._id
      );

      if (response?.success) {
        fetchCurrentCourseProgress();
      }
    }
  }

  async function handleRewatchCourse() {
    const response = await resetCourseProgressService(
      auth?.user?._id,
      studentCurrentCourseProgress?.courseDetails?._id
    );

    if (response?.success) {
      setCurrentLecture(null);
      setShowConfetti(false);
      setShowCourseCompleteDialog(false);
      fetchCurrentCourseProgress();
    }
  }

  // Navigation functions
  const goToPreviousLecture = () => {
    if (currentLectureIndex > 0) {
      const prevIndex = currentLectureIndex - 1;
      setCurrentLecture(studentCurrentCourseProgress?.courseDetails?.curriculum[prevIndex]);
      setCurrentLectureIndex(prevIndex);
    }
  };

  const goToNextLecture = () => {
    const totalLectures = studentCurrentCourseProgress?.courseDetails?.curriculum?.length || 0;
    if (currentLectureIndex < totalLectures - 1) {
      const nextIndex = currentLectureIndex + 1;
      setCurrentLecture(studentCurrentCourseProgress?.courseDetails?.curriculum[nextIndex]);
      setCurrentLectureIndex(nextIndex);
    }
  };

  const selectLecture = (lecture, index) => {
    setCurrentLecture(lecture);
    setCurrentLectureIndex(index);
  };

  // Calculate progress percentage
  const calculateProgress = () => {
    if (!studentCurrentCourseProgress?.progress || !studentCurrentCourseProgress?.courseDetails?.curriculum) {
      return 0;
    }
    const totalLectures = studentCurrentCourseProgress.courseDetails.curriculum.length;
    const completedLectures = studentCurrentCourseProgress.progress.filter(p => p.viewed).length;
    return Math.round((completedLectures / totalLectures) * 100);
  };

  const progressPercentage = calculateProgress();

  useEffect(() => {
    fetchCurrentCourseProgress();
  }, [id]);

  useEffect(() => {
    if (currentLecture?.progressValue === 1) updateCourseProgress();
  }, [currentLecture]);

  useEffect(() => {
    if (showConfetti) setTimeout(() => setShowConfetti(false), 15000);
  }, [showConfetti]);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {showConfetti && <Confetti />}
      
      {/* Enhanced Header */}
      <div className="flex items-center justify-between p-4 bg-black/40 backdrop-blur-md border-b border-gray-700/50">
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => navigate("/student/student-courses")}
            className="bg-blue-600 hover:bg-blue-700 text-white border-none shadow-lg hover:shadow-blue-500/25 transition-all duration-200"
            size="sm"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to My Courses
          </Button>
          <div className="hidden md:flex items-center space-x-3">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {studentCurrentCourseProgress?.courseDetails?.title}
            </h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Progress Indicator */}
          <div className="hidden sm:flex items-center space-x-2">
            <div className="w-32 bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium text-gray-300">{progressPercentage}%</span>
          </div>
          
          <Button 
            onClick={() => setIsSideBarOpen(!isSideBarOpen)}
            className="bg-gray-800 hover:bg-gray-700 border-gray-600"
            variant="outline"
          >
            {isSideBarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Video Content */}
        <div className={`flex-1 ${isSideBarOpen ? "mr-[420px]" : ""} transition-all duration-300`}>
          {/* Video Player Container */}
          <div className="relative bg-black">
            <VideoPlayer
              width="100%"
              height="500px"
              url={currentLecture?.videoUrl}
              onProgressUpdate={setCurrentLecture}
              progressData={currentLecture}
            />
          </div>
          
          {/* Navigation Controls - Outside Video Player */}
          <div className="flex items-center justify-between p-4 bg-gray-900/50 backdrop-blur-sm border-b border-gray-700/50">
            <Button
              onClick={goToPreviousLecture}
              disabled={currentLectureIndex === 0}
              className="bg-gray-800 hover:bg-gray-700 text-white border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              variant="outline"
              size="sm"
            >
              <SkipBack className="h-4 w-4 mr-2" />
              Previous Lecture
            </Button>
            
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span className="hidden sm:block">
                Lecture {currentLectureIndex + 1} of {studentCurrentCourseProgress?.courseDetails?.curriculum?.length || 0}
              </span>
              <div className="w-16 bg-gray-700 rounded-full h-1">
                <div 
                  className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                  style={{ width: `${((currentLectureIndex + 1) / (studentCurrentCourseProgress?.courseDetails?.curriculum?.length || 1)) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <Button
              onClick={goToNextLecture}
              disabled={currentLectureIndex === (studentCurrentCourseProgress?.courseDetails?.curriculum?.length || 0) - 1}
              className="bg-gray-800 hover:bg-gray-700 text-white border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              variant="outline"
              size="sm"
            >
              Next Lecture
              <SkipForward className="h-4 w-4 ml-2" />
            </Button>
          </div>
          
          {/* Enhanced Lecture Info */}
          <div className="p-6 bg-gradient-to-r from-gray-900/90 to-gray-800/90 backdrop-blur-sm">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2 text-white">{currentLecture?.title}</h2>
                <div className="flex items-center space-x-4 text-gray-400 text-sm">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>~15 mins</span>
                  </div>
                </div>
              </div>
              
              {/* Achievement Badge */}
              {studentCurrentCourseProgress?.progress?.find(
                (progressItem) => progressItem.lectureId === currentLecture?._id
              )?.viewed && (
                <div className="flex items-center space-x-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full border border-green-500/30">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-sm font-medium">Completed</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Sidebar */}
        <div className={`fixed top-[80px] right-0 bottom-0 w-[420px] bg-gradient-to-b from-gray-900/95 to-gray-800/95 backdrop-blur-xl border-l border-gray-700/50 transition-all duration-300 ${
          isSideBarOpen ? "translate-x-0" : "translate-x-full"
        }`}>
          <Tabs defaultValue="content" className="h-full flex flex-col">
            <TabsList className="grid bg-gray-800/50 w-full grid-cols-2 p-1 m-4 mb-0 rounded-lg">
              <TabsTrigger
                value="content"
                className="text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-md font-medium"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Course Content
              </TabsTrigger>
              <TabsTrigger
                value="overview"
                className="text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-md font-medium"
              >
                <Target className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="content" className="flex-1 mt-4">
              <ScrollArea className="h-full px-4">
                <div className="space-y-2 pb-6">
                  {studentCurrentCourseProgress?.courseDetails?.curriculum?.map(
                    (item, index) => {
                      const isCompleted = studentCurrentCourseProgress?.progress?.find(
                        (progressItem) => progressItem.lectureId === item._id
                      )?.viewed;
                      const isCurrent = currentLecture?._id === item._id;
                      
                      return (
                        <div
                          key={item._id}
                          onClick={() => selectLecture(item, index)}
                          className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200 group ${
                            isCurrent 
                              ? 'bg-blue-600/20 border border-blue-500/40 shadow-lg' 
                              : 'hover:bg-gray-700/50 hover:border-gray-600/50 border border-transparent'
                          }`}
                        >
                          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                            isCompleted 
                              ? 'bg-green-500 text-white' 
                              : isCurrent 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-gray-700 text-gray-400 group-hover:bg-gray-600'
                          }`}>
                            {isCompleted ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <Play className="h-4 w-4" />
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium truncate ${
                              isCurrent ? 'text-blue-300' : 'text-white'
                            }`}>
                              {item?.title}
                            </p>
                            <p className="text-xs text-gray-400">
                              Lecture {index + 1} • ~15 mins
                            </p>
                          </div>
                          
                          {isCurrent && (
                            <div className="flex-shrink-0">
                              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                            </div>
                          )}
                        </div>
                      );
                    }
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="overview" className="flex-1 mt-4 overflow-hidden">
              <ScrollArea className="h-full px-4">
                <div className="space-y-6 pb-6">
                  {/* Course Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-4 rounded-lg border border-blue-500/30">
                      <div className="flex items-center space-x-2">
                        <Award className="h-5 w-5 text-blue-400" />
                        <div>
                          <p className="text-lg font-bold text-white">{progressPercentage}%</p>
                          <p className="text-xs text-gray-400">Completed</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-green-600/20 to-teal-600/20 p-4 rounded-lg border border-green-500/30">
                      <div className="flex items-center space-x-2">
                        <BookOpen className="h-5 w-5 text-green-400" />
                        <div>
                          <p className="text-lg font-bold text-white">
                            {studentCurrentCourseProgress?.courseDetails?.curriculum?.length || 0}
                          </p>
                          <p className="text-xs text-gray-400">Lectures</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Course Description */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-white flex items-center">
                      <Star className="h-5 w-5 text-yellow-400 mr-2" />
                      About This Course
                    </h3>
                    <p className="text-gray-300 leading-relaxed text-sm">
                      {studentCurrentCourseProgress?.courseDetails?.description}
                    </p>
                  </div>
                  
                  {/* Instructor Info */}
                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
                    <h4 className="text-white font-medium mb-2 flex items-center">
                      <Award className="h-4 w-4 mr-2" />
                      Instructor
                    </h4>
                    <p className="text-gray-300 text-sm">
                      {studentCurrentCourseProgress?.courseDetails?.instructorName}
                    </p>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Enhanced Not Purchased Dialog */}
      <Dialog open={lockCourse}>
        <DialogContent className="sm:w-[425px] bg-gradient-to-br from-red-900/20 to-orange-900/20 border-red-500/30">
          <DialogHeader>
            <DialogTitle className="text-red-400 flex items-center">
              <X className="h-5 w-5 mr-2" />
              Access Restricted
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              You need to purchase this course to access the content. Please visit the course details page to enroll.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      
      {/* Enhanced Course Completion Dialog */}
      <Dialog open={showCourseCompleteDialog} onOpenChange={setShowCourseCompleteDialog}>
        <DialogContent className="sm:w-[500px] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center text-white flex items-center justify-center">
              <Award className="h-8 w-8 mr-3 text-yellow-400" />
              Congratulations! 🎉
            </DialogTitle>
            <DialogDescription className="text-center space-y-4">
              <div className="text-lg text-green-400 font-medium">
                You have successfully completed the course!
              </div>
              <div className="text-gray-300">
                Well done on finishing the course. You can now revisit any lecture or explore more courses.
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button 
                  onClick={() => {
                    setShowCourseCompleteDialog(false);
                    navigate("/student/student-courses");
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white flex-1 shadow-lg hover:shadow-blue-500/25 transition-all duration-200"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  My Courses
                </Button>
                <Button 
                  onClick={() => {
                    setShowCourseCompleteDialog(false);
                    handleRewatchCourse();
                  }}
                  variant="outline"
                  className="border-green-500 text-green-400 hover:bg-green-500/20 hover:border-green-400 flex-1 transition-all duration-200"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Rewatch Course
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default StudentViewCourseProgressPage;
