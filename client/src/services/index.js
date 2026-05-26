import axiosInstance from "@/api/axiosInstance";

export async function registerService(formData) {
  const { data } = await axiosInstance.post("/auth/register", {
    ...formData,
    role: formData.role || "user",
  });

  return data;
}

export async function loginService(formData) {
  const { data } = await axiosInstance.post("/auth/login", formData);

  return data;
}

export async function checkAuthService() {
  const { data } = await axiosInstance.get("/auth/check-auth");

  return data;
}

export async function mediaUploadService(formData) {
  const { data } = await axiosInstance.post("/media/upload", formData, {
    timeout: 0, // no timeout — video uploads can take minutes
  });

  return data;
}

export async function mediaDeleteService(id) {
  const { data } = await axiosInstance.delete(`/media/delete/${id}`);

  return data;
}

export async function fetchInstructorCourseListService() {
  const { data } = await axiosInstance.get(`/instructor/course/get`);

  return data;
}

export async function addNewCourseService(formData) {
  const { data } = await axiosInstance.post(`/instructor/course/add`, formData);

  return data;
}

export async function fetchInstructorCourseDetailsService(id) {
  const { data } = await axiosInstance.get(
    `/instructor/course/get/details/${id}`
  );

  return data;
}

export async function updateCourseByIdService(id, formData) {
  const { data } = await axiosInstance.put(
    `/instructor/course/update/${id}`,
    formData
  );

  return data;
}

export async function mediaBulkUploadService(formData) {
  const { data } = await axiosInstance.post("/media/bulk-upload", formData, {
    timeout: 0, // no timeout — video uploads can take minutes
  });

  return data;
}

export async function fetchStudentViewCourseListService(query) {
  const { data } = await axiosInstance.get(`/student/course/get?${query}`);

  return data;
}

export async function fetchStudentViewCourseDetailsService(courseId) {
  const { data } = await axiosInstance.get(
    `/student/course/get/details/${courseId}`
  );

  return data;
}

export async function checkCoursePurchaseInfoService(courseId, studentId) {
  const { data } = await axiosInstance.get(
    `/student/course/purchase-info/${courseId}/${studentId}`
  );

  return data;
}

export async function createPaymentService(formData) {
  const { data } = await axiosInstance.post(`/student/order/create`, formData);

  return data;
}

export async function captureAndFinalizePaymentService(
  paymentId,
  payerId,
  orderId
) {
  const { data } = await axiosInstance.post(`/student/order/capture`, {
    paymentId,
    payerId,
    orderId,
  });

  return data;
}

export async function enrollInFreeCourseService(formData) {
  const { data } = await axiosInstance.post(`/student/order/free-enroll`, formData);

  return data;
}

export async function fetchStudentBoughtCoursesService(studentId) {
  const { data } = await axiosInstance.get(
    `/student/courses-bought/get/${studentId}`
  );

  return data;
}

export async function getCurrentCourseProgressService(userId, courseId) {
  const { data } = await axiosInstance.get(
    `/student/course-progress/get/${userId}/${courseId}`
  );

  return data;
}

export async function markLectureAsViewedService(userId, courseId, lectureId) {
  const { data } = await axiosInstance.post(
    `/student/course-progress/mark-lecture-viewed`,
    {
      userId,
      courseId,
      lectureId,
    }
  );

  return data;
}

export async function resetCourseProgressService(userId, courseId) {
  const { data } = await axiosInstance.post(
    `/student/course-progress/reset-progress`,
    {
      userId,
      courseId,
    }
  );

  return data;
}

export async function updateLectureDurationService(courseId, lectureId, duration) {
  const { data } = await axiosInstance.post(
    `/student/course-progress/update-lecture-duration`,
    { courseId, lectureId, duration }
  );
  return data;
}

export async function unenrollCourseService(studentId, courseId) {
  const { data } = await axiosInstance.post(`/student/courses-bought/unenroll`, {
    studentId,
    courseId,
  });

  return data;
}

export const generateCourseOutlineService = async (topic, level, targetAudience, syllabus) => {
  const { data } = await axiosInstance.post("/ai/generate-outline", { topic, level, targetAudience, syllabus });
  return data;
};

export const regenerateCourseFieldService = async (fieldName, courseContext, instruction) => {
  const { data } = await axiosInstance.post("/ai/regenerate-field", { fieldName, courseContext, instruction });
  return data;
};

export async function submitQuizAttemptService(userId, courseId, groupIndex, answers) {
  const { data } = await axiosInstance.post("/ai/quiz/attempt", { userId, courseId, groupIndex, answers });
  return data;
}

export async function getQuizStateService(userId, courseId) {
  const { data } = await axiosInstance.get(`/ai/quiz-state/${userId}/${courseId}`);
  return data;
}

export async function generateQuizGroupsService(courseTitle, courseDescription, objectives, lectureGroups, config) {
  const { data } = await axiosInstance.post("/ai/generate-quiz", {
    courseTitle,
    courseDescription,
    objectives,
    lectureGroups,
    config,
  });
  return data;
}

export async function saveQuizService(courseId, config, groups) {
  const { data } = await axiosInstance.post("/ai/save-quiz", { courseId, config, groups });
  return data;
}

export async function getQuizByCourseService(courseId) {
  const { data } = await axiosInstance.get(`/ai/quiz/${courseId}`);
  return data;
}

// Streams AI tutor reply via Server-Sent Events. We use native fetch (not axios)
// because axios does not expose ReadableStream cleanly in browsers. The optional
// onChunk callback fires for every text chunk as it arrives, giving the UI a
// ChatGPT-style word-by-word render. Resolves once the stream completes with the
// full assembled reply (same response shape the non-streaming version returned).
export async function askAITutorService(courseId, message, history, detailed = false, onChunk) {
  const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const token = JSON.parse(sessionStorage.getItem("accessToken")) || "";

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000);

  try {
    const res = await fetch(`${baseURL}/ai/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: "include",
      body: JSON.stringify({ courseId, message, history, detailed }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data?.message || `Request failed (${res.status})`);
    }
    if (!res.body) {
      throw new Error("Streaming not supported in this browser.");
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let fullText = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      // SSE events are separated by a blank line; keep the trailing partial chunk in the buffer
      const blocks = buffer.split("\n\n");
      buffer = blocks.pop() || "";

      for (const block of blocks) {
        const line = block.trim();
        if (!line.startsWith("data:")) continue;
        const payload = line.slice(5).trim();
        if (!payload) continue;

        let evt;
        try {
          evt = JSON.parse(payload);
        } catch {
          continue;
        }

        if (evt.error) throw new Error(evt.error);
        if (evt.chunk) {
          fullText += evt.chunk;
          onChunk?.(evt.chunk);
        }
      }
    }

    return { success: true, data: { reply: fullText } };
  } finally {
    clearTimeout(timeout);
  }
}
