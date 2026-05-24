import {
  courseCurriculumInitialFormData,
  courseLandingInitialFormData,
} from "@/config";
import { createContext, useState } from "react";

export const InstructorContext = createContext(null);

export const quizConfigInitial = {
  enabled: false,
  mode: "end",
  lectureInterval: 2,
  questionCount: 10,
  difficulty: { easy: 30, medium: 50, hard: 20 },
};

export default function InstructorProvider({ children }) {
  const [courseLandingFormData, setCourseLandingFormData] = useState(
    courseLandingInitialFormData
  );
  const [courseCurriculumFormData, setCourseCurriculumFormData] = useState(
    courseCurriculumInitialFormData
  );
  const [mediaUploadProgress, setMediaUploadProgress] = useState(false);
  const [mediaUploadProgressPercentage, setMediaUploadProgressPercentage] =
    useState(0);
  const [instructorCoursesList, setInstructorCoursesList] = useState([]);
  const [currentEditedCourseId, setCurrentEditedCourseId] = useState(null);

  // Quiz generator state
  const [quizConfig, setQuizConfig] = useState(quizConfigInitial);
  const [quizGroups, setQuizGroups] = useState([]);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);

  return (
    <InstructorContext.Provider
      value={{
        courseLandingFormData,
        setCourseLandingFormData,
        courseCurriculumFormData,
        setCourseCurriculumFormData,
        mediaUploadProgress,
        setMediaUploadProgress,
        mediaUploadProgressPercentage,
        setMediaUploadProgressPercentage,
        instructorCoursesList,
        setInstructorCoursesList,
        currentEditedCourseId,
        setCurrentEditedCourseId,
        quizConfig,
        setQuizConfig,
        quizGroups,
        setQuizGroups,
        isGeneratingQuiz,
        setIsGeneratingQuiz,
      }}
    >
      {children}
    </InstructorContext.Provider>
  );
}
