# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


agents

# AuraChat Agent Rules & Behavioral Constraints

## 1. Meta-Rules & Execution Boundaries
* **Package Manager — pnpm Only:** NEVER use `npm` or `yarn`. All package operations MUST use `pnpm` (`pnpm add`, `pnpm remove`, `pnpm install`, `pnpm run`). If a lockfile conflict arises, delete `node_modules` and `pnpm-lock.yaml` then run `pnpm install`.
* **Strict Line Limit:** NO component or file may exceed 150 lines of code. If an implementation approaches 130 lines, you MUST extract sub-components, utility functions, or custom hooks immediately.
* **Zero Placeholder Policy:** Never output placeholders, incomplete structures, or `// TODO: implement later` comments. Every block must be fully typed and implemented.
* **Verification Before Import:** Before importing any new external npm package, you must run `pnpm list <package>` via the terminal to confirm its existence in the project. Never assume a package is present based on training data.
* **Defensive Commits:** Create an isolated git checkpoint before undertaking any multi-file structural refactoring. Do not modify more than 3 files in a single pass without prompting for user review.

## 2. Frontend Constraints (React + Zustand + Socket + MUI + Tailwind)
* **Interface-First Layout:** Define all TypeScript types and component `Props` interfaces at the top of the file before generating rendering code. 
* **State Hygiene:** Keep local UI states (toggles, transient inputs) in React `useState`. Global chat states, session syncs, and real-time event logs belong strictly in decoupled Zustand stores.
* **Styling Integration:** Combine Material UI structural layouts with Tailwind CSS utility classes. Utilize the `cn()` utility function (`clsx` + `tailwind-merge`) for all conditional and runtime-dependent styling expressions.
* **Strict Internationalization:** Hardcoded strings are banned in user-facing components. All copy must pull from localized files using `i18next` key definitions.
* **Icon Discipline:** Import icons exclusively from `@tabler/icons-react` as named imports. Never use `@mui/icons-material`. The `size` prop replaces MUI's `fontSize` — set it explicitly (`size={24}`, `size={20}`, `size={16}`) based on the IconButton size context. Color is inherited via `currentColor` from the parent IconButton or container sx.
* **Chunk Optimization:** Use Vite 8+ `build.rolldownOptions.output.codeSplitting.groups` (NOT deprecated `manualChunks`) to vendor-split heavy libraries into separate chunks: `vendor-react` (react, react-dom, react-router, @clerk), `vendor-mui` (@mui), `vendor-icons` (@tabler), `vendor-other` (remaining node_modules). Set `chunkSizeWarningLimit: 400`. When adding a new large dependency, add a matching `test` regex to the appropriate group.

## 3. Backend Constraints (Express + MongoDB + Mongoose + Socket)
* **Decoupled Architecture:** Maintain an explicit separation of concerns: Routes execute validated controller pipelines; Controllers delegate to Mongoose models or custom services; Socket handlers map cleanly to standalone event namespaces.
* **Security Middleware Precedence:** Every dynamic Express route must pass through `helmet()` and a strictly defined, locked-down `cors()` origin policy. 
* **Atomic Operations:** Database mutations (especially complex many-to-many room joins) must utilize Mongoose transactions or atomic operators (`$addToSet`, `$pull`) to prevent race conditions.
* **Payload Sanitation:** Files handled via `multer` must undergo rigorous filename sanitization and explicit MIME-type whitelist verification before writing to disk.

## 4. Error Handling & Logging
* **Result Typings:** Never let business logic throw bare errors. Wrap controller and service returns in explicit `Result<T, E>` patterns or unified JSON response envelopes.
* **Structured Event Logging:** Production paths are strictly prohibited from utilizing standard `console.log`. Use structured JSON transport logging containing metadata, session footprints, and trace IDs.

## 5. Authentication (Clerk Exclusive)
* **Single Source of Truth:** Clerk is the **only** authentication provider. No Passport.js, Firebase Auth, custom bcrypt/JWT, or any other auth library is permitted. Clerk handles sign-up, sign-in, session management, and social identity providers (Google, Facebook, GitHub, etc.).
* **Frontend Guards:** Import `ClerkProvider`, `Show`, `SignedIn`, `SignedOut`, `UserButton`, `SignInButton`, `SignUpButton`, `useAuth`, and `useUser` exclusively from `@clerk/react`. Every user-facing route must be wrapped with `<Show when="signed-in">` to gate authenticated content.
* **Session Access:** Use `useAuth()` to retrieve `userId` and session tokens for API calls. Use `useUser()` to access the current user's profile, image, and email. Never store user credentials or tokens in Zustand stores — Clerk manages sessions internally.
* **Backend Verification:** Protect Express API routes by verifying Clerk session tokens using the `@clerk/backend` SDK (`clerkClient.verifyToken` or `requireAuth` middleware). Never fall back to manual JWT secret verification.
* **OAuth Configuration:** All social login providers (Google, Facebook, GitHub) are configured exclusively through the Clerk Dashboard at https://dashboard.clerk.com. No OAuth client IDs or secrets should appear in the codebase or environment files.