# API & Data Model

Base URL: `VITE_API_URL` (defaults to `http://localhost:5000`).
All authenticated routes expect `Authorization: Bearer <token>`.

---

## Auth

```
POST   /auth/register
POST   /auth/login
GET    /auth/check-auth
```

## AI

```
POST   /ai/generate-outline                              topic -> course outline (JSON mode)
POST   /ai/regenerate-field                              re-roll one landing-page field
POST   /ai/chat                                          tutor, Server-Sent Events stream
POST   /ai/generate-quiz                                 lecture groups -> MCQ questions
POST   /ai/save-quiz                                     persist quiz for a course
GET    /ai/quiz/:courseId                                fetch a course's quiz
POST   /ai/quiz/attempt                                  submit answers, graded server-side
GET    /ai/quiz-state/:userId/:courseId                  quiz + this student's attempts
```

## Courses — instructor

```
POST   /instructor/course/add
GET    /instructor/course/get
GET    /instructor/course/get/details/:id
PUT    /instructor/course/update/:id
```

## Media

```
POST   /media/upload                                     single file -> Cloudinary
POST   /media/bulk-upload                                max 10 files
DELETE /media/delete/:id
```

## Courses, payments & progress — student

```
GET    /student/course/get                               browse
GET    /student/course/get/details/:id
GET    /student/course/purchase-info/:id/:studentId

POST   /student/order/create                             PayPal order
POST   /student/order/capture
POST   /student/order/free-enroll

GET    /student/courses-bought/get/:studentId
POST   /student/courses-bought/unenroll

GET    /student/course-progress/get/:userId/:courseId
POST   /student/course-progress/mark-lecture-viewed
POST   /student/course-progress/update-lecture-duration
POST   /student/course-progress/reset-progress
```

---

## Data Model

```javascript
User      { userName, userEmail, password, role }        // role: "user" | "instructor"

Course    { instructorId, instructorName, title, subtitle, category, level,
            primaryLanguage, description, objectives, welcomeMessage, syllabus,
            image, pricing, isPublised,
            curriculum: [{ title, videoType, videoUrl, public_id,
                           freePreview, duration }],      // videoType: "upload" | "youtube"
            students:   [{ studentId, studentName, studentEmail, paidAmount }] }

Quiz      { courseId,                                     // unique — one per course
            config: { mode, lectureInterval, questionCount,
                      difficulty: { easy, medium, hard } },   // mode: "interval" | "end"
            groups: [{ lectureIndices, lectureNames,
                       questions: [{ question, options, correctAnswer,
                                     explanation, difficulty }] }] }

QuizAttempt    { userId, courseId, groupIndex, score, totalQuestions,
                 percentage, passed, answers, attemptDate }   // passed: >= 60%

CourseProgress { userId, courseId, completed, completionDate,
                 lecturesProgress: [{ lectureId, viewed, dateViewed }] }

Order          { userId, userName, userEmail, orderStatus, paymentMethod,
                 paymentStatus, orderDate, paymentId, payerId, instructorId,
                 instructorName, courseImage, courseTitle, courseId, coursePricing }
```

### Notes

- `Quiz.courseId` is unique — a course has at most one quiz, holding all its groups.
- `QuizAttempt` is upserted on `(userId, courseId, groupIndex)`, so a retake replaces the previous score rather than appending.
- `correctAnswer` is a zero-based index into `options` (0–3) and is only returned to the client after submission.
- `isPublised` is spelled as-is in the schema.
