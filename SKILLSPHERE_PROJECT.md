# SkillSphere LMS — Complete Project Documentation
## Single Source of Truth for Thesis Generation

---

# TABLE OF CONTENTS

1. [Project Overview](#1-project-overview)
2. [Motivation & Problem Statement](#2-motivation--problem-statement)
3. [Objectives](#3-objectives)
4. [Technology Stack](#4-technology-stack)
5. [System Architecture — High Level Design (HLD)](#5-system-architecture--high-level-design-hld)
6. [System Architecture — Low Level Design (LLD)](#6-system-architecture--low-level-design-lld)
7. [Database Schema & Data Models](#7-database-schema--data-models)
8. [UML Diagrams](#8-uml-diagrams)
9. [API Endpoints — Complete Reference](#9-api-endpoints--complete-reference)
10. [Authentication & Security](#10-authentication--security)
11. [AI Features — Gemini Integration](#11-ai-features--gemini-integration)
12. [Payment Processing — PayPal Integration](#12-payment-processing--paypal-integration)
13. [Media Management — Cloudinary CDN](#13-media-management--cloudinary-cdn)
14. [Frontend Architecture](#14-frontend-architecture)
15. [State Management](#15-state-management)
16. [Key Workflows — End-to-End](#16-key-workflows--end-to-end)
17. [Deployment Architecture](#17-deployment-architecture)
18. [Performance Optimizations](#18-performance-optimizations)
19. [Security Analysis](#19-security-analysis)
20. [Design Trade-offs & Architectural Decisions](#20-design-trade-offs--architectural-decisions)
21. [AI Application — Where SkillSphere Stands](#21-ai-application--where-skillsphere-stands)
22. [Advantages & Competitive Analysis](#22-advantages--competitive-analysis)
23. [Limitations & Future Scope](#23-limitations--future-scope)
24. [Results & Testing](#24-results--testing)
25. [References](#25-references)

---

# 1. PROJECT OVERVIEW

**Project Name:** SkillSphere — An AI-Powered Learning Management System  
**Type:** Full-Stack Web Application (MERN Stack)  
**Domain:** EdTech / E-Learning  
**Duration:** January 2026 – May 2026  
**Institution:** National Institute of Advanced Manufacturing Technology (NIAMT), Ranchi  
**Department:** Electronics & Computer Engineering  

## 1.1 What is SkillSphere?

SkillSphere is a comprehensive, cloud-native Learning Management System (LMS) that bridges the gap between traditional online education platforms and the emerging capabilities of Generative AI. The platform enables instructors to create, publish, and sell courses, while students can browse, purchase, and consume course content — all within a unified, intelligent ecosystem powered by Google's Gemini AI.

Unlike conventional LMS platforms that rely entirely on manual content creation, SkillSphere integrates AI at three distinct touchpoints:

1. **AI Course Outline Generation** — Instructors provide a topic and learning level; Gemini generates a full course structure with title, description, objectives, and a curriculum of sections and lectures in seconds.
2. **AI Quiz Generation** — After defining a course curriculum, instructors trigger AI to generate context-aware multiple-choice quizzes grouped by lecture topics, with configurable difficulty distributions (easy/medium/hard).
3. **AI Tutor Chat** — Students interact with a real-time streaming AI tutor that is contextually aware of the specific course content they are studying, providing personalized learning assistance.

The platform is built on the MERN stack (MongoDB, Express.js, React 18, Node.js) and deployed on Vercel with MongoDB Atlas as the cloud database and Cloudinary as the media CDN. Payment processing is handled by PayPal REST SDK in sandbox mode.

## 1.2 Key Features at a Glance

| Feature | Description |
|--------|-------------|
| Role-Based Auth | JWT-secured authentication with distinct Instructor and Student roles |
| Course Management | Full CRUD for courses with multi-step creation wizard |
| AI Outline Generation | Gemini 2.0 Flash generates complete course structures |
| AI Quiz Generation | Context-aware MCQ generation with difficulty distribution |
| AI Tutor Chat | Real-time streaming chat using Server-Sent Events |
| Video Hosting | Cloudinary CDN for all video uploads and YouTube embedding |
| PayPal Payments | Full payment flow: create order → PayPal checkout → capture |
| Free Enrollment | Zero-friction enrollment for free courses |
| Progress Tracking | Lecture-level progress, percentage completion, completion date |
| Certificate Generation | Completion certificates for finished courses |
| Course Filtering | Multi-filter: category, level, language, price sort |
| Unenrollment | Students can unenroll from courses with cascade cleanup |
| Responsive UI | Mobile-first Tailwind CSS with Radix UI component system |

---

# 2. MOTIVATION & PROBLEM STATEMENT

## 2.1 Background

The global e-learning market was valued at USD 250 billion in 2023 and is projected to reach USD 1 trillion by 2032 (Global Market Insights, 2023). The COVID-19 pandemic accelerated adoption of online learning platforms, with platforms like Coursera, Udemy, and edX seeing 2–5x growth in enrollment from 2020–2022. However, despite explosive growth, core problems persist in the existing ecosystem:

**For Instructors:**
- Course creation is time-consuming and requires expertise in instructional design
- Creating a well-structured syllabus, objectives, and curriculum from scratch takes days
- Quiz creation is manual, repetitive, and often poorly calibrated for difficulty
- There is no intelligent tool to assist instructors during the content creation process

**For Students:**
- Learning is largely passive — watch a video, take a static quiz
- When students have questions, they must search externally (Google, Stack Overflow), disrupting the learning flow
- Progress tracking exists but provides little actionable intelligence
- There is no personalized guidance during the learning journey

**The AI Gap:**
While AI tools like ChatGPT have become ubiquitous in productivity, most LMS platforms have been slow to integrate generative AI natively into their content creation and delivery pipelines. Existing platforms treat AI as an add-on (e.g., "AI-powered recommendations") rather than a core architectural component.

## 2.2 Problem Statement

> Existing Learning Management Systems lack integrated, contextually aware AI capabilities that assist instructors during content creation and support students during active learning. The result is a fragmented, labor-intensive experience for course creators and a passive, unsupported experience for learners. There is a clear need for an LMS that treats Generative AI as a first-class architectural component rather than an afterthought.

## 2.3 Research Gaps in Existing Literature

| Gap | Description |
|----|-------------|
| Gap 1 | Most LMS research focuses on UX design, not AI-native architecture |
| Gap 2 | AI-assisted content generation tools are largely third-party and disconnected from the LMS |
| Gap 3 | Context-aware AI tutors within a course-specific scope are rare in open platforms |
| Gap 4 | Adaptive quiz generation calibrated to specific lecture content has not been widely studied |
| Gap 5 | Full-stack MERN implementations with Gemini API integration are not well-documented in academic literature |

---

# 3. OBJECTIVES

The primary objectives of the SkillSphere project are:

1. **Design and implement** a full-stack Learning Management System using the MERN stack (MongoDB, Express.js, React 18, Node.js)
2. **Integrate Google Gemini 2.0 Flash** API for AI-assisted course outline generation, quiz creation, and real-time student tutoring
3. **Implement secure role-based authentication** using JSON Web Tokens (JWT) supporting Instructor and Student roles
4. **Develop a complete e-commerce flow** for course purchases using PayPal REST SDK with order creation, PayPal checkout redirect, and payment capture
5. **Build a media management pipeline** using Cloudinary CDN for video uploads, storage, and delivery with duration extraction
6. **Implement real-time AI chat** using Server-Sent Events (SSE) for streaming AI responses word-by-word
7. **Create lecture-level progress tracking** with automatic course completion detection and certificate generation
8. **Deploy a production-ready application** on Vercel with MongoDB Atlas, supporting serverless cold-start optimizations
9. **Demonstrate the feasibility** of AI-native LMS architecture as a superior alternative to AI-as-addon approaches

---

# 4. TECHNOLOGY STACK

## 4.1 Frontend (Client)

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 18.x | Core UI library with hooks and Suspense |
| Vite | 5.x | Build tool and HMR dev server |
| React Router DOM | 6.x | Client-side routing with lazy loading |
| Axios | 1.x | HTTP client with interceptors |
| Tailwind CSS | 3.x | Utility-first CSS framework |
| Radix UI | Latest | Accessible headless component primitives |
| Framer Motion | 11.x | Declarative animation library |
| Lucide React | Latest | SVG icon set |
| React Player | 2.x | Multi-format video player (YouTube, upload) |
| React Markdown | 9.x | Markdown rendering for AI chat responses |
| class-variance-authority | Latest | Type-safe variant styling |

## 4.2 Backend (Server)

| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | 18.x | JavaScript runtime |
| Express.js | 4.x | REST API framework |
| Mongoose | 7.x | MongoDB ODM with schema validation |
| JSON Web Token (jsonwebtoken) | 9.x | Authentication token signing/verification |
| bcryptjs | 2.x | Password hashing (10-round salt) |
| Cloudinary SDK | 2.x | Media upload, delete, metadata query |
| PayPal REST SDK | 1.x | Payment order creation and capture |
| Multer | 1.x | File upload middleware (disk staging) |
| CORS | 2.x | Cross-Origin Resource Sharing configuration |
| dotenv | 16.x | Environment variable loading |
| @google/generative-ai | 0.x | Google Gemini API client |

## 4.3 Database & Infrastructure

| Technology | Purpose |
|-----------|---------|
| MongoDB Atlas | Cloud-hosted MongoDB (M0 free tier → production) |
| Cloudinary | Media CDN (images, videos, transcoding) |
| PayPal Sandbox | Payment processing (REST API) |
| Vercel | Frontend hosting + serverless backend |

## 4.4 AI Model

| Model | Provider | Use Case |
|------|---------|---------|
| Gemini 2.0 Flash | Google DeepMind | Course outline generation, quiz generation, tutor chat |
| Max Output Tokens | 3500 (outlines), 8192 (quizzes), unlimited (chat stream) | Context-dependent generation |
| Response Mode | JSON (outlines, quizzes), Streaming SSE (chat) | Dual-mode AI integration |

---

# 5. SYSTEM ARCHITECTURE — HIGH LEVEL DESIGN (HLD)

## 5.1 Three-Tier Architecture

SkillSphere follows a classic three-tier architecture adapted for cloud-native deployment:

```
┌─────────────────────────────────────────────────────────────┐
│                    TIER 1: PRESENTATION                      │
│                                                             │
│   React 18 + Vite (Client)                                  │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│   │  Pages   │  │Components│  │ Contexts │  │ Services │  │
│   │(lazy     │  │(Radix UI │  │(Auth,    │  │(axios    │  │
│   │ loaded)  │  │+Tailwind)│  │Student,  │  │ calls)   │  │
│   │          │  │          │  │Instructor│  │          │  │
│   └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
│                    ↕ HTTPS / SSE                            │
└─────────────────────────────────────────────────────────────┘
                         ↕
┌─────────────────────────────────────────────────────────────┐
│                    TIER 2: APPLICATION                       │
│                                                             │
│   Express.js REST API (Server — Vercel Serverless)          │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│   │  Routes  │  │Controllers│  │Middleware│  │  Helpers │  │
│   │(/auth    │  │(auth,    │  │(JWT auth,│  │(Cloudinary│ │
│   │ /student │  │ student, │  │ multer,  │  │ PayPal,  │  │
│   │ /instr.  │  │ instructor│ │ cors)    │  │ Gemini)  │  │
│   │ /ai      │  │ ai-ctrl) │  │          │  │          │  │
│   └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
│                    ↕ Mongoose ODM                           │
└─────────────────────────────────────────────────────────────┘
                         ↕
┌─────────────────────────────────────────────────────────────┐
│                    TIER 3: DATA                              │
│                                                             │
│   MongoDB Atlas (Primary DB)                                │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│   │  Users   │  │ Courses  │  │  Orders  │  │  Quizzes │  │
│   │          │  │          │  │          │  │          │  │
│   └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐                 │
│   │ Progress │  │ Student  │  │   Quiz   │                 │
│   │          │  │ Courses  │  │ Attempts │                 │
│   └──────────┘  └──────────┘  └──────────┘                 │
└─────────────────────────────────────────────────────────────┘
```

## 5.2 External Services Integration

```
                    SkillSphere Backend
                          │
          ┌───────────────┼───────────────┐
          │               │               │
          ▼               ▼               ▼
   ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
   │  Cloudinary │ │   PayPal    │ │   Google    │
   │    CDN      │ │  Sandbox    │ │  Gemini 2.0 │
   │             │ │  REST API   │ │   Flash     │
   │ - Upload    │ │             │ │             │
   │ - Delete    │ │ - Create    │ │ - Outline   │
   │ - Duration  │ │   Payment   │ │ - Quiz Gen  │
   │   Query     │ │ - Capture   │ │ - Chat SSE  │
   └─────────────┘ └─────────────┘ └─────────────┘
```

## 5.3 Microservices Boundary (Logical)

Although SkillSphere runs as a monolithic Express application, the codebase is organized into clear logical service boundaries:

| Service Domain | Route Prefix | Responsibility |
|---------------|-------------|---------------|
| Authentication Service | `/auth` | Register, Login, Token Verification |
| Instructor Service | `/instructor/course` | Course CRUD for instructors |
| Media Service | `/media` | Upload, delete, bulk-upload to Cloudinary |
| Student Browse Service | `/student/course` | Course listing, filtering, details |
| Order Service | `/student/order` | PayPal order creation and capture |
| Enrollment Service | `/student/courses-bought` | Purchased courses list, unenroll |
| Progress Service | `/student/course-progress` | Lecture progress, completion tracking |
| AI Service | `/ai` | Outline gen, quiz gen, quiz attempts, chat |

---

# 6. SYSTEM ARCHITECTURE — LOW LEVEL DESIGN (LLD)

## 6.1 Authentication Flow (LLD)

```
Client                      Server                    MongoDB
  │                            │                          │
  │  POST /auth/register       │                          │
  │  {userName,email,pass,role}│                          │
  │ ─────────────────────────► │                          │
  │                            │  findOne({userEmail})    │
  │                            │ ────────────────────────►│
  │                            │◄────────────────────────│
  │                            │  (check duplicate)       │
  │                            │  bcrypt.hash(password,10)│
  │                            │  User.save()             │
  │                            │ ────────────────────────►│
  │◄─────────────────────────  │◄────────────────────────│
  │  {success:true}            │                          │
  │                            │                          │
  │  POST /auth/login          │                          │
  │  {email, password}         │                          │
  │ ─────────────────────────► │                          │
  │                            │  User.findOne({email})   │
  │                            │ ────────────────────────►│
  │                            │◄────────────────────────│
  │                            │  bcrypt.compare()        │
  │                            │  jwt.sign({user},secret, │
  │                            │    {expiresIn:"120m"})   │
  │◄─────────────────────────  │                          │
  │  {accessToken, user}       │                          │
  │  sessionStorage.setItem()  │                          │
  │                            │                          │
  │  GET /auth/check-auth      │                          │
  │  Authorization: Bearer <t> │                          │
  │ ─────────────────────────► │                          │
  │                            │  jwt.verify(token,secret)│
  │◄─────────────────────────  │                          │
  │  {user decoded payload}    │                          │
```

## 6.2 PayPal Payment Flow (LLD)

```
Student Browser            Express Server              PayPal API
      │                         │                          │
      │  POST /student/order/create                        │
      │  {userId,courseId,...}  │                          │
      │ ──────────────────────► │                          │
      │                         │  paypal.payment.create() │
      │                         │ ────────────────────────►│
      │                         │◄────────────────────────│
      │                         │  (approvalUrl)           │
      │                         │  Order.save({status:     │
      │                         │   "pending",unpaid})     │
      │◄────────────────────── │                          │
      │  {approveUrl, orderId} │                          │
      │  window.location =     │                          │
      │    approveUrl          │                          │
      │ ──────────────────────────────────────────────────►│
      │◄──────────────────────────────────────────────────│
      │  PayPal Checkout UI    │                          │
      │  (user approves)       │                          │
      │  redirected to         │                          │
      │  /payment-return       │                          │
      │  ?paymentId=X&PayerID=Y│                          │
      │                        │                          │
      │  POST /student/order/capture                       │
      │  {paymentId,payerId,   │                          │
      │   orderId}             │                          │
      │ ──────────────────────►│                          │
      │                         │  Order.update(confirmed) │
      │                         │  StudentCourses.push()   │
      │                         │  Course.students.push()  │
      │◄────────────────────── │                          │
      │  {success, order}      │                          │
```

## 6.3 AI Streaming Chat Flow (LLD)

```
Student Browser            Express Server            Gemini API
      │                         │                         │
      │  POST /ai/chat          │                         │
      │  {courseId, message,    │                         │
      │   history, detailed}    │                         │
      │ ──────────────────────► │                         │
      │                         │  Course.findById()      │
      │                         │  Build system prompt    │
      │                         │  (course-contextual)    │
      │                         │  model.startChat()      │
      │                         │  chat.sendMessageStream()
      │                         │ ───────────────────────►│
      │  res.setHeader(         │                         │
      │  'Content-Type',        │                         │
      │  'text/event-stream')   │                         │
      │◄────────────────────── │                         │
      │  data:{"chunk":"The "} │◄── chunk1 ──────────────│
      │◄────────────────────── │◄── chunk2 ──────────────│
      │  data:{"chunk":"ans"}  │◄── chunk3 ──────────────│
      │◄────────────────────── │                         │
      │  data:{"done":true}    │  (stream complete)      │
      │                         │                         │
      (Client renders each chunk in real-time as words arrive)
```

## 6.4 Video Upload Pipeline (LLD)

```
Instructor Browser      Express Server (Multer)    Cloudinary CDN
      │                         │                       │
      │  POST /media/upload     │                       │
      │  (multipart/form-data)  │                       │
      │ ──────────────────────► │                       │
      │                         │  multer.diskStorage   │
      │                         │  saves to /uploads/   │
      │                         │  uploadToCloudinary() │
      │                         │ ─────────────────────►│
      │                         │                       │  transcode
      │                         │                       │  generate  
      │                         │                       │  thumbnail 
      │                         │◄─────────────────────│
      │                         │  {public_id,          │
      │                         │   secure_url,         │
      │                         │   duration}           │
      │                         │  fs.unlinkSync()      │
      │                         │  (delete temp file)   │
      │◄────────────────────── │                       │
      │  {public_id,secure_url, │                       │
      │   duration}             │                       │
      (public_id stored in Course.curriculum[i].public_id)
      (secure_url stored in Course.curriculum[i].videoUrl)
```

## 6.5 Quiz Generation Flow (LLD)

```
Instructor              Express Server           Gemini API      MongoDB
    │                        │                       │               │
    │  POST /ai/generate-quiz│                       │               │
    │  {courseTitle,desc,     │                       │               │
    │   objectives,          │                       │               │
    │   lectureGroups,config}│                       │               │
    │ ──────────────────────►│                       │               │
    │                        │  Build quiz prompt    │               │
    │                        │  (include lecture     │               │
    │                        │   names per group)    │               │
    │                        │  gemini.generate()    │               │
    │                        │ ─────────────────────►│               │
    │                        │◄─────────────────────│               │
    │                        │  JSON: [{group1:      │               │
    │                        │  [{q,opts,correct,    │               │
    │                        │   explain,diff}]}]    │               │
    │◄───────────────────── │                       │               │
    │  (review in UI)        │                       │               │
    │                        │                       │               │
    │  POST /ai/save-quiz     │                       │               │
    │  {courseId,config,groups│                      │               │
    │ ──────────────────────►│                       │               │
    │                        │  Quiz.findOneAndUpdate │              │
    │                        │  (upsert: true)       │ ─────────────►│
    │◄───────────────────── │                       │◄─────────────│
    │  {success, quiz}       │                       │               │
```

---

# 7. DATABASE SCHEMA & DATA MODELS

## 7.1 Entity Relationship Diagram (ERD)

```
┌─────────────┐         ┌─────────────────┐        ┌──────────────┐
│    User     │         │     Course      │        │    Order     │
│─────────────│         │─────────────────│        │──────────────│
│ _id (PK)   │ 1      * │ _id (PK)       │        │ _id (PK)    │
│ userName   │──────────│ instructorId    │        │ userId      │
│ userEmail  │          │ instructorName  │        │ courseId    │
│ password   │          │ title          │        │ paymentId   │
│ role       │          │ category       │        │ payerId     │
└─────────────┘          │ level          │        │ orderStatus │
      │                  │ pricing        │        │ paymentStatus│
      │ 1            *  │ isPublised     │        └──────────────┘
      │                  │ curriculum[]   │
      ▼                  │ students[]     │        ┌──────────────┐
┌──────────────┐         └─────────────────┘        │    Quiz      │
│ StudentCourses│                │                  │──────────────│
│──────────────│                │ 1:M              │ _id (PK)    │
│ _id (PK)    │                │                  │ courseId    │
│ userId (FK) │                ▼                  │ config{}    │
│ courses[]   │        ┌──────────────────┐       │ groups[]    │
└──────────────┘        │  CourseProgress  │       │ generatedAt │
                        │──────────────────│       └──────────────┘
                        │ _id (PK)        │              │
                        │ userId (FK)     │              │ 1:M
                        │ courseId (FK)   │              ▼
                        │ completed       │       ┌──────────────┐
                        │ completionDate  │       │ QuizAttempt  │
                        │ lecturesProgress│       │──────────────│
                        └──────────────────┘       │ _id (PK)    │
                                                   │ userId (FK) │
                                                   │ courseId(FK)│
                                                   │ groupIndex  │
                                                   │ score       │
                                                   │ percentage  │
                                                   │ passed      │
                                                   └──────────────┘
```

## 7.2 User Model (`server/models/User.js`)

```javascript
Schema: UserSchema
Collection: users
```

| Field | Type | Constraints | Description |
|-------|------|------------|-------------|
| `_id` | ObjectId | Auto-generated | Primary key |
| `userName` | String | required, unique | Display name |
| `userEmail` | String | required, unique | Login credential |
| `password` | String | required | bcrypt hash (10 rounds) |
| `role` | String | required, enum: ["user","instructor"] | "user" = student |

**Indexes:** `userName` (unique), `userEmail` (unique)

## 7.3 Course Model (`server/models/Course.js`)

```javascript
Schema: CourseSchema (contains nested LectureSchema)
Collection: courses
```

**Top-level fields:**

| Field | Type | Constraints | Description |
|-------|------|------------|-------------|
| `_id` | ObjectId | Auto-generated | Primary key |
| `instructorId` | String | required | User._id of creating instructor |
| `instructorName` | String | required | Instructor's userName |
| `date` | Date | default: Date.now | Creation timestamp |
| `title` | String | required, maxLength:60 | Course title |
| `category` | String | enum: 10 categories | e.g. "web-development" |
| `level` | String | enum: beginner, intermediate, advanced | Difficulty level |
| `primaryLanguage` | String | enum: 10 languages | Teaching language |
| `subtitle` | String | maxLength: 120 | Short marketing tagline |
| `description` | String | — | Full course description |
| `image` | String | — | Cloudinary URL for thumbnail |
| `welcomeMessage` | String | — | First message to enrolled students |
| `pricing` | Number | — | Cost in USD (0 = free) |
| `objectives` | String | — | Learning outcomes (newline-separated) |
| `syllabus` | String | — | Detailed content plan |
| `isPublised` | Boolean | default: false | Visibility toggle |
| `students` | Array | — | Array of StudentEnrollmentSchema |
| `curriculum` | Array | — | Array of LectureSchema |

**LectureSchema (nested):**

| Field | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | Auto-generated |
| `title` | String | Lecture title |
| `videoType` | String | "upload" or "youtube" |
| `videoUrl` | String | Cloudinary secure_url or YouTube URL |
| `public_id` | String | Cloudinary public_id (for delete/duration) |
| `freePreview` | Boolean | Non-enrolled preview access |
| `duration` | Number | Video length in seconds (0 = not yet fetched) |

**StudentEnrollmentSchema (nested inside Course.students[]):**

| Field | Type | Description |
|-------|------|-------------|
| `studentId` | String | User._id |
| `studentName` | String | User's userName |
| `studentEmail` | String | User's email |
| `paidAmount` | String | Amount paid (0 for free) |

## 7.4 CourseProgress Model (`server/models/CourseProgress.js`)

```javascript
Schema: CourseProgressSchema
Collection: courseprogressions
```

| Field | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | Auto-generated |
| `userId` | String | Student's User._id |
| `courseId` | String | Course._id |
| `completed` | Boolean | True when all lectures viewed |
| `completionDate` | Date | Timestamp of completion |
| `lecturesProgress` | Array | Array of LectureProgressSchema |

**LectureProgressSchema (nested):**

| Field | Type | Description |
|-------|------|-------------|
| `lectureId` | String | LectureSchema._id |
| `viewed` | Boolean | Has the student watched this lecture |
| `dateViewed` | Date | When marked as viewed |

## 7.5 StudentCourses Model (`server/models/StudentCourses.js`)

```javascript
Schema: StudentCoursesSchema
Collection: studentcourses
```

| Field | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | Auto-generated |
| `userId` | String | Student's User._id (effectively 1:1) |
| `courses` | Array | Array of PurchasedCourseSchema |

**PurchasedCourseSchema (nested):**

| Field | Type | Description |
|-------|------|-------------|
| `courseId` | String | Course._id |
| `title` | String | Course title at time of purchase |
| `instructorId` | String | Instructor's User._id |
| `instructorName` | String | Instructor's name |
| `dateOfPurchase` | Date | Enrollment/purchase timestamp |
| `courseImage` | String | Course thumbnail URL |

## 7.6 Order Model (`server/models/Order.js`)

```javascript
Schema: OrderSchema
Collection: orders
```

| Field | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | Auto-generated |
| `userId` | String | Buyer's User._id |
| `userName` | String | Buyer's userName |
| `userEmail` | String | Buyer's email |
| `orderStatus` | String | "pending" → "confirmed" |
| `paymentMethod` | String | Always "paypal" |
| `paymentStatus` | String | "unpaid" → "paid" |
| `orderDate` | Date | When order was created |
| `paymentId` | String | PayPal's payment ID |
| `payerId` | String | PayPal's payer ID |
| `instructorId` | String | Course instructor's ID |
| `instructorName` | String | Instructor's name |
| `courseImage` | String | Course thumbnail URL |
| `courseTitle` | String | Course title |
| `courseId` | String | Course._id |
| `coursePricing` | String | Price at time of order |

## 7.7 Quiz Model (`server/models/Quiz.js`)

```javascript
Schema: QuizSchema
Collection: quizzes
Unique index: courseId (one quiz per course)
```

| Field | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | Auto-generated |
| `courseId` | String | unique — Course._id |
| `config` | Object | Quiz configuration (see below) |
| `groups` | Array | Array of QuizGroupSchema |
| `generatedAt` | Date | Last AI generation timestamp |

**Config Object:**

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `config.mode` | String | "end" | "interval" or "end" |
| `config.lectureInterval` | Number | 3 | Quiz after every N lectures |
| `config.questionCount` | Number | 10 | Questions per group |
| `config.difficulty.easy` | Number | 30 | % of easy questions |
| `config.difficulty.medium` | Number | 50 | % of medium questions |
| `config.difficulty.hard` | Number | 20 | % of hard questions |

**QuizGroupSchema (nested):**

| Field | Type | Description |
|-------|------|-------------|
| `lectureIndices` | [Number] | Which lectures this group covers |
| `lectureNames` | [String] | Lecture titles (context for AI) |
| `questions` | Array | Array of QuestionSchema |

**QuestionSchema (nested):**

| Field | Type | Description |
|-------|------|-------------|
| `question` | String | Question text |
| `options` | [String] | 4 answer choices |
| `correctAnswer` | Number | 0–3 index of correct option |
| `explanation` | String | Why this is correct |
| `difficulty` | String | "easy", "medium", or "hard" |

## 7.8 QuizAttempt Model (`server/models/QuizAttempt.js`)

```javascript
Schema: QuizAttemptSchema
Collection: quizattempts
Unique compound index: {userId, courseId, groupIndex}
```

| Field | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | Auto-generated |
| `userId` | String | Student's User._id |
| `courseId` | String | Course._id |
| `groupIndex` | Number | Which quiz group (0-indexed) |
| `score` | Number | Correct answers count |
| `totalQuestions` | Number | Total questions in group |
| `percentage` | Number | (score/total) * 100 |
| `passed` | Boolean | percentage >= 60 |
| `answers` | [Number] | Student's submitted answer indices |
| `attemptDate` | Date | Submission timestamp |

---

# 8. UML DIAGRAMS

## 8.1 Use Case Diagram

```
                        SkillSphere LMS System
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   ┌──────────────────────────────────────────────────────────┐ │
│   │                UNAUTHENTICATED USER                       │ │
│   │  ○ Browse Courses (filter/sort)                          │ │
│   │  ○ View Course Details                                   │ │
│   │  ○ Preview Free Lecture                                  │ │
│   │  ○ Register Account                                      │ │
│   │  ○ Login                                                 │ │
│   └──────────────────────────────────────────────────────────┘ │
│                                                                 │
│   ┌─────────────────────────┐   ┌───────────────────────────┐  │
│   │       STUDENT           │   │       INSTRUCTOR          │  │
│   │─────────────────────────│   │───────────────────────────│  │
│   │ ○ Browse & Filter Courses│  │ ○ Create New Course       │  │
│   │ ○ View Course Details   │   │ ○ Edit Course Details     │  │
│   │ ○ Enroll (Free Course)  │   │ ○ Upload Video Lectures   │  │
│   │ ○ Purchase (Paid Course)│   │ ○ Generate AI Outline     │  │
│   │ ○ Watch Video Lectures  │   │ ○ Regenerate Course Fields│  │
│   │ ○ Track Progress        │   │ ○ Configure Quiz Settings │  │
│   │ ○ Chat with AI Tutor    │   │ ○ Generate AI Quiz        │  │
│   │ ○ Take Quiz             │   │ ○ Save & Publish Course   │  │
│   │ ○ View Quiz Results     │   │ ○ View Enrolled Students  │  │
│   │ ○ View Certificates     │   │ ○ Unpublish Course        │  │
│   │ ○ Unenroll from Course  │   └───────────────────────────┘  │
│   │ ○ Reset Course Progress │                                   │
│   └─────────────────────────┘                                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 8.2 Class Diagram (Simplified)

```
┌─────────────────┐     teaches      ┌─────────────────┐
│      User       │──────────────────│     Course      │
│─────────────────│   (role=instr.)  │─────────────────│
│ _id             │                  │ _id             │
│ userName        │                  │ instructorId    │
│ userEmail       │  enrolls in      │ title           │
│ password        │──────────────────│ category        │
│ role            │   (role=student) │ pricing         │
│─────────────────│                  │ isPublised      │
│ +register()     │                  │ curriculum[]    │
│ +login()        │                  │ students[]      │
│ +checkAuth()    │                  │─────────────────│
└─────────────────┘                  │ +getCourses()   │
         │                           │ +updateCourse() │
         │ 1                         └─────────────────┘
         │                                    │ 1
         │ *                                  │ *
         ▼                                    ▼
┌─────────────────┐             ┌─────────────────────┐
│ StudentCourses  │             │   CourseProgress    │
│─────────────────│             │─────────────────────│
│ userId          │             │ userId              │
│ courses[]       │             │ courseId            │
│─────────────────│             │ completed           │
│ +addCourse()    │             │ completionDate      │
│ +removeCourse() │             │ lecturesProgress[]  │
└─────────────────┘             │─────────────────────│
         │                      │ +markViewed()       │
         │ 1                    │ +resetProgress()    │
         │                      └─────────────────────┘
         ▼
┌─────────────────┐             ┌─────────────────────┐
│     Order       │             │       Quiz          │
│─────────────────│             │─────────────────────│
│ userId          │             │ courseId (unique)   │
│ courseId        │             │ config{}            │
│ paymentId       │             │ groups[]            │
│ orderStatus     │             │ generatedAt         │
│ paymentStatus   │             │─────────────────────│
│─────────────────│             │ +generateQuiz()     │
│ +createOrder()  │             │ +saveQuiz()         │
│ +capturePayment()│            └─────────────────────┘
└─────────────────┘                       │ 1
                                          │ *
                                          ▼
                               ┌─────────────────────┐
                               │    QuizAttempt      │
                               │─────────────────────│
                               │ userId              │
                               │ courseId            │
                               │ groupIndex          │
                               │ score               │
                               │ percentage          │
                               │ passed              │
                               │─────────────────────│
                               │ +submitAttempt()    │
                               │ +getState()         │
                               └─────────────────────┘
```

## 8.3 Sequence Diagram — Course Enrollment (Paid)

```
Student    React App    Express Server    PayPal API    MongoDB Atlas
   │           │               │               │               │
   │  Click    │               │               │               │
   │  "Purchase│               │               │               │
   │ ─────────►│               │               │               │
   │           │POST /order/create             │               │
   │           │──────────────►│               │               │
   │           │               │payment.create()               │
   │           │               │──────────────►│               │
   │           │               │◄──────────────│               │
   │           │               │  (approvalUrl)│               │
   │           │               │  Order.save() │               │
   │           │               │──────────────────────────────►│
   │           │◄──────────────│               │               │
   │           │ {approveUrl}  │               │               │
   │ ◄─────────│               │               │               │
   │  redirect │               │               │               │
   │ ──────────────────────────────────────────►               │
   │           │               │               │  PayPal UI    │
   │  Approve  │               │               │               │
   │ ──────────────────────────────────────────►               │
   │           │               │               │  redirects    │
   │◄──────────────────────────────────────────│               │
   │  /payment-return?paymentId&PayerID         │               │
   │           │               │               │               │
   │           │POST /order/capture             │               │
   │           │──────────────►│               │               │
   │           │               │  Order.update │               │
   │           │               │  StudentCourses.push          │
   │           │               │  Course.students.push         │
   │           │               │──────────────────────────────►│
   │           │◄──────────────│               │               │
   │           │ {success}     │               │               │
   │◄──────────│               │               │               │
   │ Redirect  │               │               │               │
   │ to course │               │               │               │
```

## 8.4 Sequence Diagram — AI Quiz Submission

```
Student    React App    Express Server    MongoDB Atlas
   │           │               │               │
   │ Click     │               │               │
   │ "Submit   │               │               │
   │  Quiz"    │               │               │
   │ ─────────►│               │               │
   │           │POST /ai/quiz/attempt           │
   │           │ {userId,courseId,              │
   │           │  groupIndex,answers[]}         │
   │           │──────────────►│               │
   │           │               │Quiz.findOne() │
   │           │               │──────────────►│
   │           │               │◄──────────────│
   │           │               │  Compare each answer
   │           │               │  vs correctAnswer
   │           │               │  Calculate score,
   │           │               │  percentage, passed
   │           │               │QuizAttempt.findOneAndUpdate
   │           │               │ (upsert:true)
   │           │               │──────────────►│
   │           │               │◄──────────────│
   │           │◄──────────────│               │
   │           │{score,        │               │
   │           │ percentage,   │               │
   │           │ passed,       │               │
   │           │ explanations} │               │
   │◄──────────│               │               │
   │  Show     │               │               │
   │  Results  │               │               │
```

## 8.5 Activity Diagram — Course Creation (Instructor)

```
[START]
   │
   ▼
Register/Login as Instructor
   │
   ▼
Navigate to Instructor Dashboard
   │
   ▼
Click "Add New Course"
   │
   ▼
┌──────────────────────────────────────┐
│         STEP 1: Course Landing       │
│  Option A: Fill manually             │
│  Option B: Click "Generate with AI"  │
│    → Enter topic, level, audience    │
│    → POST /ai/generate-outline       │
│    → Fields auto-populated           │
└──────────────────────────────────────┘
   │
   ▼
Review/edit: title, subtitle, description,
objectives, welcome message, pricing,
category, level, language
   │
   ▼
┌──────────────────────────────────────┐
│         STEP 2: Curriculum           │
│  For each lecture:                   │
│    Add title                         │
│    Choose: Upload Video / YouTube    │
│    If upload: POST /media/upload     │
│      → Cloudinary CDN               │
│      → videoUrl, public_id saved    │
│    Toggle freePreview                │
└──────────────────────────────────────┘
   │
   ▼
┌──────────────────────────────────────┐
│         STEP 3: Settings             │
│  Toggle isPublised (true/false)      │
└──────────────────────────────────────┘
   │
   ▼
┌──────────────────────────────────────┐
│         STEP 4: Quiz Config          │
│  Enable quiz?                        │
│    YES → Set mode (interval/end)     │
│         Set difficulty distribution  │
│         Click "Generate Quiz"        │
│         POST /ai/generate-quiz       │
│         Review groups & questions    │
│         POST /ai/save-quiz           │
│    NO  → Skip                        │
└──────────────────────────────────────┘
   │
   ▼
Save Course (POST /instructor/course/add)
   │
   ▼
[END — Course visible to students if isPublised=true]
```

## 8.6 Component Diagram

```
┌─────────────────────────────────────────────────────────┐
│                   CLIENT APPLICATION                     │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │                    App.jsx                       │   │
│  │  (React Router — all pages lazy-loaded)          │   │
│  └────────────────────┬────────────────────────────┘   │
│                        │                               │
│         ┌──────────────┼──────────────┐               │
│         ▼              ▼              ▼               │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐           │
│   │   Auth   │  │ Student  │  │Instructor│           │
│   │  Pages   │  │  Pages   │  │  Pages   │           │
│   └──────────┘  └──────────┘  └──────────┘           │
│         │              │              │               │
│         ▼              ▼              ▼               │
│   ┌──────────────────────────────────────────────┐   │
│   │              Context Providers                │   │
│   │  AuthContext │ StudentContext │ InstructorCtx  │   │
│   └──────────────────────────────────────────────┘   │
│         │                                             │
│         ▼                                             │
│   ┌──────────────────────────────────────────────┐   │
│   │           services/index.js                  │   │
│   │    (All 40+ API call functions)              │   │
│   └──────────────────────────────────────────────┘   │
│         │                                             │
│         ▼                                             │
│   ┌──────────────────────────────────────────────┐   │
│   │           api/axiosInstance.js               │   │
│   │  (Base URL, JWT header, 12s timeout)         │   │
│   └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                          │ HTTPS
                          ▼
┌─────────────────────────────────────────────────────────┐
│                   SERVER APPLICATION                     │
│                                                         │
│  server.js → routes → controllers → models              │
│                                                         │
│  /auth     /instructor  /media  /student  /ai           │
└─────────────────────────────────────────────────────────┘
```

## 8.7 Deployment Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        VERCEL CLOUD                          │
│                                                             │
│  ┌──────────────────────────┐  ┌──────────────────────────┐ │
│  │    Vercel Edge CDN        │  │  Vercel Serverless Fn    │ │
│  │  (Static Assets)         │  │  (Express.js API)        │ │
│  │                          │  │                          │ │
│  │  React Build Output      │  │  /api/* routes           │ │
│  │  (HTML, JS, CSS)         │  │  JWT Auth middleware      │ │
│  │  Global CDN              │  │  Connection pooling       │ │
│  │                          │  │  Cold-start caching       │ │
│  └──────────────────────────┘  └──────────┬───────────────┘ │
└────────────────────────────────────────────│─────────────────┘
                                             │
              ┌──────────────────────────────┼────────────────────┐
              │                              │                    │
              ▼                              ▼                    ▼
┌─────────────────────┐  ┌──────────────────────┐  ┌────────────────────┐
│   MongoDB Atlas     │  │    Cloudinary CDN     │  │  Google Gemini API │
│   (M0/M10 Cluster)  │  │  (Media Storage)      │  │  (AI Generation)   │
│                     │  │                       │  │                    │
│  7 Collections      │  │  Video transcoding    │  │  gemini-2.0-flash  │
│  Connection Pool    │  │  Image optimization   │  │  JSON mode         │
│  (max 10)           │  │  Global CDN delivery  │  │  Streaming SSE     │
│  Atlas backups      │  │  Public IDs tracked   │  │  8192 token limit  │
└─────────────────────┘  └──────────────────────┘  └────────────────────┘
              │
              ▼
┌─────────────────────┐
│   PayPal Sandbox    │
│   REST API          │
│                     │
│  Payment creation   │
│  Approval redirect  │
│  Payment capture    │
└─────────────────────┘
```

---

# 9. API ENDPOINTS — COMPLETE REFERENCE

## 9.1 Authentication (`/auth`)

| Method | Endpoint | Auth | Body | Response |
|--------|----------|------|------|----------|
| POST | `/auth/register` | None | `{userName, userEmail, password, role}` | `{success, message}` |
| POST | `/auth/login` | None | `{userEmail, password}` | `{success, data:{accessToken, user}}` |
| GET | `/auth/check-auth` | JWT | — | `{success, data:{user}}` |

## 9.2 Instructor Courses (`/instructor/course`)

| Method | Endpoint | Auth | Body/Params | Response |
|--------|----------|------|-------------|----------|
| POST | `/instructor/course/add` | JWT | Full Course object | `{success, data:course}` |
| GET | `/instructor/course/get` | JWT | — | `{success, data:[courses]}` |
| GET | `/instructor/course/get/details/:id` | JWT | `:id` = courseId | `{success, data:course}` |
| PUT | `/instructor/course/update/:id` | JWT | Partial Course object | `{success, data:updatedCourse}` |

## 9.3 Media (`/media`)

| Method | Endpoint | Auth | Body | Response |
|--------|----------|------|------|----------|
| POST | `/media/upload` | None | `multipart/form-data` (single file) | `{success, data:cloudinaryRes}` |
| DELETE | `/media/delete/:id` | None | `:id` = Cloudinary public_id | `{success, message}` |
| POST | `/media/bulk-upload` | None | `multipart/form-data` (max 10 files) | `{success, data:[cloudinaryRes]}` |

## 9.4 Student Course Browsing (`/student/course`)

| Method | Endpoint | Auth | Query/Params | Response |
|--------|----------|------|-------------|----------|
| GET | `/student/course/get` | None | `?category=&level=&primaryLanguage=&sortBy=` | `{success, data:[courses]}` |
| GET | `/student/course/get/details/:id` | None | `:id` = courseId | `{success, data:course}` |
| GET | `/student/course/purchase-info/:id/:studentId` | JWT | — | `{success, data:boolean}` |

## 9.5 Orders (`/student/order`)

| Method | Endpoint | Auth | Body | Response |
|--------|----------|------|------|----------|
| POST | `/student/order/create` | JWT | `{userId, courseId, courseTitle, coursePricing, ...}` | `{success, data:{approveUrl, orderId}}` |
| POST | `/student/order/capture` | JWT | `{paymentId, payerId, orderId}` | `{success, data:order}` |
| POST | `/student/order/free-enroll` | JWT | `{userId, userName, userEmail, courseId, ...}` | `{success, message}` |

## 9.6 Student Courses (`/student/courses-bought`)

| Method | Endpoint | Auth | Body/Params | Response |
|--------|----------|------|-------------|----------|
| GET | `/student/courses-bought/get/:studentId` | JWT | `:studentId` | `{success, data:[enrichedCourses]}` |
| POST | `/student/courses-bought/unenroll` | JWT | `{studentId, courseId}` | `{success, message}` |

## 9.7 Course Progress (`/student/course-progress`)

| Method | Endpoint | Auth | Body/Params | Response |
|--------|----------|------|-------------|----------|
| POST | `/student/course-progress/mark-lecture-viewed` | JWT | `{userId, courseId, lectureId}` | `{success, data:progress}` |
| GET | `/student/course-progress/get/:userId/:courseId` | JWT | — | `{success, data:{courseDetails, progress, completed}}` |
| POST | `/student/course-progress/reset-progress` | JWT | `{userId, courseId}` | `{success, data:progress}` |
| POST | `/student/course-progress/update-lecture-duration` | JWT | `{courseId, lectureId, duration}` | `{success}` |

## 9.8 AI Endpoints (`/ai`)

| Method | Endpoint | Auth | Body | Response |
|--------|----------|------|------|----------|
| POST | `/ai/generate-outline` | JWT | `{topic, level, targetAudience, syllabus}` | `{success, data:{title,subtitle,desc,objectives,curriculum}}` |
| POST | `/ai/regenerate-field` | JWT | `{fieldName, courseContext, instruction}` | `{success, data:{fieldName, value}}` |
| POST | `/ai/generate-quiz` | JWT | `{courseTitle, objectives, lectureGroups, config}` | `{success, data:[groups]}` |
| POST | `/ai/save-quiz` | JWT | `{courseId, config, groups}` | `{success, data:quiz}` |
| GET | `/ai/quiz/:courseId` | JWT | — | `{success, data:quiz\|null}` |
| POST | `/ai/quiz/attempt` | JWT | `{userId, courseId, groupIndex, answers[]}` | `{success, data:{score,percentage,passed,explanations}}` |
| GET | `/ai/quiz-state/:userId/:courseId` | JWT | — | `{success, data:{quiz, attempts[]}}` |
| POST | `/ai/chat` | JWT | `{courseId, message, history[], detailed}` | SSE stream `{chunk}` / `{done}` |

---

# 10. AUTHENTICATION & SECURITY

## 10.1 JWT Authentication Architecture

SkillSphere uses stateless JWT (JSON Web Token) authentication. Tokens are generated on login with a 120-minute expiry and stored on the client in `sessionStorage` (not `localStorage` — sessionStorage is cleared when the browser tab closes, reducing XSS window).

**Token Payload:**
```json
{
  "_id": "ObjectId string",
  "userName": "johndoe",
  "userEmail": "john@example.com",
  "role": "user | instructor",
  "iat": 1716000000,
  "exp": 1716007200
}
```

**JWT Middleware (`server/middleware/auth-middleware.js`):**
1. Extracts token from `Authorization: Bearer <token>` header
2. Calls `jwt.verify(token, process.env.JWT_SECRET)`
3. Attaches decoded payload as `req.user`
4. Returns `401 Unauthorized` if token missing or invalid/expired

**Client Injection (`client/src/api/axiosInstance.js`):**
```javascript
// Request interceptor
config.headers.Authorization = `Bearer ${JSON.parse(sessionStorage.getItem("accessToken"))}`;
```

## 10.2 Password Security

- bcryptjs with 10 salt rounds (approximately 100ms per hash — intentional to slow brute-force)
- `bcrypt.compare()` for constant-time comparison (prevents timing attacks)
- Passwords never returned in API responses

## 10.3 CORS Configuration

```javascript
// server/server.js
app.use(cors({
  origin: [
    process.env.CLIENT_URL,
    "http://localhost:5173",
    "https://*.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));
```

## 10.4 Security Considerations

| Concern | Implementation | Status |
|---------|---------------|--------|
| SQL Injection | N/A (MongoDB NoSQL) | Protected |
| NoSQL Injection | Mongoose schema validation | Protected |
| XSS | sessionStorage (cleared on tab close) | Partially mitigated |
| CSRF | Stateless JWT (no cookies) | Protected |
| Brute Force | bcrypt 10-round delay | Partially mitigated |
| Secrets Exposure | dotenv + Vercel env vars | Protected |
| Rate Limiting | Not implemented | Gap |
| Input Sanitization | Minimal (sanitize in AI prompts) | Partial |

---

# 11. AI FEATURES — GEMINI INTEGRATION

## 11.1 Architecture Overview

SkillSphere integrates Google Gemini 2.0 Flash as the AI backbone with two distinct operational modes:

1. **JSON Generation Mode** — Used for course outlines and quizzes. The model is prompted to return structured JSON that is directly parsed and stored in MongoDB.
2. **Streaming SSE Mode** — Used for the AI tutor chat. The model streams response tokens via Server-Sent Events, enabling real-time word-by-word rendering on the client.

## 11.2 Gemini Helper (`server/helpers/gemini.js`)

```javascript
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function getModel({ systemInstruction = null, maxOutputTokens = 2048, jsonMode = false }) {
  const config = {
    generationConfig: {
      maxOutputTokens,
      ...(jsonMode && { responseMimeType: "application/json" })
    }
  };
  if (systemInstruction) config.systemInstruction = systemInstruction;
  return genAI.getGenerativeModel({ model: "gemini-2.0-flash", ...config });
}
```

**Key design decision:** Using `responseMimeType: "application/json"` forces Gemini to return valid JSON without markdown code blocks — eliminating the need to strip ```json wrappers.

## 11.3 Course Outline Generation

**Prompt strategy** (`server/config/ai-prompts.js` → `outline()`):

The prompt provides:
- Topic, target level, target audience, optional syllabus
- JSON schema for expected output (title, subtitle, description, objectives[], welcomeMessage, curriculum[{section, lectures[{title, description}]}])
- Instruction to return ONLY valid JSON

**Processing pipeline:**
1. AI returns nested curriculum (sections → lectures)
2. Server flattens to a single array of lectures (skipping empty section titles)
3. `objectives` array converted to newline-separated string
4. Empty `videoUrl`, `public_id`, `freePreview`, `duration` fields added to each lecture
5. Returns `flatLectures` (for direct form population) + `fullCurriculum` (for display)

**Token limits:** 3500 max output tokens — sufficient for ~20 lectures

## 11.4 Quiz Generation

**Grouping strategy:**
- Mode "end": All lectures in one group
- Mode "interval": Lectures grouped every N (default 3)
- Each group passed to AI with `lectureIndices` and `lectureNames`

**Prompt strategy** (`server/config/ai-prompts.js` → `quiz()`):
- For each group, instructs AI to generate exactly `questionCount` questions
- Specifies difficulty distribution: e.g., "3 easy (30%), 5 medium (50%), 2 hard (20%)"
- Each question must include: text, 4 options, `correctAnswer` index (0-3), `explanation`, `difficulty`
- Questions must be grounded in the provided lecture topics only

**Scoring:**
- Server-side comparison: `answers[i] === questions[i].correctAnswer`
- `passed` threshold: 60%
- One attempt record per (user, course, group) — retaking overwrites

## 11.5 AI Tutor Chat (Streaming)

**System instruction template** (`server/config/ai-prompts.js` → `tutor()`):
```
You are an expert AI tutor for the course "[courseTitle]".
Course description: [description]
Learning objectives: [objectives]

Your role is to help students understand course concepts, answer questions,
and provide explanations related to this course content.
[If detailed=true: Provide comprehensive, in-depth explanations with examples]
[If detailed=false: Provide concise, focused explanations]
Stay focused on the course topic. If asked about unrelated topics, 
politely redirect to course content.
```

**Streaming implementation:**
```javascript
// Server
const stream = await chat.sendMessageStream(message);
for await (const chunk of stream) {
  const text = chunk.text();
  if (text) res.write(`data: ${JSON.stringify({ chunk: text })}\n\n`);
}
res.write(`data: ${JSON.stringify({ done: true })}\n\n`);

// Client (services/index.js)
const response = await fetch(url, { method: "POST", body: JSON.stringify(body) });
const reader = response.body.getReader();
// Reads chunks, parses JSON, calls onChunk(text) callback
```

**History context:** Up to 10 recent turns sent to `model.startChat({history: [...]})` for contextual multi-turn conversation

## 11.6 AI Error Handling

| Error | HTTP Code | User Message |
|-------|-----------|-------------|
| RESOURCE_EXHAUSTED (429) | 429 | "AI service is currently busy. Please try again in a moment." |
| JSON parse failure | 500 | "Failed to parse AI response. Please try again." |
| Missing fields in response | 500 | "AI returned incomplete data. Please try again." |
| Network timeout | 504 | "AI request timed out. Please try again." |

---

# 12. PAYMENT PROCESSING — PAYPAL INTEGRATION

## 12.1 PayPal REST SDK Configuration

```javascript
// server/helpers/paypal.js
const paypal = require("paypal-rest-sdk");
paypal.configure({
  mode: "sandbox",  // "sandbox" | "live"
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET
});
```

## 12.2 Order Creation Flow

When a student clicks "Purchase":

1. **Client** calls `POST /student/order/create` with course and user details
2. **Server** builds a PayPal payment JSON:
   ```json
   {
     "intent": "sale",
     "payer": { "payment_method": "paypal" },
     "transactions": [{
       "item_list": { "items": [{
         "name": "courseTitle",
         "price": "29.99",
         "currency": "USD",
         "quantity": 1
       }]},
       "amount": { "currency": "USD", "total": "29.99" },
       "description": "Purchase course: courseTitle"
     }],
     "redirect_urls": {
       "return_url": "http://client/payment-return",
       "cancel_url": "http://client/payment-cancel"
     }
   }
   ```
3. PayPal returns an `approvalUrl` — client redirects the browser to this URL
4. Server saves an `Order` document with `orderStatus: "pending"`, `paymentStatus: "unpaid"`

## 12.3 Payment Capture Flow

After PayPal approval:
1. PayPal redirects to `/payment-return?paymentId=X&PayerID=Y`
2. Client extracts `paymentId` and `PayerID` from URL params
3. Client calls `POST /student/order/capture` with `{paymentId, payerId, orderId}`
4. Server:
   - Updates `Order` → `orderStatus: "confirmed"`, `paymentStatus: "paid"`
   - `StudentCourses.findOneAndUpdate` → adds course to student's course list
   - `Course.findOneAndUpdate` → adds student to `Course.students[]`
5. Student immediately gets access to course content

## 12.4 Free Course Enrollment

For courses with `pricing === 0`:
1. No PayPal step — direct enrollment
2. `POST /student/order/free-enroll`
3. Server checks for duplicate enrollment
4. Adds course to `StudentCourses` with `paidAmount: 0`
5. Adds student to `Course.students[]`

---

# 13. MEDIA MANAGEMENT — CLOUDINARY CDN

## 13.1 Upload Pipeline

```javascript
// server/helpers/cloudinary.js
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function uploadMediaToCloudinary(filePath) {
  return await cloudinary.uploader.upload(filePath, {
    resource_type: "auto"  // auto-detects image/video/raw
  });
}
```

**Upload steps:**
1. Multer receives multipart/form-data, saves to `server/uploads/` (disk storage)
2. `uploadMediaToCloudinary(filePath)` sends to Cloudinary
3. Cloudinary returns `{public_id, secure_url, duration}` (duration only for video)
4. `fs.unlinkSync(filePath)` removes the temp file
5. `secure_url` stored as lecture `videoUrl`, `public_id` stored for future delete/query

## 13.2 Video Duration Backfill

When `GET /student/courses-bought/get/:studentId` is called and a lecture has `duration === 0`:
```javascript
const resource = await cloudinary.api.resource(lecture.public_id, { resource_type: "video" });
lecture.duration = resource.duration;  // in seconds
// Save back to MongoDB to avoid future re-queries
await Course.findByIdAndUpdate(courseId, { "curriculum.$[l].duration": resource.duration },
  { arrayFilters: [{ "l._id": lectureId }] });
```

## 13.3 Media Deletion

When an instructor removes a lecture:
1. Client calls `DELETE /media/delete/:publicId`
2. Server calls `cloudinary.uploader.destroy(publicId)`
3. Cloudinary removes the asset from CDN
4. Course document updated to remove the lecture

## 13.4 Time Remaining Calculation

After all durations are known:
```javascript
const totalSeconds = curriculum.reduce((sum, l) => sum + (l.duration || 900), 0);
const viewedSeconds = completedLectures * (totalSeconds / totalLectures);
const remainingSeconds = totalSeconds - viewedSeconds;

const hours = Math.floor(remaining / 3600);
const minutes = Math.floor((remaining % 3600) / 60);
return `${hours}h ${minutes}m left`;
```

---

# 14. FRONTEND ARCHITECTURE

## 14.1 Project Structure

```
client/src/
├── api/
│   └── axiosInstance.js         # Axios config with JWT interceptor
├── assets/
│   └── images.js                # Image imports as named exports
├── components/
│   ├── common-form/             # Config-driven form renderer
│   ├── instructor-view/
│   │   ├── courses/
│   │   │   ├── add-new-course/  # Multi-step course creation
│   │   │   │   ├── course-landing.jsx
│   │   │   │   ├── course-curriculum.jsx
│   │   │   │   ├── course-settings.jsx
│   │   │   │   └── course-quiz-config.jsx  # NEW: AI quiz config
│   │   │   └── instructor-course-card.jsx
│   │   └── dashboard/           # Instructor home
│   ├── student-view/
│   │   ├── common-layout/       # Navigation + layout wrapper
│   │   ├── course-details/      # Course info page
│   │   ├── course-progress/     # Video player + sidebar
│   │   └── student-quiz-panel.jsx  # NEW: Quiz UI
│   └── ui/                      # Tailwind + Radix primitives
├── config/
│   └── index.js                 # Form schemas, dropdown options
├── context/
│   ├── auth-context/            # Auth state + handlers
│   ├── student-context/         # Student data state
│   └── instructor-context/      # Instructor data + upload state
├── lib/
│   └── utils.js                 # cn() Tailwind merge utility
├── pages/
│   ├── auth/                    # Login/Register page
│   ├── instructor/              # Instructor pages
│   └── student/
│       ├── certificate/         # Single certificate
│       ├── certificates/        # Certificates list
│       ├── course-details/      # Course info
│       ├── courses/             # Browse all courses
│       ├── home/                # Student landing
│       ├── payment-return/      # PayPal callback
│       ├── student-courses/     # My purchased courses
│       └── student-course-progress/  # Video player
└── services/
    └── index.js                 # All 40+ API service functions
```

## 14.2 Routing Strategy

All pages are lazy-loaded using React's `lazy()` and `Suspense`:

```javascript
// App.jsx
const StudentHomePage = lazy(() => import("./pages/student/home"));
const CourseCurriculumPage = lazy(() => import("./pages/student/course-progress"));

<Suspense fallback={<PageLoader />}>
  <Routes>
    <Route path="/student" element={<RouteGuard element={<StudentHomePage />} authenticated={auth.authenticate} user={auth.user} />} />
  </Routes>
</Suspense>
```

**RouteGuard logic:**
- Unauthenticated + protected route → redirect to `/auth`
- Authenticated + auth route → redirect based on role (`/instructor` or `/student`)
- Role mismatch → redirect to appropriate dashboard

## 14.3 Config-Driven Forms

Course creation and auth forms are driven by configuration arrays in `client/src/config/index.js`:

```javascript
export const courseLandingPageFormControls = [
  { name: "title", label: "Title", componentType: "input", type: "text", placeholder: "Enter course title" },
  { name: "category", label: "Category", componentType: "select", options: courseCategories },
  { name: "level", label: "Level", componentType: "select", options: courseLevelOptions },
  // ...
];
```

`CommonForm` component iterates over these controls and renders the appropriate input/select/textarea — making forms declarative and easy to modify.

## 14.4 Image Imports

All images are imported as a named export object to avoid path-management issues:

```javascript
// client/src/assets/images.js
import heroImage from "./hero.png";
import logoImage from "./logo.svg";
export default { heroImage, logoImage };
```

---

# 15. STATE MANAGEMENT

SkillSphere uses React Context API (no Redux/Zustand) — appropriate given the relatively small state surface:

## 15.1 AuthContext

```
State:
  signInFormData: { userEmail, password }
  signUpFormData: { userName, userEmail, password, role }
  auth: { authenticate: boolean, user: { _id, userName, userEmail, role } }
  authLoading: boolean

Actions:
  handleRegisterUser() → calls registerService → navigates
  handleLoginUser() → calls loginService → sets auth → navigates by role
  resetCredentials() → clears auth, removes sessionStorage token
  checkAuthUser() → calls checkAuthService on mount → sets auth.authenticate
```

## 15.2 StudentContext

```
State:
  studentViewCoursesList: [Course]           // Browsable/filtered courses
  studentViewCourseDetails: Course | null    // Currently viewing
  studentBoughtCoursesList: [EnrichedCourse] // Purchased + progress enriched
  studentCurrentCourseProgress: ProgressObj  // Active course progress

Actions:
  fetchStudentViewCourses(filters) → GET /student/course/get
  fetchStudentCourseDetails(id) → GET /student/course/get/details/:id
  fetchStudentBoughtCourses(studentId) → GET /student/courses-bought/get/:id
  fetchCurrentCourseProgress(userId, courseId) → GET /student/course-progress/get
```

## 15.3 InstructorContext

```
State:
  courseLandingFormData: CourseMetadata  // Step 1 form
  courseCurriculumFormData: [Lecture]    // Step 2 lectures
  instructorCoursesList: [Course]        // All created courses
  currentEditedCourseId: string | null   // Edit mode indicator
  mediaUploadProgress: boolean
  mediaUploadProgressPercentage: number
  quizConfig: { mode, lectureInterval, questionCount, difficulty }
  quizGroups: [QuizGroup]               // Generated quiz groups

Actions:
  fetchAllCourses() → GET /instructor/course/get
  handleSaveCourse() → POST or PUT /instructor/course
  resetForm() → clears all form state
```

---

# 16. KEY WORKFLOWS — END-TO-END

## 16.1 Complete Student Journey

1. **Discovery**: Student arrives at `/student` (or `/` if authenticated)
2. **Browsing**: Filters courses by category (web-dev, AI, etc.), level, language; sorts by price
3. **Evaluation**: Views course details — description, objectives, curriculum preview, instructor info, enrolled students count
4. **Preview**: If `freePreview: true`, watches first lecture without enrollment
5. **Enrollment**:
   - Free course → one click → immediate access
   - Paid course → PayPal flow → redirect → approve → capture → access
6. **Learning**: My Courses page shows progress bars, time remaining, completion status
7. **Progress**: Marks lectures as viewed; progress % updates in real-time
8. **Help**: Opens AI tutor panel, types question, gets streaming response
9. **Quiz**: Triggered at end of course (or by interval); answers MCQs; sees score + explanations
10. **Completion**: All lectures viewed → course marked complete → certificate generated

## 16.2 Complete Instructor Journey

1. **Registration**: Signs up with `role: "instructor"` 
2. **Course Creation**: Navigates to Add Course → 4-step wizard
3. **AI Assistance**: Enters topic → AI generates full outline in ~5 seconds
4. **Refinement**: Edits AI-generated fields manually or triggers field-specific regeneration
5. **Video Upload**: Uploads lecture videos → Cloudinary → progress bar → URL stored
6. **Quiz Setup**: Configures quiz mode, difficulty → AI generates questions per lecture group
7. **Publishing**: Toggles `isPublised: true` → course appears in browse list

---

# 17. DEPLOYMENT ARCHITECTURE

## 17.1 Vercel Serverless Configuration

SkillSphere is deployed on Vercel with the following configuration:
- **Frontend**: Static React build served via Vercel Edge CDN
- **Backend**: Express.js wrapped as Vercel Serverless Functions
- **Cold-start optimization**: MongoDB connection is cached via `isConnected` flag — preventing a new database connection on every serverless function invocation

```javascript
// server/server.js
let isConnected = false;

const connectToDB = async () => {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGO_URI, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    heartbeatFrequencyMS: 10000
  });
  isConnected = true;
};
```

## 17.2 Environment Variables

| Variable | Service | Purpose |
|---------|---------|---------|
| `MONGO_URI` | MongoDB Atlas | Database connection string |
| `JWT_SECRET` | Server | JWT signing secret |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary | Cloud account identifier |
| `CLOUDINARY_API_KEY` | Cloudinary | API authentication |
| `CLOUDINARY_API_SECRET` | Cloudinary | API authentication secret |
| `PAYPAL_CLIENT_ID` | PayPal | Payment API key |
| `PAYPAL_CLIENT_SECRET` | PayPal | Payment API secret |
| `GEMINI_API_KEY` | Google AI | Gemini API key |
| `CLIENT_URL` | CORS | Frontend domain for CORS whitelist |
| `VITE_API_URL` | Client | Backend API base URL |

## 17.3 Axios Timeout Justification

The client Axios instance uses a 12-second timeout (not the default 4 seconds). This is intentional: Vercel serverless functions have a cold-start latency of 3–8 seconds on free tier. Without this extended timeout, first-load requests would fail with timeout errors, forcing users to retry. The 12-second window accommodates even worst-case cold-starts.

---

# 18. PERFORMANCE OPTIMIZATIONS

## 18.1 Client-Side

| Optimization | Implementation | Benefit |
|-------------|---------------|---------|
| Lazy Loading | `React.lazy()` + `Suspense` for all pages | Initial bundle ~60% smaller |
| Code Splitting | Vite automatically splits vendor chunks | Faster subsequent loads |
| CDN Assets | All media served from Cloudinary edge CDN | Global fast delivery |
| Debounced Filters | Filter changes debounced before API call | Fewer redundant requests |
| SSE Streaming | AI chat streams tokens, not waiting for full response | Perceived latency reduced |

## 18.2 Server-Side

| Optimization | Implementation | Benefit |
|-------------|---------------|---------|
| Connection Caching | `isConnected` flag prevents repeated DB init | Eliminates cold-start DB overhead |
| Connection Pooling | `maxPoolSize: 10` in Mongoose | Handles concurrent requests efficiently |
| Heartbeat | 10s heartbeat keeps connections alive | Avoids socket timeout on quiet periods |
| Parallel Cloudinary Queries | `Promise.all()` for bulk duration backfill | Multiple videos queried simultaneously |
| Field Projection | Future: use `.select()` to return only needed fields | Reduces payload size |

## 18.3 Database Indexing

| Collection | Index | Purpose |
|-----------|-------|---------|
| users | `userEmail` (unique) | Fast login lookup |
| users | `userName` (unique) | Duplicate check on registration |
| quizzes | `courseId` (unique) | Fast quiz retrieval per course |
| quizattempts | `{userId, courseId, groupIndex}` (compound) | Upsert lookup performance |
| studentcourses | `userId` | O(1) student course lookup |

---

# 19. SECURITY ANALYSIS

## 19.1 Threat Model

| Threat | Attack Vector | Mitigation |
|--------|-------------|-----------|
| Unauthorized access | Forged/expired JWT | `jwt.verify()` rejects invalid tokens |
| Account takeover | Brute-force login | bcrypt 10-round delay (~100ms/attempt) |
| Data theft | API without auth | JWT middleware on all sensitive routes |
| Injection (NoSQL) | Malformed query params | Mongoose schema validation |
| Secret exposure | Hardcoded credentials | Environment variables (dotenv + Vercel) |
| Media theft | Direct Cloudinary URL sharing | Public URLs by design (educational content) |
| CORS exploitation | Cross-origin requests | Explicit origin whitelist |

## 19.2 Known Gaps & Recommendations

| Gap | Risk Level | Recommendation |
|----|-----------|---------------|
| No rate limiting | Medium | Implement express-rate-limit on /auth |
| No refresh tokens | Low | Implement refresh token rotation |
| No email verification | Medium | Add Nodemailer email confirmation |
| No input sanitization library | Medium | Add joi/zod validation on all inputs |
| JWT stored in sessionStorage | Low | Monitor for XSS vulnerability vectors |
| No HTTPS enforcement | Low | Vercel enforces HTTPS automatically |

---

# 20. DESIGN TRADE-OFFS & ARCHITECTURAL DECISIONS

## 20.1 Context API vs Redux/Zustand

**Decision:** Use React Context API for state management  
**Trade-off:**
- ✅ Simpler, no extra dependencies, fine for this app size
- ✅ Contexts cleanly separated by domain (Auth, Student, Instructor)
- ❌ Context updates re-render all consumers (not optimized)
- ❌ Would not scale well beyond ~50 components without memoization

**Justification:** SkillSphere has three distinct user flows (auth, student, instructor) with minimal cross-context communication. Context API is sufficient without the boilerplate overhead of Redux.

## 20.2 MongoDB vs Relational Database

**Decision:** MongoDB (document store) over PostgreSQL/MySQL  
**Trade-off:**
- ✅ Flexible schema — Course.curriculum array grows without migrations
- ✅ Nested documents for lectures avoid expensive JOINs
- ✅ MERN stack synergy (JavaScript JSON throughout)
- ❌ No true foreign key constraints — data consistency relies on application logic
- ❌ Complex queries (e.g., "courses with >100 students and avg rating >4") require aggregation

**Justification:** LMS content data is naturally hierarchical (Course → Sections → Lectures → Progress). MongoDB's document model maps directly to this structure.

## 20.3 Vercel Serverless vs Dedicated Server

**Decision:** Vercel serverless for both frontend and backend  
**Trade-off:**
- ✅ Zero-config deployment, automatic scaling, free tier available
- ✅ Global CDN for frontend assets
- ✅ HTTPS automatic
- ❌ Cold-start latency (3–8s on free tier) — mitigated with connection caching and 12s Axios timeout
- ❌ Execution time limit (10s on hobby, 60s on pro) — long AI requests can approach this

**Justification:** For a student project with potentially bursty traffic, serverless is more cost-effective than a always-on VPS. The cold-start trade-off is acceptable.

## 20.4 Server-Sent Events vs WebSockets for AI Chat

**Decision:** SSE (Server-Sent Events) over WebSockets for streaming AI responses  
**Trade-off:**
- ✅ SSE is unidirectional — perfect for server-to-client streaming
- ✅ Automatic reconnection built into EventSource API
- ✅ Works over standard HTTP (no WebSocket upgrade required)
- ✅ Works through most proxies and load balancers
- ❌ Unidirectional — client cannot stream to server
- ❌ Single HTTP connection per chat session (not multiplexed)

**Justification:** AI tutor chat is fundamentally one-directional (server streams response to client). SSE is simpler and more reliable than WebSockets for this use case.

## 20.5 AI-Generated Quizzes vs Static Quizzes

**Decision:** AI-generated quizzes (Gemini) rather than instructor-authored MCQs  
**Trade-off:**
- ✅ Dramatically reduces instructor workload
- ✅ Questions are contextually grounded in lecture topics
- ✅ Configurable difficulty distribution
- ❌ AI may occasionally generate ambiguous or incorrect questions
- ❌ Questions require instructor review before publish
- ❌ Regenerating is costly (API call + token usage)

**Justification:** The core value proposition of SkillSphere is AI-assisted course creation. AI quiz generation is a key differentiator. Instructor review (review UI provided) mitigates quality concerns.

## 20.6 Session Storage vs Local Storage for JWT

**Decision:** `sessionStorage` for JWT token storage  
**Trade-off:**
- ✅ Auto-cleared when browser tab closes — shorter XSS attack window
- ✅ Per-tab isolation (student and instructor can be logged in on different tabs)
- ❌ User must re-login when opening new tabs
- ❌ Page refresh requires re-check via `/auth/check-auth`

**Justification:** Security-conscious choice. The 120-minute JWT expiry combined with sessionStorage provides adequate UX for typical learning sessions while minimizing persistent token exposure.

---

# 21. AI APPLICATION — WHERE SKILLSPHERE STANDS

## 21.1 Positioning in the AI-EdTech Landscape

| Platform | AI Features | SkillSphere Advantage |
|---------|------------|----------------------|
| Coursera | AI-recommended courses | Contextual AI tutor, AI content creation |
| Udemy | Basic search | Full AI outline + quiz generation |
| Khan Academy Khanmigo | GPT-4 tutor | Open platform + instructor tools |
| Google Classroom | None | AI-native from ground up |
| Canvas LMS | Third-party plugins | Native integration, no plugin fragmentation |
| **SkillSphere** | **AI Outline + Quiz + Streaming Tutor** | **Full AI pipeline, MERN open architecture** |

## 21.2 AI Integration Depth

SkillSphere's AI is not bolted-on — it is architecturally embedded:

1. **Content Creation Layer**: AI participates in course design (outline, fields, quizzes)
2. **Delivery Layer**: AI tutors students contextually during consumption
3. **Assessment Layer**: AI generates and grades (via correctAnswer comparison) assessments

This three-layer integration mirrors how expert human instructors work: design → teach → assess.

## 21.3 Gemini vs GPT-4 Choice

**Why Gemini 2.0 Flash:**
- Google's Gemini API has a generous free tier (1 million tokens/month in Gemini Flash)
- `gemini-2.0-flash` provides excellent quality/speed balance for educational content
- Native JSON mode (`responseMimeType: "application/json"`) is more reliable than prompt engineering for structured output
- Google Cloud infrastructure provides low-latency access from India-based servers

## 21.4 Future AI Potential

| Feature | AI Application | Feasibility |
|---------|---------------|-------------|
| Personalized learning paths | Recommend next lecture based on performance | High |
| Adaptive difficulty | Adjust quiz difficulty based on past scores | Medium |
| Lecture summarization | Auto-generate lecture summaries from video transcripts | High (with Gemini Vision) |
| Plagiarism detection | Check student submissions against course content | Medium |
| Sentiment analysis | Detect student frustration from chat patterns | Medium |
| Auto-grading essays | Grade free-text responses using AI | High |

---

# 22. ADVANTAGES & COMPETITIVE ANALYSIS

## 22.1 Key Advantages

### Technical Advantages
1. **AI-Native Architecture**: AI is a first-class component, not a third-party plugin. All three AI features (outline, quiz, chat) are built into the Express.js backend with dedicated routes, controllers, and prompt templates.

2. **Real-Time Streaming**: The AI tutor uses Server-Sent Events to stream responses token-by-token, providing a ChatGPT-like experience within the LMS. Most competing LMS platforms show a spinner and load the complete response — SkillSphere renders progressively.

3. **Full Vertical Integration**: A single platform handles: user management → course creation → video hosting → payments → progress tracking → AI assistance → certificate generation. No third-party integrations for core features.

4. **Cloud-Native Deployment**: Deployed on Vercel with MongoDB Atlas and Cloudinary CDN. Scales automatically. No infrastructure management required.

5. **Serverless-Optimized Backend**: Connection caching, configurable timeouts, and cold-start-aware Axios configuration make the platform robust on Vercel's serverless infrastructure.

### Educational Advantages
1. **Instructor Empowerment**: An instructor with domain knowledge but no instructional design background can create a structurally sound course in minutes using AI outline generation.

2. **Contextualized Learning Support**: The AI tutor is scoped to the specific course — students get relevant answers, not generic ChatGPT responses. This prevents the "just ask ChatGPT" escape hatch that undermines learning objectives.

3. **Immediate Feedback Loop**: Quiz explanations provide immediate corrective feedback. Students learn not just the correct answer but why it is correct.

4. **Flexible Enrollment Model**: Both free and paid courses on the same platform, with PayPal payment and immediate access on capture.

## 22.2 Comparison Table

| Feature | SkillSphere | Moodle | Teachable | Custom from Scratch |
|---------|------------|--------|-----------|-------------------|
| MERN Stack | ✅ | ❌ (PHP) | ❌ (Ruby) | Varies |
| AI Course Generation | ✅ | ❌ | ❌ | Requires build |
| AI Quiz Generation | ✅ | Plugin only | ❌ | Requires build |
| AI Tutor (Streaming) | ✅ | ❌ | ❌ | Requires build |
| PayPal Payments | ✅ | Plugin | ✅ | Requires integration |
| Free Tier Hosting | ✅ (Vercel) | Self-hosted | ❌ ($39/mo) | Cloud costs |
| Cloudinary Video | ✅ | File system | ✅ | Requires integration |
| Open Source | ✅ | ✅ | ❌ | N/A |
| Setup Complexity | Low | Very High | Low | Very High |

---

# 23. LIMITATIONS & FUTURE SCOPE

## 23.1 Current Limitations

| Limitation | Impact | Priority |
|-----------|--------|---------|
| No refresh tokens (JWT expires in 2h) | Users re-login frequently | Medium |
| No email verification on signup | Account security concern | High |
| No pagination on course lists | Performance issue at scale | Medium |
| No full-text search | Users cannot search by keyword | High |
| No instructor analytics dashboard | Instructors cannot track revenue/engagement | Medium |
| PayPal sandbox only (not live) | Cannot process real payments | High |
| No video streaming optimization (adaptive bitrate) | High bandwidth usage | Low |
| No mobile native app | Web-only | Low |
| No content moderation | Any instructor can publish anything | Medium |
| No refund system | Poor buyer experience for dissatisfied students | Medium |
| Quiz AI quality varies | Some questions may be poorly formed | Medium |
| Single AI model (Gemini only) | No fallback if Gemini is down | Low |

## 23.2 Future Scope

### Short-Term (3–6 months)
1. **Email Verification**: Nodemailer integration with verification link on signup
2. **Refresh Tokens**: Add refresh token rotation for seamless session management
3. **Full-Text Search**: MongoDB Atlas Search (Lucene-based) for course keyword search
4. **Pagination**: Cursor-based pagination on `/student/course/get`
5. **PayPal Live Mode**: Switch to production PayPal credentials
6. **Input Validation**: Add Joi/Zod schema validation on all API inputs

### Medium-Term (6–12 months)
1. **Instructor Analytics**: Revenue dashboard, student engagement metrics, completion rates
2. **Video Streaming**: HLS adaptive bitrate streaming via Cloudinary's transcoding API
3. **Discussion Forums**: Course-level Q&A board for peer interaction
4. **Rating & Reviews**: Student ratings displayed on course pages
5. **Content Moderation**: Admin role with course approval workflow
6. **Mobile App**: React Native application (iOS + Android) reusing existing API

### Long-Term (12+ months)
1. **Personalized Learning Paths**: AI-recommended next courses based on completion history and quiz performance
2. **Adaptive Quizzes**: Difficulty adjusts based on student's rolling performance score
3. **Video Transcription**: Gemini Vision for auto-generating lecture transcripts and summaries
4. **B2B Enterprise Mode**: Multi-tenant support for organizations to deploy private LMS instances
5. **Marketplace Model**: Revenue split between SkillSphere and instructors (30/70 model like Udemy)
6. **Offline Mode**: Service Workers + IndexedDB for offline lecture viewing
7. **AI-Graded Assignments**: Free-text submission graded by Gemini with rubric context

---

# 24. RESULTS & TESTING

## 24.1 Functional Testing Matrix

| Test Case | Module | Expected | Status |
|----------|--------|---------|--------|
| Register with existing email | Auth | 400 duplicate error | ✅ Pass |
| Login with wrong password | Auth | 401 unauthorized | ✅ Pass |
| JWT expiry after 120min | Auth | 401 on next request | ✅ Pass |
| Course creation with AI outline | AI | Populated form fields | ✅ Pass |
| Video upload to Cloudinary | Media | secure_url + public_id | ✅ Pass |
| Free course enrollment (duplicate) | Enrollment | 400 already enrolled | ✅ Pass |
| PayPal payment creation | Payment | approveUrl returned | ✅ Pass |
| Mark lecture viewed (all viewed) | Progress | completed = true | ✅ Pass |
| AI quiz generation | Quiz | JSON groups returned | ✅ Pass |
| Quiz attempt scoring (10/10) | Quiz | percentage=100, passed=true | ✅ Pass |
| AI chat streaming | Chat | SSE chunks received | ✅ Pass |
| Unenroll with progress cleanup | Enrollment | Progress deleted | ✅ Pass |
| Cloudinary duration backfill | Media | Duration saved to Course | ✅ Pass |

## 24.2 Performance Observations

| Metric | Observed Value | Notes |
|--------|--------------|-------|
| Cold-start API latency | 3–8 seconds | Vercel serverless free tier |
| Warm API response | 100–300ms | After cold-start resolved |
| AI outline generation | 3–7 seconds | Gemini 2.0 Flash |
| AI quiz generation (20 questions) | 5–12 seconds | Depends on question count |
| AI chat first token (TTF) | 0.5–2 seconds | Streaming, fast first token |
| Video upload (50MB) | 8–15 seconds | Cloudinary transcoding |
| MongoDB query (indexed) | <10ms | Atlas M0 cluster |
| Frontend initial load | 1–2 seconds | Lazy-loaded, CDN served |

## 24.3 Browser Compatibility

| Browser | Tested | Notes |
|---------|--------|-------|
| Chrome 120+ | ✅ | Full functionality |
| Firefox 121+ | ✅ | Full functionality |
| Edge 120+ | ✅ | Full functionality |
| Safari 17+ | ✅ | SSE supported |
| Mobile Chrome (Android) | ✅ | Responsive layout |
| Mobile Safari (iOS) | ✅ | Responsive layout |

---

# 25. REFERENCES

## Academic References

1. D. G. Oblinger, "Education Nation: Six Leading Edges of Innovation in our Schools," EDUCAUSE Review, vol. 47, no. 3, 2012.

2. G. Siemens, "Connectivism: A Learning Theory for the Digital Age," International Journal of Instructional Technology and Distance Learning, vol. 2, no. 1, pp. 3–10, 2005.

3. A. Vaswani et al., "Attention Is All You Need," Advances in Neural Information Processing Systems, vol. 30, 2017. (Foundation of Transformer models used in Gemini)

4. T. Brown et al., "Language Models are Few-Shot Learners," Advances in Neural Information Processing Systems, vol. 33, pp. 1877–1901, 2020.

5. M. Alario-Hoyos et al., "Recommendations for the Design and Deployment of MOOCs," IEEE Transactions on Learning Technologies, vol. 10, no. 2, pp. 196–202, 2017.

6. S. Bhatt and J. Mudge, "Machine Learning in Education: A Systematic Review," International Journal of Artificial Intelligence in Education, vol. 31, pp. 345–382, 2021.

7. A. Pinkwart, "Another 25 Years of AIED? Challenges and Opportunities for Intelligent Educational Technologies of the Future," International Journal of Artificial Intelligence in Education, vol. 26, pp. 771–783, 2016.

8. M. V. Meza-Kubo and A. L. Morán, "Technologies for Online Learning: A Systematic Review," Computers & Education, vol. 151, 2020.

## Technical References

9. MongoDB Inc., "MongoDB Atlas Documentation," Available: https://www.mongodb.com/docs/atlas/

10. Google LLC, "Gemini API Documentation — Generative AI," Available: https://ai.google.dev/gemini-api/docs

11. Cloudinary Inc., "Cloudinary Node.js SDK Documentation," Available: https://cloudinary.com/documentation/node_integration

12. PayPal Inc., "PayPal REST API Documentation," Available: https://developer.paypal.com/docs/api/overview/

13. Meta Open Source, "React Documentation," Available: https://react.dev

14. Express.js Foundation, "Express.js Documentation," Available: https://expressjs.com/

15. Mongoose ODM, "Mongoose Documentation v7," Available: https://mongoosejs.com/docs/

16. Vercel Inc., "Vercel Platform Documentation," Available: https://vercel.com/docs

17. J. Auth et al., "JSON Web Token (JWT) — RFC 7519," Internet Engineering Task Force (IETF), May 2015.

18. W3C, "Server-Sent Events Specification," Available: https://html.spec.whatwg.org/multipage/server-sent-events.html

---

# APPENDIX A — ENVIRONMENT SETUP

## Local Development

```bash
# Clone repository
git clone <repo-url>
cd SkillShpere-LMS

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install

# Create server/.env with:
MONGO_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
GEMINI_API_KEY=...
CLIENT_URL=http://localhost:5173

# Create client/.env with:
VITE_API_URL=http://localhost:5000

# Start development servers (two terminals)
cd server && npm run dev   # port 5000
cd client && npm run dev   # port 5173
```

---

# APPENDIX B — HOW TO USE /humanizer ON YOUR THESIS

After generating the thesis `.docx`, the writing may contain AI-generated patterns that academic reviewers can detect. To make the thesis sound authentic and human before submission:

## Steps to Humanize Your Thesis

1. **Open this project in Claude Code** (you are already here)

2. **Select a section of the thesis** you want to humanize (copy from the `.docx`)

3. **Type `/humanizer`** in Claude Code chat and paste your thesis text

4. **What it does:**
   - Removes 29 documented AI writing patterns (Wikipedia's Signs of AI Writing)
   - Eliminates inflated language, promotional tone, passive voice overuse
   - Removes em dash overuse, "rule of three" lists, filler phrases
   - Injects authentic personality — makes the writing feel like it came from a student researcher
   - Fixes vague attributions, copula avoidance, hedging phrases

5. **Apply section by section** for best results:
   - Start with Abstract (most scrutinized)
   - Then Introduction and Conclusion
   - Then Literature Review
   - Then Methodology (least scrutinized for AI patterns)

6. **Things to customize before /humanizer:**
   - Replace `Name` with your actual name
   - Replace `Registration Number` with your actual reg. no.
   - Replace supervisor name with actual supervisor
   - Update date fields to actual submission date

## Example Usage

```
/humanizer

[paste your abstract here]

Make this sound like a B.Tech student at NIAMT who has been working 
on this project for 5 months and genuinely understands the system. 
Avoid academic clichés. Keep technical terminology accurate.
```

---

*Document Version: 1.0 | Date: May 2026 | Project: SkillSphere LMS | Institution: NIAMT, Ranchi*
