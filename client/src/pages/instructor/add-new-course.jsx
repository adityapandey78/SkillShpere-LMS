import CourseCurriculum from "@/components/instructor-view/courses/add-new-course/course-curriculum";
import CourseLanding from "@/components/instructor-view/courses/add-new-course/course-landing";
import CourseSettings from "@/components/instructor-view/courses/add-new-course/course-settings";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  courseCurriculumInitialFormData,
  courseLandingInitialFormData,
} from "@/config";
import { AuthContext } from "@/context/auth-context";
import { InstructorContext } from "@/context/instructor-context";
import {
  addNewCourseService,
  fetchInstructorCourseDetailsService,
  updateCourseByIdService,
} from "@/services";
import { cn } from "@/lib/utils";
import { useContext, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

const DEFAULT_THUMBNAIL = "/images/default_thumbnail.jpg";

function AddNewCoursePage() {
  const {
    courseLandingFormData,
    courseCurriculumFormData,
    setCourseLandingFormData,
    setCourseCurriculumFormData,
    currentEditedCourseId,
    setCurrentEditedCourseId,
  } = useContext(InstructorContext);

  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const params = useParams();

  // Snapshot of the data as it was when the course was last loaded (edit mode)
  const originalDataRef = useRef(null);

  const REQUIRED_LANDING = ["title", "category", "level", "primaryLanguage", "subtitle", "description", "objectives"];
  const FIELD_LABELS = { title: "Title", category: "Category", level: "Level", primaryLanguage: "Primary Language", subtitle: "Subtitle", description: "Description", objectives: "Objectives" };
  const YT_PATTERN = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}/;
  const isEditing = currentEditedCourseId !== null;

  // Returns the first specific reason the form can't be saved, or "" if it can.
  function getBlockReason() {
    for (const k of REQUIRED_LANDING) {
      if (!(courseLandingFormData[k] ?? "").toString().trim()) {
        return `"${FIELD_LABELS[k]}" is required`;
      }
    }

    // pricing: if provided, must be a valid non-negative number; empty = free (0)
    const pricingVal = courseLandingFormData.pricing;
    if (pricingVal !== "" && pricingVal !== undefined && pricingVal !== null) {
      const price = parseFloat(pricingVal);
      if (isNaN(price) || price < 0) return "Pricing must be 0 or a positive number";
    }

    if (courseCurriculumFormData.length === 0) return "Add at least one lecture";

    for (const item of courseCurriculumFormData) {
      if (!item.title?.trim()) return "Every lecture needs a title";
      if (!item.videoUrl?.trim()) return "Every lecture needs a video";
      if (item.videoType === "youtube" && !YT_PATTERN.test(item.videoUrl))
        return "One of the YouTube URLs is invalid";
      if (item.videoType !== "youtube" && !item.public_id)
        return "One of the uploaded videos is not ready yet";
    }

    if (isEditing && !hasChanges()) return "No changes to save";

    return "";
  }

  function hasChanges() {
    if (!originalDataRef.current) return true;
    return (
      JSON.stringify(courseLandingFormData) !== JSON.stringify(originalDataRef.current.landing) ||
      JSON.stringify(courseCurriculumFormData) !== JSON.stringify(originalDataRef.current.curriculum)
    );
  }

  const blockReason = getBlockReason();
  const canSave = blockReason === "";
  const tooltipMsg = blockReason;

  async function handleCreateCourse() {
    if (!canSave) return;

    const courseFinalFormData = {
      instructorId: auth?.user?._id,
      instructorName: auth?.user?.userName,
      date: new Date(),
      ...courseLandingFormData,
      // Fall back to the default thumbnail if none uploaded
      image: courseLandingFormData.image || DEFAULT_THUMBNAIL,
      students: [],
      curriculum: courseCurriculumFormData,
      isPublished: true,
    };

    try {
      const response =
        currentEditedCourseId !== null
          ? await updateCourseByIdService(currentEditedCourseId, courseFinalFormData)
          : await addNewCourseService(courseFinalFormData);

      if (response?.success) {
        setCourseLandingFormData(courseLandingInitialFormData);
        setCourseCurriculumFormData(courseCurriculumInitialFormData);
        originalDataRef.current = null;
        navigate(-1);
        setCurrentEditedCourseId(null);
      }
    } catch (error) {
      console.error("Error saving course:", error);
    }
  }

  async function fetchCurrentCourseDetails() {
    const response = await fetchInstructorCourseDetailsService(currentEditedCourseId);

    if (response?.success) {
      const setCourseFormData = Object.keys(courseLandingInitialFormData).reduce((acc, key) => {
        acc[key] = response?.data[key] || courseLandingInitialFormData[key];
        return acc;
      }, {});

      setCourseLandingFormData(setCourseFormData);
      setCourseCurriculumFormData(response?.data?.curriculum);

      // Store a deep-clone snapshot so hasChanges() can compare against it
      originalDataRef.current = {
        landing: JSON.parse(JSON.stringify(setCourseFormData)),
        curriculum: JSON.parse(JSON.stringify(response?.data?.curriculum)),
      };
    }
  }

  useEffect(() => {
    if (currentEditedCourseId !== null) fetchCurrentCourseDetails();
  }, [currentEditedCourseId]);

  useEffect(() => {
    if (params?.courseId) setCurrentEditedCourseId(params?.courseId);
  }, [params?.courseId]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">
            {isEditing ? "Edit Course" : "Create a new course"}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEditing ? "Update your course details" : "Fill in the details to create your course"}
          </p>
        </div>

        {/* Save button with tooltip on disabled state */}
        <div className="relative group/save-btn inline-block">
          <Button
            onClick={canSave ? handleCreateCourse : undefined}
            className={cn(
              "px-8 py-6 text-base font-semibold rounded-lg transition-all duration-200",
              canSave
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg cursor-pointer"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white opacity-40 pointer-events-none cursor-not-allowed"
            )}
          >
            Save
          </Button>
          {!canSave && (
            <div className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-md shadow-lg whitespace-nowrap opacity-0 group-hover/save-btn:opacity-100 transition-opacity duration-150 pointer-events-none z-50">
              {tooltipMsg}
              <div className="absolute top-full right-4 border-4 border-transparent border-t-gray-900" />
            </div>
          )}
        </div>
      </div>

      <Card className="border-0 shadow-xl bg-white">
        <CardContent className="p-6">
          <div className="w-full">
            <Tabs defaultValue="course-landing-page" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-lg">
                <TabsTrigger
                  value="course-landing-page"
                  className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm rounded-md font-semibold transition-all"
                >
                  Course Overview
                </TabsTrigger>
                <TabsTrigger
                  value="curriculum"
                  className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm rounded-md font-semibold transition-all"
                >
                  Curriculum
                </TabsTrigger>
                <TabsTrigger
                  value="settings"
                  className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm rounded-md font-semibold transition-all"
                >
                  Settings
                </TabsTrigger>
              </TabsList>
              <TabsContent value="course-landing-page">
                <CourseLanding />
              </TabsContent>
              <TabsContent value="curriculum">
                <CourseCurriculum />
              </TabsContent>
              <TabsContent value="settings">
                <CourseSettings />
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AddNewCoursePage;
