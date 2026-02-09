# Fast Resume: Sprint Plan (Staff Engineer Breakdown)

> Each task is scoped to be completable in **≤1 day** by a single developer.  
> Each week contains **~5 working days** of effort.

---

## 🗓️ WEEK 1: Mono-repo Foundation & Auth Infrastructure
**Deliverable**: A running TurboRepo with Gateway auth endpoints and a functional Login/Register UI.

### Day 1: Mono-repo Scaffold
- [ ] Run `npx create-turbo@latest` and select TypeScript template
- [ ] Configure root `package.json` with shared scripts (`lint`, `build`, `dev`)
- [ ] Create empty placeholder apps: `apps/frontend`, `apps/gateway`, `apps/ai-backend`
- [ ] Create shared package: `packages/shared` (for types/interfaces)

### Day 2: Gateway Service Init
- [ ] Initialize Fastify project in `apps/gateway` with TypeScript
- [ ] Add core middleware: `@fastify/cors`, `@fastify/helmet`, `@fastify/sensible`
- [ ] Configure `.env` loading with `dotenv` (PORT, JWT_SECRET, DATABASE_URL)
- [ ] Create health-check route `GET /api/health`

### Day 3: Authentication - Core Logic
- [ ] Install `@fastify/jwt` for token management
- [ ] Create `POST /api/auth/register` (hash password with `argon2`, store user stub)
- [ ] Create `POST /api/auth/login` (validate credentials, return JWT)
- [ ] Implement `authMiddleware` to protect routes

### Day 4: Frontend Setup & Auth Context
- [ ] Initialize Vite + React + TypeScript in `apps/frontend`
- [ ] Install `react-router-dom` v6 and create `AppRouter`
- [ ] Create `AuthContext` with `login`, `logout`, `user` state
- [ ] Setup `axios` instance with JWT interceptor

### Day 5: Login & Register Pages
- [ ] Build `LoginPage.tsx` with email/password form (Vanilla CSS)
- [ ] Build `RegisterPage.tsx` with matching styling
- [ ] Connect forms to Gateway `/api/auth/*` endpoints
- [ ] Add form validation and error handling UI

---

## 🗓️ WEEK 2: AI Backend & Resume Parsing
**Deliverable**: A working parsing pipeline that extracts structured JSON from a PDF.

### Day 1: AI Backend Scaffold
- [ ] Initialize Fastify project in `apps/ai-backend` with TypeScript
- [ ] Install and configure Ollama locally (`ollama pull llama3:8b`)
- [ ] Create `GET /api/ai/health` endpoint
- [ ] Test inter-service call from Gateway -> AI Backend

### Day 2: PDF Parsing Module
- [ ] Install `pdf-parse` (or `pdf.js-extract`)
- [ ] Create utility `extractTextFromPdf(buffer: Buffer): Promise<string>`
- [ ] Write unit test with sample PDF fixture
- [ ] Handle edge cases: encrypted PDFs, image-only PDFs (return error)

### Day 3: Ollama/Llama 3 Integration
- [ ] Create `ollamaClient` utility with REST API wrapper
- [ ] Test basic prompt/response cycle with Llama 3
- [ ] Implement streaming response handling
- [ ] Add retry logic for connection failures

### Day 4: Resume Extraction Prompt Engineering
- [ ] Define `ResumeData` schema in `packages/shared` (Contact, Experience, Education, Skills, Projects)
- [ ] Write LLM system prompt: "Extract structured resume data from the following text..."
- [ ] Implement `POST /api/ai/extract` that takes raw text and returns `ResumeData` JSON
- [ ] Validate AI response against schema (Zod)

### Day 5: Frontend Upload Flow
- [ ] Create `UploadPage.tsx` with drag-and-drop zone (react-dropzone)
- [ ] Implement file size/type validation (PDF only, max 5MB)
- [ ] POST file to Gateway, which proxies to AI Backend
- [ ] Display loading spinner and success/error states

---

## 🗓️ WEEK 3: Template System & Admin Portal
**Deliverable**: Admin can upload LaTeX templates; Users see a live gallery.

### Day 1: TanStack DB Setup
- [ ] Install `@tanstack/db` in `packages/db`
- [ ] Define `templatesCollection` schema (id, name, fileUrl, createdBy, isPublished)
- [ ] Define `resumesCollection` schema (id, userId, data, selectedTemplate)
- [ ] Export typed collections for use in frontend

### Day 2: Template Storage Backend
- [ ] Create `POST /api/templates/upload` in Gateway (multipart/form-data)
- [ ] Store LaTeX files on disk or cloud storage (S3/GCS stub)
- [ ] Persist metadata to TanStack DB `templatesCollection`
- [ ] Return template ID and status

### Day 3: Admin Portal - UI
- [ ] Create `AdminLayout.tsx` with sidebar navigation
- [ ] Build `TemplateUploadPage.tsx` with `.tex` file drag-and-drop
- [ ] Add validation: only `.tex` extensions allowed
- [ ] Display upload progress and success confirmation

### Day 4: Template Management Table
- [ ] Build `TemplateListPage.tsx` showing all uploaded templates
- [ ] Implement "Publish/Unpublish" toggle per template
- [ ] Implement "Delete" action with confirmation modal
- [ ] Add role-based guard: only `admin` role can access `/admin/*`

### Day 5: User Template Gallery
- [ ] Build `TemplateGalleryPage.tsx` for regular users
- [ ] Fetch only `isPublished: true` templates from TanStack DB
- [ ] Display as responsive CSS grid with hover preview
- [ ] On click: store `selectedTemplateId` in context/state

---

## 🗓️ WEEK 4: LaTeX Engine & Preview/Export
**Deliverable**: Complete E2E flow from PDF upload to formatted PDF download.

### Day 1: LaTeX Variable Injection
- [ ] Define placeholder syntax in LaTeX templates (e.g., `{{name}}`, `{{experience}}`)
- [ ] Create `injectResumeData(latex: string, data: ResumeData): string` utility
- [ ] Write unit tests for substitution logic
- [ ] Handle missing fields gracefully (default to empty string)

### Day 2: LaTeX Compilation
- [ ] Research options: local TeX Live, Overleaf API, or `latex.js` (browser-based)
- [ ] Implement `compileLatexToPdf(latexString: string): Promise<Buffer>`
- [ ] Create `POST /api/ai/compile` endpoint that returns PDF buffer
- [ ] Handle compilation errors (return user-friendly message)

### Day 3: Resume Preview Page
- [ ] Build `PreviewPage.tsx` with PDF viewer (`react-pdf` or `pdfjs-dist`)
- [ ] Fetch compiled PDF from backend on page load
- [ ] Implement zoom controls (fit-to-width, zoom in/out)
- [ ] Add "Download PDF" button (blob download)

### Day 4: Template Switching
- [ ] Add sidebar to `PreviewPage` listing all templates
- [ ] On template switch: re-compile with new template, update preview
- [ ] Cache compiled PDFs to avoid redundant re-compilation
- [ ] Show loading state during re-compilation

### Day 5: Final Polish & QA
- [ ] Add Skeleton loaders to all async pages
- [ ] Implement Dark Mode toggle (CSS variables)
- [ ] Add page transitions with Framer Motion
- [ ] E2E test: Register -> Login -> Upload -> Extract -> Select Template -> Preview -> Download

---

## 🗓️ WEEK 5 (Buffer): Deployment & Hardening
**Deliverable**: Production-ready deployment with monitoring.

### Day 1-2: CI/CD & Deployment
- [ ] Setup GitHub Actions workflow for lint/build/test
- [ ] Configure Vercel for Frontend
- [ ] Configure Railway/Render for Gateway and AI Backend
- [ ] Setup environment variables in deployment platforms

### Day 3-4: Security & Error Handling
- [ ] Audit all endpoints for proper authentication
- [ ] Add rate limiting to auth and AI endpoints
- [ ] Setup Sentry or similar for error tracking
- [ ] Add logging with structured JSON format

### Day 5: Documentation & Handoff
- [ ] Update README with setup instructions
- [ ] Document API endpoints (OpenAPI/Swagger optional)
- [ ] Create `.env.example` for all services
- [ ] Final code review and cleanup

---

## Legend
- `[ ]` = Not started  
- `[*]` = Completed  
- `[~]` = In progress  
