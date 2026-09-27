<div align="center">

# 🎓 SkillSphere

### An LMS with AI built into both sides

[**Live Demo**](https://skill-shpere-lms.vercel.app)

![React](https://img.shields.io/badge/React_18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Gemini](https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

</div>

Instructors can generate a course outline from a topic and have quizzes written from their lecture titles. Students get a chat tutor that only knows about the course they're watching, plus quizzes, progress tracking and a certificate at the end.

---

## What it does

### For students

| | |
|---|---|
| 🤖 **AI tutor** | Chat panel next to the video. Answers stream in as they're generated. It only answers questions about the course you're in. |
| 📝 **Quizzes** | Either after every few lectures or one final exam, depending on how the instructor set it up. Scored instantly, with an explanation for each answer. |
| 🎬 **Video player** | Tracks how far you got in every lecture. Free preview lectures are watchable before you buy. |
| 💳 **Buying courses** | PayPal for paid ones, single click for free ones. |
| 🏅 **Certificate** | Unlocks once you finish the course and pass the final quiz. Printable. |

### For instructors

| | |
|---|---|
| ✨ **Outline generator** | Give it a topic and a difficulty level. It writes the title, description, objectives, welcome message and a full section-by-section curriculum, and fills them into the course form. |
| ✏️ **Rewrite one field** | Don't like the subtitle? Re-roll just that field with your own instruction. Everything else stays put. |
| 🧠 **Quiz generator** | Reads your lecture titles and writes multiple choice questions from them. You pick how many and what mix of easy/medium/hard. Edit anything before saving. |
| 📹 **Lecture videos** | Upload to Cloudinary (one at a time or in bulk) or just paste a YouTube link. |
| 📊 **Dashboard** | Enrolments and revenue per course. |

---

<!-- ───────────────────────────────────────────────────────────────────────────
  SCREENSHOTS — drop files into docs/images/ and delete the comment markers
  around the block below. Nothing else needs changing.

  Needed:
    ai-tutor.gif          ~5s of the tutor streaming a reply beside the player
    outline-generator.png topic form + the course form it fills in
    quiz-generator.png    difficulty split UI + generated questions
    quiz-result.png       a scored attempt with answer explanations
    course-player.png     video, curriculum sidebar, progress

  1200-1600px wide, and use a seeded course with realistic content.
──────────────────────────────────────────────────────────────────────────── -->

<!--
## Screenshots

<div align="center">
<img src="docs/images/ai-tutor.gif" alt="AI tutor streaming a reply beside the course video player" width="800"/>
</div>

<table>
<tr>
<td width="50%"><img src="docs/images/outline-generator.png" alt="Course outline generated from a topic"/><br/><sub><b>Outline generator</b></sub></td>
<td width="50%"><img src="docs/images/quiz-generator.png" alt="Quiz generator with difficulty split"/><br/><sub><b>Quiz generator</b></sub></td>
</tr>
<tr>
<td width="50%"><img src="docs/images/quiz-result.png" alt="Quiz result with answer explanations"/><br/><sub><b>Quiz results</b></sub></td>
<td width="50%"><img src="docs/images/course-player.png" alt="Course player with curriculum sidebar and progress"/><br/><sub><b>Course player</b></sub></td>
</tr>
</table>

---
-->

## Tech stack

| Layer | Using |
|---|---|
| Frontend | React 18, Vite, React Router, Tailwind, Radix UI, Framer Motion |
| Backend | Node, Express, Mongoose |
| Database | MongoDB Atlas |
| AI | Google Gemini via `@google/generative-ai` |
| Media | Cloudinary for video and images |
| Payments | PayPal REST SDK |
| Hosting | Vercel, frontend and backend both |

---

## Why I built this

I kept noticing that most of the work in putting a course online has nothing to do with teaching. You write an outline, then a description nobody reads, then quiz questions, and only after all that do you record anything. On the other side, a student who gets stuck at 2am has nobody to ask.

Both of those are things an LLM is actually good at, so I wired one into both ends and built the rest of the LMS around it.

---

## Architecture

```
client/
  src/api/            axios instance, adds the JWT and a 12s timeout
  src/services/       all API calls, one function per endpoint
  src/context/        Auth, Student, Instructor
  src/config/         form field definitions
  src/pages/          route components, lazy loaded
  src/components/     ui/ primitives plus feature components

server/
  config/ai-prompts.js    all the prompts
  helpers/                gemini, cloudinary, paypal
  controllers/            auth, instructor, student, ai
  routes/                 one router per domain
  models/                 User, Course, Quiz, QuizAttempt, CourseProgress, Order
```

If you're going to work on this, a few things that aren't obvious from the folder names:

- Every API call goes in `client/src/services/index.js`. Don't put axios in a component.
- `@/` means `client/src/`.
- Forms come from config arrays in `client/src/config/` and get rendered by `components/common-form/`. You usually add a field to the config, not to JSX.
- The auth token sits in `sessionStorage` under `accessToken`.
- A student's role is `user`, not `student`.
- Server is CommonJS, client is ESM. Easy to trip over.

📖 [API reference and data model](docs/api.md)

---

## Design decisions

**All the prompts live in one file.** `server/config/ai-prompts.js` holds every prompt as a function. The controllers only do validation and shape the response. Changing how the tutor talks is a one file diff, and I can read all three prompts side by side when one of them starts behaving oddly.

**The tutor streams.** Gemini takes a few seconds to answer, and watching a spinner for that long makes it feel broken even when it isn't. So the reply comes back over Server-Sent Events and renders word by word. Two things I hit doing this: axios doesn't give you a clean `ReadableStream` in the browser, so that one service call uses plain `fetch`, and the proxy will happily buffer your whole stream unless you set `X-Accel-Buffering: no`.

**Outlines and quizzes come back as JSON.** Gemini has a JSON mode, which is much better than parsing prose. It still occasionally wraps the JSON in markdown fences, so there's a stripper for that. Token limits are set per task after some trial and error. A five section outline goes past 1800 tokens easily, so that one gets 3500. If it still gets cut off the user sees "try a shorter topic" instead of a JSON parse error.

**Quiz questions are pinned to real lectures.** The prompt gets the actual lecture titles and is told not to go outside them, otherwise you get plausible questions about things the course never covered. The easy/medium/hard counts are worked out in code before the prompt is built, because asking the model for "30% easy" gets you roughly 30% easy.

**Grading is server side.** The client sends answer indices and gets back a score. Correct answers aren't in the payload until after you submit. Same reasoning for the progress percentage, which is calculated in `student-courses-controller.js` rather than in the browser.

**Missing API key doesn't take the app down.** No `GEMINI_API_KEY` just means the AI routes error and everything else works. Quota errors, cut off responses and unparseable JSON each get their own message, because "something went wrong" tells the user nothing about whether to retry.

**The Mongoose connection is cached in module scope.** This one took a while to work out. Vercel reuses function instances, so opening a new connection per request was adding seconds to every cold start. Now there's a single cached connection and a middleware that reconnects only if it dropped. The timeouts are short on purpose, 10 seconds for server selection, so a dead database returns a 503 instead of hanging for 30 seconds.

---

## Running it locally

You'll need Node 18+, a MongoDB Atlas cluster, and accounts for Cloudinary, PayPal developer and Google AI Studio.

```bash
git clone https://github.com/adityapandey78/SkillShpere-LMS.git
cd SkillShpere-LMS

cd server && npm install && npm run dev     # :5000
cd client && npm install && npm run dev     # :5173
```

<details>
<summary><b>Environment variables</b></summary>

```env
# server/.env
PORT=5000
MONGO_URI=
JWT_SECRET=
CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

PAYPAL_CLIENT_ID=
PAYPAL_SECRET_ID=

GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.0-flash    # optional, this is the default
```

```env
# client/.env
VITE_API_URL=http://localhost:5000

# analytics, optional. tracking does nothing if these are unset
VITE_PULSAR_SRC=
VITE_PULSAR_ENDPOINT=
VITE_PULSAR_KEY=
```

</details>

`cd client && npm run lint` for ESLint.

---

## Analytics and deployment

Events go through `client/src/lib/pulsar.js`, which does nothing if the env vars aren't set. `identify()` runs on login and on session restore so a visitor's earlier anonymous activity gets attached to their account once they sign in.

Tracked: `signup`, `course_viewed`, `checkout_started`, `course_enrolled`, `course_purchased`, `lecture_completed`, `course_completed`, `quiz_started`, `quiz_submitted`, `ai_tutor_used`, `certificate_viewed`, `course_created`, `course_updated`.

Everything runs on Vercel, frontend as a static build and the Express app as serverless functions, with MongoDB Atlas behind it. Most of the production tuning came down to cold starts: the cached connection mentioned above, a 12 second axios timeout on the client, and `timeout: 0` on quiz generation and grading since those legitimately take longer than any default you'd want elsewhere. CORS allows localhost, the production domain and `*.vercel.app` so preview deployments work.

---

