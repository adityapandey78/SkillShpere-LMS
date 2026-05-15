# SkillSphere LMS — Making It Unique for Final Year Presentation

## Context
This is advisory + implementation planning for upgrading a functional Udemy-clone LMS into something that stands out in an 8-credit final year project defense. The evaluator is strict. The project needs technical depth, originality, and real demo-able wow moments.

---

## Honest Rating: 5.5 / 10 (as it stands today)

**What's good:**
- Full-stack production deployment (Vercel + MongoDB Atlas + Cloudinary)
- PayPal payment integration (most students skip this)
- Video progress tracking per lecture
- Certificate generation with unique IDs
- Instructor + student role separation

**Why it's only a 5.5:**
- It is a textbook Udemy clone. The evaluator has seen 50 of these.
- Zero AI/ML integration in a 2026 project is a red flag.
- No real-time features.
- No content differentiation — every LMS does Cloudinary video upload.
- No analytics for instructors (no data to show impact).
- The "unique selling point" is hard to articulate in 2 sentences.

**Target: Push it to 8.5/10. Here's how.**

---

## Feature 1: YouTube Video Support (Easy, 4–6 hours)

### Why it matters to evaluators
Shows you understand real-world constraints — not every instructor can upload 4K video to Cloudinary. This is what Coursera and edX actually do.

### How to implement
`react-player` already supports YouTube URLs — this is already installed. Zero new dependencies.

**Changes needed:**
1. `server/models/Course.js` — add `videoType: { type: String, enum: ['upload', 'youtube'], default: 'upload' }` to curriculum subdocument
2. `client/src/pages/instructor/add-new-course.jsx` (CourseCurriculum tab) — add a toggle: "Upload Video" vs "Paste YouTube URL". Show URL input field when YouTube selected.
3. `client/src/services/index.js` — the saveCourseCurriculum API call already passes the full curriculum array, no backend route change needed.
4. `client/src/components/video-player/index.jsx` — ReactPlayer already accepts YouTube URLs as `url` prop. Just pass `videoUrl` directly. Done.
5. Block YouTube timestamp tracking (progress marking) — set a flag to auto-mark YouTube lectures as viewed after X seconds since you can't track exact % on embedded YT.

**Evaluator talking point:** "Instructors can embed popular MIT OpenCourseWare, crash course, or their own YouTube content without storage costs."

---

## Feature 2: AI Course Assistant (High Impact, 2–3 days)

This is the single highest-ROI feature for impressing an evaluator.

### Concept
A per-course AI chatbot on the course progress page. Students can ask questions about the course topic. The AI is primed with the course title, description, and objectives as context.

### Using Claude API (claude-haiku-4-5-20251001 for speed + cost)
**Backend changes:**
1. New file: `server/routes/ai-routes/index.js`
2. New controller: `server/controllers/ai-controller/chat-controller.js`
   - POST `/ai/chat` — accepts `{ courseId, message, history }`
   - Fetches course from DB to get title + description + objectives
   - Calls Claude API with system prompt: "You are a learning assistant for the course [title]. Course objectives: [objectives]. Answer questions clearly, give examples, encourage the student."
   - Streams response back or returns full text
3. Add to `server/server.js`: `app.use("/ai", aiRoutes)`

**Frontend changes:**
1. `client/src/pages/student/course-progress/index.jsx` — add a collapsible "AI Tutor" panel on the right sidebar (currently has course content list there)
2. Chat UI: message bubbles, input box, send button
3. `client/src/services/index.js` — add `askAITutor(courseId, message, history)` API call

**Evaluator talking point:** "Students get instant, context-aware help without leaving the course. The AI knows the course objectives and adapts its answers accordingly."

**Cost:** Claude Haiku is ~$0.001 per conversation. Negligible.

---

## Feature 3: AI Quiz Generator (Very High Impact, 2 days)

### Concept
Instructors click "Generate Quiz" on a course, Claude reads the course description + objectives and generates 5–10 MCQ questions. Students can take the quiz after completing the course, get a score, and this score prints on their certificate.

### Backend
1. New controller: `server/controllers/ai-controller/quiz-controller.js`
   - POST `/ai/generate-quiz` — takes courseId, calls Claude with course data, returns JSON array of `{question, options: [A,B,C,D], correct: "B", explanation}`
2. New model: `server/models/Quiz.js` — `{ courseId, questions: [...], createdAt }`
3. New model: `server/models/QuizAttempt.js` — `{ userId, courseId, score, totalQuestions, attemptDate }`

### Frontend
1. Instructor course page — "Generate AI Quiz" button
2. Student certificate page — show quiz score on certificate if attempted
3. New page: `/student/course-progress/:id/quiz` — take the quiz after course completion

### Evaluator talking point
"The AI generates assessments automatically from course content. Certificates include verified quiz scores, making them more meaningful than simple completion certificates."

---

## Feature 4: Instructor Analytics Dashboard (Medium Impact, 1 day)

The existing instructor dashboard has NO data visualization. Add:
- Total revenue chart (by month) using recharts (not installed — add it)
- Top performing course by enrollment
- Student completion rate per course
- Average quiz scores

**Data is already in the DB** — Orders, CourseProgress, QuizAttempts. Just aggregate it.

**Backend:** New route `GET /instructor/analytics/:instructorId` that runs MongoDB aggregation pipelines.

**Evaluator talking point:** "Instructors can see which courses are working and which aren't, enabling data-driven content decisions."

---

## Feature 5: Discussion Forum / Q&A per Course (Medium Impact, 1–2 days)

Most Udemy clones skip this. A simple threaded Q&A under each course:
- Students post questions, instructors + other students answer
- Upvote system (simple counter)
- Model: `{ courseId, userId, userName, question, answers: [{userId, text, upvotes}], createdAt }`

---

## Feature 6: Video Transcript Search + Timestamp Jump (High Impact, 2 days)

### Concept
When a video is uploaded, auto-transcribe it using AssemblyAI (free tier: 5 hours/month). Store the transcript with word-level timestamps in MongoDB. Students can type "explain recursion" in a search box on the course progress page and jump directly to that moment in any lecture.

This is a technically differentiated feature — evaluators have not seen this in a student project.

### Backend
1. `server/controllers/instructor-controller/media-controller.js` — after Cloudinary upload succeeds, fire an async job to AssemblyAI with the video URL. Poll for completion, store result.
2. New model: `server/models/Transcript.js` — `{ courseId, lectureId, words: [{text, start, end, confidence}], fullText: String }`
3. New route: `GET /student/search-transcript?courseId=&q=` — full-text search across `fullText` fields, return `{ lectureId, lectureTitle, timestamp, snippet }`

### Frontend
1. `client/src/pages/student/course-progress/index.jsx` — search box above the curriculum list. Results show lecture title + preview text. Click → seek the video player to the matched timestamp.
2. `client/src/components/video-player/index.jsx` — expose a `seekTo(seconds)` ref method.

### Dependencies
- `server/`: `assemblyai` npm package (free tier sufficient for demo)
- New env var: `ASSEMBLYAI_API_KEY`

**Evaluator talking point:** "Students can search across all video content by keyword and jump to the exact moment it's discussed — like Google search inside your course videos."

---

## Feature 7: AI Course Outline Generator for Instructors (High Impact, 1 day)

### Concept
On the course creation page, instructor types just a topic (e.g., "Python for Beginners") and clicks "Generate with AI". Claude returns a structured course outline: sections, lecture titles, learning objectives, and a course description. This pre-fills the entire form, reducing course creation time from hours to minutes.

### Backend
1. `server/controllers/ai-controller/outline-controller.js`
   - POST `/ai/generate-outline` — accepts `{ topic, level, targetAudience }`
   - Calls Claude with prompt: generate a JSON course outline with `{ title, subtitle, description, objectives, curriculum: [{sectionTitle, lectures: [{title, duration}]}] }`
   - Returns structured JSON

### Frontend
1. `client/src/pages/instructor/add-new-course.jsx` — on the "Course Landing Page" tab, add an "AI Generate" button at the top. Opens a small dialog: enter topic + level + target audience. On submit, calls the API and auto-fills all form fields (title, description, objectives, curriculum list).
2. Instructor reviews, edits if needed, then proceeds with normal video uploads.

**Evaluator talking point:** "Instructors can create a complete, professional course structure in under 60 seconds. AI handles the blank-page problem — instructors focus on recording, not writing."

---

## Feature 8: Smart Learning Nudge Notifications (Medium-High Impact, 1–2 days)

### Concept
Detect when an enrolled student hasn't made progress in 3+ days on an in-progress course. Send a personalized browser push notification (Web Push API) or email nudge. Message is AI-personalized based on their progress: "You're 73% through React Fundamentals — only 3 lectures left!"

### Implementation Options (pick one for demo)
**Option A — Email nudges (simpler, 1 day):**
- Use Nodemailer + Gmail SMTP (free)
- Cron job on server: every 24 hours, query CourseProgress for users where `completed: false` and `lastActivity > 3 days ago`
- Send personalized email with course name, progress %, and a deep link back to the course

**Option B — Browser Push Notifications (more impressive, 2 days):**
- Use `web-push` npm package on server
- On first visit, student accepts push permission in browser
- Store `pushSubscription` object in User model
- Same cron job sends Web Push instead of email

**Backend:**
1. New cron job: `server/jobs/nudge-job.js` — runs via `node-cron`, queries inactive students, sends notifications
2. `server/models/User.js` — add `pushSubscription` field (for Option B) or just use existing `userEmail`

**Frontend (Option B only):**
1. Service worker: `client/public/sw.js` — handles push events
2. `client/src/context/AuthContext.jsx` — on login, request notification permission and register push subscription

**Evaluator talking point:** "The platform actively fights drop-off — the #1 problem in online education — with AI-personalized nudges that know exactly how far each student is from finishing."

---

## Priority Order (full updated list)

| Priority | Feature | Time | Demo Impact | Rating Contribution |
|----------|---------|------|-------------|---------------------|
| 1 | YouTube video support | 4–6h | Medium | +0.5 |
| 2 | AI Course Assistant (chatbot) | 2 days | **VERY HIGH** | +1.0 |
| 3 | AI Quiz Generator | 2 days | **VERY HIGH** | +1.0 |
| 4 | AI Course Outline Generator | 1 day | **HIGH** | +0.5 |
| 5 | Video Transcript Search | 2 days | **HIGH** | +0.75 |
| 6 | Smart Learning Nudges | 1–2 days | High | +0.5 |
| 7 | Instructor Analytics | 1 day | Medium | +0.25 |
| 8 | Discussion Forum | 1–2 days | Medium | +0.25 |

**Minimum for a 9.5/10 demo: Features 1 + 2 + 3 + 4 + 5.**
Total estimated time: ~8–9 days of focused work.

---

## Revised Target Rating with All 8 Features: 9.5–10 / 10

**Defense pitch:**
> "SkillSphere is an AI-augmented LMS where instructors generate complete course structures in 60 seconds with AI, students receive real-time AI tutoring and AI-generated assessments, and our transcript search lets learners find any concept across all video content instantly — while smart nudges proactively fight the 90% drop-off rate that plagues online education."

No evaluator can give that less than a 9.

---

## Critical Files to Modify

- `server/models/Course.js` — add `videoType` to curriculum subdocument
- `server/models/User.js` — add `pushSubscription` field (Feature 8B)
- `server/server.js` — register ai-routes, transcript-routes
- `client/src/components/video-player/index.jsx` — YouTube passthrough + `seekTo` ref
- `client/src/pages/student/course-progress/index.jsx` — AI chat panel + transcript search
- `client/src/pages/student/certificate/index.jsx` — show quiz score
- `client/src/pages/instructor/add-new-course.jsx` — AI outline generator button
- `client/src/services/index.js` — all new API calls
- `client/src/config/index.js` — any new form configs

## New Files to Create

**Server:**
- `server/routes/ai-routes/index.js`
- `server/controllers/ai-controller/chat-controller.js`
- `server/controllers/ai-controller/quiz-controller.js`
- `server/controllers/ai-controller/outline-controller.js`
- `server/models/Quiz.js`
- `server/models/QuizAttempt.js`
- `server/models/Transcript.js`
- `server/jobs/nudge-job.js`

**Client:**
- `client/src/pages/student/quiz/index.jsx`
- `client/public/sw.js` (service worker, only for push notifications)

## Dependencies to Add

**Server:**
- `@anthropic-ai/sdk` — Claude API (AI chat, quiz, outline)
- `assemblyai` — video transcription
- `node-cron` — scheduled nudge job
- `nodemailer` — email nudges (Option A) OR `web-push` (Option B)

**Client:**
- `recharts` — analytics charts (Feature 7, optional)

## Environment Variables Needed
- `ANTHROPIC_API_KEY`
- `ASSEMBLYAI_API_KEY`
- `EMAIL_USER` + `EMAIL_PASS` (if using email nudges)
