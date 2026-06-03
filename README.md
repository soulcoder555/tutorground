# TutorGround

TutorGround is a trusted local tutoring ecosystem for home tutors, coaching teachers, students, and parents. It combines a tutor marketplace with class scheduling, live Jitsi rooms, attendance, homework, proof cards, parent trust dashboards, learning passports, realtime notifications, and admin verification.

## Stack

- Frontend: Next.js 14 App Router, Tailwind CSS, shadcn-style local UI components, Zustand, React Hook Form, Zod, Google Maps JavaScript API, FullCalendar, Recharts, Framer Motion, Axios.
- Backend: Node.js, Express, TypeScript, REST API, Socket.io.
- Data: PostgreSQL, Prisma ORM, Redis for cache/rate limits/presence.
- Storage: local development storage plus S3/Cloudflare R2-compatible upload service.
- Auth: JWT access tokens, refresh token rotation, bcrypt 12 rounds, phone OTP, RBAC.
- Video: Jitsi Meet room per session.
- Phase 2 scaffold: Razorpay, batch sessions, backup tutors, WhatsApp channel, AI match fields, communities.

## Project Structure

```text
tutorground/
  frontend/                 Next.js app
    app/                    App Router pages
    components/             UI, layout, tutor, session, homework, parent, student, map, shared
    lib/                    axios, auth, maps, socket, sample data, utilities
    store/                  Zustand stores
    types/                  shared frontend interfaces
  backend/                  Express API
    prisma/schema.prisma    PostgreSQL schema and Phase 2 placeholders
    src/controllers/        REST controllers with ownership checks
    src/routes/             Complete /api route surface
    src/services/           auth, match, proof card, attendance, upload, notification, passport
    src/middleware/         auth, RBAC, rate limit, upload, validation, errors
    tests/                  unit tests
  docker-compose.yml        PostgreSQL and Redis for local development
  vercel.json               frontend deployment config
  backend/railway.json      backend deployment config
```

## Local Setup

```bash
cd tutorground
copy .env.example .env
npm install
npm run prisma:generate
docker compose up -d postgres redis
npm run prisma:migrate
npm run seed
npm run dev
```

Frontend: `http://localhost:3000`  
Backend: `http://localhost:4000`  
Health check: `http://localhost:4000/health`

## Environment Notes

Set these before using external services:

- `DATABASE_URL`: Supabase or local PostgreSQL connection string.
- `REDIS_URL`: Railway/Upstash/local Redis.
- `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET`: long random secrets.
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: enables the live map.
- `STORAGE_DRIVER=s3` or `r2` plus S3-compatible keys for Cloudflare R2.
- `OTP_PROVIDER=msg91` or `twilio` plus provider credentials for production OTP.
- `NEXT_PUBLIC_JITSI_DOMAIN`: use `meet.jit.si` for phase 1 or your self-hosted Jitsi domain.

## Migration Commands

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:deploy --workspace backend
npm run seed
```

## Verification Commands

```bash
npm run build --workspace backend
npm run test --workspace backend
npm run typecheck --workspace frontend
npm run build --workspace frontend
npm audit --omit=dev --cache .npm-cache
```

Current verification status:

- Backend TypeScript build: passing.
- Backend tests: passing, 3 Smart Match/distance tests.
- Frontend TypeScript check: passing.
- Frontend production build: passing.
- Production audit: remaining advisory is `next@14.2.35`; npm's available fix path is a semver-major move to Next 16. The app stays on Next 14 because the requested stack explicitly required it. For a real production launch in 2026, upgrade Next before opening public traffic.

## API Coverage

Implemented route groups:

- Auth: signup, login, logout, refresh, send OTP, verify OTP, me, forgot/reset password.
- Tutors: own profile CRUD, public profile, availability, students, sessions, earnings, document upload.
- Search: tutor search and map markers with Smart Match Score and Redis cache.
- Students: profile, passport, parent link, homework, attendance.
- Parents: profile, children, link student, trust dashboard, proof cards, bookings.
- Sessions: create, read, update, delete, start, end, join.
- Attendance: mark, session list, student history.
- Homework: create, read, update, delete, session list, submit, submissions, review.
- Proof cards: generate, get by session, list by parent.
- Reviews: create, tutor reviews, admin delete.
- Notifications: list, read, read all, delete.
- Bookings: tutor incoming, accept, reject, delete.
- Admin: pending tutors, verify tutor, users, delete user, analytics, sessions.
- Payments: Razorpay scaffold endpoint returning a structured Phase 2 response.

## Feature Testing Matrix

Auth:

1. POST `/api/auth/signup` with name, email, Indian phone, password, role.
2. POST `/api/auth/send-otp`, then `/api/auth/verify-otp`.
3. POST `/api/auth/login`; confirm access token body and httpOnly refresh cookie.
4. POST `/api/auth/refresh`; confirm old refresh token is rotated.

Tutor profile and verification:

1. Login as tutor.
2. PUT `/api/tutors/profile` with subjects, classes, rate, mode, address, lat/lng, bio, profile URL.
3. POST `/api/tutors/documents` with `idProof`, `degree`, `photo`.
4. Login as admin and POST `/api/admin/tutors/:id/verify`.

Search and map:

1. GET `/api/search/tutors?subject=Math&classLevel=10&lat=32.7&lng=74.8&radius=10`.
2. Confirm results include `distanceKm` and `smartMatchScore`.
3. Open `/find-tutors`; add `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` to verify live markers.

Bookings:

1. Parent links a student through `/api/parents/link-student`.
2. Parent POSTs `/api/parents/bookings`.
3. Tutor GETs `/api/bookings`.
4. Tutor PATCHes `/api/bookings/:id/accept` or `/reject`; parent receives notification.

Sessions and live class:

1. Tutor POSTs `/api/sessions`.
2. Tutor POSTs `/api/sessions/:id/start`; Jitsi link is generated as `tutorground-[sessionId]`.
3. Open `/live/[sessionId]`; verify iframe, timer, attendance panel, doubt queue, and proof-card modal.
4. Students emit `doubt:raised` through Socket.io; tutor sees queue.

Attendance:

1. Tutor POSTs `/api/attendance/:sessionId/mark`.
2. Parent receives `attendance:marked` notification.
3. GET `/api/attendance/student/:studentId` returns history.

Proof cards:

1. Tutor ends a session through `/api/sessions/:id/end` with topics, activity level, homework details.
2. Backend creates `TeachingProofCard`, updates session, updates passport, and notifies parents.
3. Parent opens `/proof-cards` and exports PDF.

Homework:

1. Tutor POSTs `/api/homework` with title, due date, student IDs, optional PDF/image.
2. Student POSTs `/api/homework/:id/submit`.
3. Tutor GETs `/api/homework/:id/submissions`.
4. Tutor PUTs `/api/homework/submissions/:id/review` with score and topic tags.
5. Learning Passport updates strong topics for scores >= 80 and weak topics for scores < 50.

Parent Trust Dashboard:

1. GET `/api/parents/trust-dashboard/:studentId`.
2. Verify overview cards, attendance data, homework status, proof cards, topics, and monthly summary.
3. Open `/parent-dashboard` for the responsive dashboard UI.

Student Learning Passport:

1. GET `/api/students/passport`.
2. Complete sessions and review homework to update subjects, teachers, achievements, strong topics, weak topics.
3. Open `/passport` to verify charts and badge UI.

Reviews:

1. Complete at least 3 sessions for a tutor/student pair.
2. Parent POSTs `/api/reviews`.
3. GET `/api/reviews/tutor/:tutorId` and public `/tutor/[profileUrl]`.

Admin:

1. Open `/admin/dashboard`, `/admin/tutors`, `/admin/users`, `/admin/analytics`.
2. Verify pending tutor queue, user management, session logs, and platform stats endpoints.

## Deployment

Frontend on Vercel:

1. Import the repository.
2. Use project root `tutorground`.
3. Vercel uses `vercel.json`: install with `npm install`, build with `npm run build --workspace frontend`, output `frontend/.next`.
4. Add `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SOCKET_URL`, and `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`.

Backend on Railway:

1. Create PostgreSQL and Redis services or connect Supabase plus Redis.
2. Deploy from root `tutorground`.
3. Railway uses `backend/railway.json`.
4. Set all backend env vars from `.env.example`.
5. Run `npm run prisma:deploy --workspace backend` during deploy.

Supabase PostgreSQL:

1. Create a Supabase project.
2. Copy the pooled PostgreSQL URL into `DATABASE_URL`.
3. Run `npm run prisma:deploy --workspace backend`.

Cloudflare R2:

1. Create an R2 bucket.
2. Set `STORAGE_DRIVER=r2`, endpoint, bucket, access key, secret, and public base URL.
3. Tutor documents, homework, submissions, avatars, and proof assets use the shared upload service.

## Mobile App Path

The platform is API-first and role screens are componentized. A future app can reuse the Express API, Prisma data model, Socket.io events, Jitsi room URLs, and most form validation schemas. The cleanest path is Expo/React Native with shared TypeScript types and equivalent screens for search, live class, trust dashboard, passport, and notifications.

