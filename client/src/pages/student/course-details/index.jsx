import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import VideoPlayer from "@/components/video-player";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import {
  checkCoursePurchaseInfoService,
  createPaymentService,
  enrollInFreeCourseService,
  fetchStudentViewCourseDetailsService,
} from "@/services";
import { 
  CheckCircle, 
  Globe, 
  Lock, 
  PlayCircle, 
  Users, 
  Calendar,
  Clock,
  Star,
  ArrowLeft,
  BookOpen,
  Award,
  Zap
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

function StudentViewCourseDetailsPage() {
  const {
    studentViewCourseDetails,
    setStudentViewCourseDetails,
    currentCourseDetailsId,
    setCurrentCourseDetailsId,
    loadingState,
    setLoadingState,
  } = useContext(StudentContext);

  const { auth } = useContext(AuthContext);

  const [displayCurrentVideoFreePreview, setDisplayCurrentVideoFreePreview] =
    useState(null);
  const [showFreePreviewDialog, setShowFreePreviewDialog] = useState(false);
  const [approvalUrl, setApprovalUrl] = useState("");
  const [isStudentAlreadyEnrolled, setIsStudentAlreadyEnrolled] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  async function fetchStudentViewCourseDetails() {
    // Check if student already enrolled/purchased the course
    const checkCoursePurchaseInfoResponse =
      await checkCoursePurchaseInfoService(
        currentCourseDetailsId,
        auth?.user._id
      );

    if (
      checkCoursePurchaseInfoResponse?.success &&
      checkCoursePurchaseInfoResponse?.data
    ) {
      setIsStudentAlreadyEnrolled(true);
      // Navigate to course progress if already enrolled
      navigate(`/student/course-progress/${currentCourseDetailsId}`);
      return;
    }

    const response = await fetchStudentViewCourseDetailsService(
      currentCourseDetailsId
    );

    if (response?.success) {
      setStudentViewCourseDetails(response?.data);
      setLoadingState(false);
    } else {
      setStudentViewCourseDetails(null);
      setLoadingState(false);
    }
  }

  function handleSetFreePreview(getCurrentVideoInfo) {
    console.log(getCurrentVideoInfo);
    setDisplayCurrentVideoFreePreview(getCurrentVideoInfo?.videoUrl);
  }

  async function handleCreatePayment() {
    // Check if course is free
    if (studentViewCourseDetails?.pricing === 0) {
      await handleFreeCourseEnrollment();
      return;
    }

    const paymentPayload = {
      userId: auth?.user?._id,
      userName: auth?.user?.userName,
      userEmail: auth?.user?.userEmail,
      orderStatus: "pending",
      paymentMethod: "paypal",
      paymentStatus: "initiated",
      orderDate: new Date(),
      paymentId: "",
      payerId: "",
      instructorId: studentViewCourseDetails?.instructorId,
      instructorName: studentViewCourseDetails?.instructorName,
      courseImage: studentViewCourseDetails?.image,
      courseTitle: studentViewCourseDetails?.title,
      courseId: studentViewCourseDetails?._id,
      coursePricing: studentViewCourseDetails?.pricing,
    };

    console.log(paymentPayload, "paymentPayload");
    const response = await createPaymentService(paymentPayload);

    if (response.success) {
      sessionStorage.setItem(
        "currentOrderId",
        JSON.stringify(response?.data?.orderId)
      );
      setApprovalUrl(response?.data?.approveUrl);
    }
  }

  async function handleFreeCourseEnrollment() {
    const enrollmentPayload = {
      userId: auth?.user?._id,
      userName: auth?.user?.userName,
      userEmail: auth?.user?.userEmail,
      instructorId: studentViewCourseDetails?.instructorId,
      instructorName: studentViewCourseDetails?.instructorName,
      courseImage: studentViewCourseDetails?.image,
      courseTitle: studentViewCourseDetails?.title,
      courseId: studentViewCourseDetails?._id,
    };

    try {
      const response = await enrollInFreeCourseService(enrollmentPayload);
      if (response.success) {
        alert("Successfully enrolled in free course!");
        // Navigate to course progress page
        window.location.href = `/student/course-progress/${studentViewCourseDetails?._id}`;
      }
    } catch (error) {
      console.error("Free enrollment error:", error);
      alert("Failed to enroll in course. Please try again.");
    }
  }

  useEffect(() => {
    if (displayCurrentVideoFreePreview !== null) setShowFreePreviewDialog(true);
  }, [displayCurrentVideoFreePreview]);

  useEffect(() => {
    if (currentCourseDetailsId !== null) fetchStudentViewCourseDetails();
  }, [currentCourseDetailsId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (id) setCurrentCourseDetailsId(id);
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!location.pathname.includes("course/details"))
      setStudentViewCourseDetails(null),
        setCurrentCourseDetailsId(null);
  }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loadingState) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-56 w-full" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (approvalUrl !== "") {
    window.location.href = approvalUrl;
  }

  const getIndexOfFreePreviewUrl =
    studentViewCourseDetails !== null
      ? studentViewCourseDetails?.curriculum?.findIndex(
          (item) => item.freePreview
        )
      : -1;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/student/courses')}
            className="flex items-center gap-2 hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Courses
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="mb-4 flex flex-wrap gap-2">
                <Badge className="bg-blue-500 hover:bg-blue-600">
                  {studentViewCourseDetails?.category}
                </Badge>
                <Badge className="bg-green-500 hover:bg-green-600">
                  {studentViewCourseDetails?.level?.toUpperCase()}
                </Badge>
                {studentViewCourseDetails?.pricing === 0 && (
                  <Badge className="bg-yellow-500 hover:bg-yellow-600">
                    FREE COURSE
                  </Badge>
                )}
              </div>
              
              <h1 className="text-4xl font-bold mb-4">
                {studentViewCourseDetails?.title}
              </h1>
              <p className="text-xl text-blue-100 mb-6">
                {studentViewCourseDetails?.subtitle}
              </p>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{studentViewCourseDetails?.students?.length} students</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Created {new Date(studentViewCourseDetails?.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span>{studentViewCourseDetails?.primaryLanguage}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{studentViewCourseDetails?.curriculum?.length} lessons</span>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-800 bg-opacity-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="h-5 w-5" />
                  <span className="font-semibold">Created by {studentViewCourseDetails?.instructorName}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="ml-1">4.8 instructor rating</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Video - Mobile/Tablet */}
            <div className="lg:hidden">
              <Card className="bg-white bg-opacity-10 backdrop-blur-sm border-white border-opacity-20">
                <CardContent className="p-6">
                  <div className="aspect-video mb-4 rounded-lg overflow-hidden">
                    <VideoPlayer
                      url={
                        getIndexOfFreePreviewUrl !== -1
                          ? studentViewCourseDetails?.curriculum[
                              getIndexOfFreePreviewUrl
                            ].videoUrl
                          : ""
                      }
                      width="100%"
                      height="200px"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* What you'll learn */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  What you&apos;ll learn
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {studentViewCourseDetails?.objectives
                    .split(",")
                    .map((objective, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{objective.trim()}</span>
                      </li>
                    ))}
                </ul>
              </CardContent>
            </Card>

            {/* Course Description */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  Course Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    {studentViewCourseDetails?.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Course Curriculum */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PlayCircle className="h-5 w-5 text-purple-600" />
                  Course Curriculum
                  <Badge variant="secondary">
                    {studentViewCourseDetails?.curriculum?.length} lessons
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {studentViewCourseDetails?.curriculum?.map(
                    (curriculumItem, index) => (
                      <div
                        key={index}
                        className={`${
                          curriculumItem?.freePreview
                            ? "cursor-pointer hover:bg-blue-50"
                            : "cursor-not-allowed opacity-75"
                        } flex items-center gap-3 p-4 rounded-lg border transition-colors`}
                        onClick={
                          curriculumItem?.freePreview
                            ? () => handleSetFreePreview(curriculumItem)
                            : null
                        }
                      >
                        <div className="flex-shrink-0">
                          {curriculumItem?.freePreview ? (
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <PlayCircle className="h-4 w-4 text-green-600" />
                            </div>
                          ) : (
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                              <Lock className="h-4 w-4 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {index + 1}. {curriculumItem?.title}
                          </h4>
                          {curriculumItem?.freePreview && (
                            <span className="text-sm text-green-600 font-medium">
                              Free Preview Available
                            </span>
                          )}
                        </div>
                        {curriculumItem?.freePreview && (
                          <Badge className="bg-green-500 hover:bg-green-600">
                            Preview
                          </Badge>
                        )}
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:block hidden">
            <div className="sticky top-8">
              <Card className="shadow-xl border-0">
                <CardContent className="p-6">
                  {/* Video Preview */}
                  <div className="aspect-video mb-6 rounded-lg overflow-hidden bg-gray-900">
                    <VideoPlayer
                      url={
                        getIndexOfFreePreviewUrl !== -1
                          ? studentViewCourseDetails?.curriculum[
                              getIndexOfFreePreviewUrl
                            ].videoUrl
                          : ""
                      }
                      width="100%"
                      height="200px"
                    />
                  </div>
                  
                  {/* Pricing */}
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-gray-900 mb-2">
                      {studentViewCourseDetails?.pricing === 0 ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        <span>${studentViewCourseDetails?.pricing}</span>
                      )}
                    </div>
                    {studentViewCourseDetails?.pricing > 0 && (
                      <p className="text-sm text-gray-600">One-time payment</p>
                    )}
                  </div>
                  
                  {/* Enroll Button */}
                  <Button 
                    onClick={handleCreatePayment} 
                    className="w-full h-12 text-lg font-semibold bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Zap className="mr-2 h-5 w-5" />
                    {studentViewCourseDetails?.pricing === 0 ? "Enroll Now (Free)" : "Buy Now"}
                  </Button>
                  
                  {/* Course Features */}
                  <div className="mt-6 space-y-3">
                    <h4 className="font-semibold text-gray-900">This course includes:</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <PlayCircle className="h-4 w-4" />
                        <span>{studentViewCourseDetails?.curriculum?.length} on-demand video lessons</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        <span>Full lifetime access</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4" />
                        <span>Certificate of completion</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>Access on mobile and desktop</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Dialog */}
      <Dialog
        open={showFreePreviewDialog}
        onOpenChange={() => {
          setShowFreePreviewDialog(false);
          setDisplayCurrentVideoFreePreview(null);
        }}
      >
        <DialogContent className="w-[90vw] max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <PlayCircle className="h-5 w-5" />
              Course Preview
            </DialogTitle>
          </DialogHeader>
          <div className="aspect-video rounded-lg overflow-hidden bg-gray-900">
            <VideoPlayer
              url={displayCurrentVideoFreePreview}
              width="100%"
              height="400px"
            />
          </div>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            <h4 className="font-semibold text-gray-900">Available Previews:</h4>
            {studentViewCourseDetails?.curriculum
              ?.filter((item) => item.freePreview)
              .map((filteredItem, index) => (
                <button
                  key={index}
                  onClick={() => handleSetFreePreview(filteredItem)}
                  className="w-full text-left p-2 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <PlayCircle className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">{filteredItem?.title}</span>
                  </div>
                </button>
              ))}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close Preview</Button>
            </DialogClose>
            <Button onClick={handleCreatePayment}>
              {studentViewCourseDetails?.pricing === 0 ? "Enroll Now (Free)" : "Enroll Now"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default StudentViewCourseDetailsPage;
