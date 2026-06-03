# TutorGround Design Notes

## Scope

This frontend pass applies the attached cinematic design direction without turning the product into decoration. TutorGround is a trust platform for parents, students, tutors, and admins, so the design system uses strong hierarchy, clear role separation, and restrained motion.

## Key Decisions

- `lib/design-tokens.ts` defines the core color, type, spacing, radius, and shadow tokens used by Tailwind and global CSS.
- The logo is rendered through `components/brand/LogoMark.tsx` so the mark is consistently circular, clear, and not stretched.
- The landing page is split into section components under `components/sections/` for maintainability and app conversion.
- Framer Motion is used only for scroll reveals in `components/sections/Reveal.tsx`; CSS handles simple hover/focus transitions.
- No Three.js was added because the visual background is decorative. CSS mesh gradients, grid glow, and noise provide depth with lower runtime cost.
- Public navigation shows only public actions: find tutors, sign in, and sign up. Workspace links appear only after authentication.
- Role workspaces keep different backgrounds:
  - Parent: warm rose/cream for child tracking and trust.
  - Tutor: cream/indigo/amber for teaching operations.
  - Student: dark teal/indigo for focused study.
  - Admin: mint/blue for operations.

## Security And UX Controls

- Auth tokens stay out of localStorage.
- The UI does not fake role switching. Access is controlled by the authenticated user role.
- API errors are shown inline with specific recovery language.
- Motion respects `prefers-reduced-motion`.
- Interactive elements use semantic links/buttons and visible focus styles from the shared button/input primitives.

## Remaining Environment Requirement

Login and signup require PostgreSQL on `localhost:5432`. If Docker Desktop is not running, the API correctly returns a database unavailable message instead of a raw Prisma stack trace.
