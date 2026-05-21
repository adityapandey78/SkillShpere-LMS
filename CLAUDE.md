# SkillSphere LMS

Full-stack LMS. Client: React 18 + Vite. Server: Express + MongoDB.

## Dev Commands

- `cd client && npm run dev` — frontend on port 5173
- `cd server && npm run dev` — backend on port 5000
- `cd client && npm run lint` — ESLint (runs automatically via hook on edits)

## Non-Obvious Conventions

- `@/` aliases `client/src/` — use it everywhere in the client
- All API calls live in `client/src/services/index.js` — never inline axios in components
- Images: import from `client/src/assets/images.js` as an object, not direct paths
- Forms: driven by config arrays in `client/src/config/index.js`, rendered by `components/common-form/`
- Auth token: stored in `sessionStorage` as `accessToken`, injected by `client/src/api/axiosInstance.js`
- Server uses CommonJS (`require`); client uses ESM (`import`)
- Roles: `user` = student, `instructor`
- Progress %: computed server-side in `server/controllers/student-controller/student-courses-controller.js`
- DB connection cached across serverless calls via `isConnected` in `server/server.js` (Vercel cold-start fix)
- Axios timeout is 12s — intentional, covers Vercel cold-start

## Key Entry Points

- Routes: `client/src/App.jsx` (all pages lazy-loaded with Suspense)
- API base: `client/src/api/axiosInstance.js`
- Server entry: `server/server.js` (also shows all route prefixes)
- Contexts: `client/src/context/` — AuthContext, StudentContext, InstructorContext

## Stack

- Client: Radix UI, Tailwind, `cn()` from `lib/utils.js`, Framer Motion, lucide-react, react-player
- Server: Mongoose, JWT, Cloudinary (media), PayPal REST SDK (payments), multer (upload staging)
- Deploy: Vercel frontend + serverless backend, MongoDB Atlas, Cloudinary CDN

> [2026-05-15] New file added: `client/src/pages/student/certificate/index.jsx`
> [2026-05-15] New file added: `client/src/pages/student/certificates/index.jsx`
> [2026-05-21] New file added: `server/helpers/gemini.js`
> [2026-05-21] New file added: `server/config/ai-prompts.js`
> [2026-05-21] New file added: `server/controllers/ai-controller/chat-controller.js`
> [2026-05-21] New file added: `server/controllers/ai-controller/quiz-controller.js`
> [2026-05-21] New file added: `server/controllers/ai-controller/outline-controller.js`
> [2026-05-21] New file added: `server/routes/ai-routes/index.js`