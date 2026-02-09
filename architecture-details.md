# Fast Resume: Architecture & Technical Specifications

## 1. System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND                                    │
│                         (React + Vite + TS)                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │   Login/    │  │   Upload    │  │  Template   │  │   Preview   │    │
│  │  Register   │  │  Dashboard  │  │   Gallery   │  │   & Export  │    │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘    │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    ADMIN PORTAL (Role: admin)                    │   │
│  │  ┌─────────────────────┐  ┌─────────────────────────────────┐   │   │
│  │  │  Template Upload    │  │     Template Management Table   │   │   │
│  │  │  (.tex files)       │  │     (Edit / Publish / Delete)   │   │   │
│  │  └─────────────────────┘  └─────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                              │                                           │
│                              │                                           │
│                    ┌─────────▼─────────┐                                │
│                    │   TanStack DB     │  ← Reactive Client Store       │
│                    │  (Local State)    │                                │
│                    └─────────┬─────────┘                                │
└──────────────────────────────┼──────────────────────────────────────────┘
                               │ HTTP/REST
                               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         GATEWAY SERVICE                                  │
│                      (Node.js + Fastify + TS)                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                     Authentication Layer                         │   │
│  │  • JWT Verification  • RBAC (admin/user)  • Session Management  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                     │
│  │  /api/auth  │  │ /api/resume │  │/api/template│                     │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘                     │
└─────────┼────────────────┼────────────────┼─────────────────────────────┘
          │                │                │
          │                ▼                │
          │   ┌─────────────────────────┐   │
          │   │      AI BACKEND         │   │
          │   │  (Node.js + Fastify)    │   │
          │   │  ┌─────────────────┐    │   │
          │   │  │   PDF Parser    │    │   │
          │   │  │   (pdf-parse)   │    │   │
          │   │  └────────┬────────┘    │   │
          │   │           ▼             │   │
          │   │  ┌─────────────────┐    │   │
          │   │  │   Llama 3 LLM   │    │   │
          │   │  │   (via Ollama)  │    │   │
          │   │  └────────┬────────┘    │   │
          │   │           ▼             │   │
          │   │  ┌─────────────────┐    │   │
          │   │  │  LaTeX Engine   │    │   │
          │   │  │  (Compile PDF)  │    │   │
          │   │  └─────────────────┘    │   │
          │   └─────────────────────────┘   │
          │                                 │
          ▼                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          PERSISTENCE LAYER                               │
│  ┌─────────────────────────┐    ┌─────────────────────────────────┐    │
│  │   PostgreSQL / SQLite   │    │     File Storage (S3/Local)     │    │
│  │   (Users, Auth, Meta)   │    │   (PDFs, LaTeX Templates)       │    │
│  └─────────────────────────┘    └─────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Tech Stack Matrix

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Monorepo** | TurboRepo | Workspace orchestration, caching, parallel builds |
| **Language** | TypeScript | End-to-end type safety |
| **Frontend** | React 18 + Vite | SPA with fast HMR |
| **Styling** | Vanilla CSS + CSS Variables | Custom design system, Dark Mode |
| **State (Client)** | TanStack DB | Reactive collections, offline-first sync |
| **Routing** | react-router-dom v6 | Client-side navigation |
| **Gateway** | Fastify | High-performance Node.js server |
| **AI Backend** | Fastify | Dedicated service for AI/PDF processing |
| **Auth** | @fastify/jwt + argon2 | JWT tokens, secure password hashing |
| **LLM** | Llama 3 (8B/70B) + Ollama | Resume data extraction, structured JSON output |
| **PDF Parsing** | pdf-parse | Extract raw text from PDFs |
| **LaTeX** | TeX Live / latex-online API | Compile LaTeX to PDF |
| **Database** | PostgreSQL (prod) / SQLite (dev) | Persistent user and metadata storage |
| **File Storage** | AWS S3 / Local FS | Store uploaded PDFs and LaTeX templates |
| **Validation** | Zod | Runtime schema validation |

---

## 3. State Management Strategy

### Frontend State Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                      React Application                        │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                    Context Providers                     │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │ │
│  │  │ AuthContext │  │ThemeContext │  │  ResumeContext  │  │ │
│  │  │ • user      │  │ • darkMode  │  │ • resumeData    │  │ │
│  │  │ • token     │  │ • toggle()  │  │ • templateId    │  │ │
│  │  │ • login()   │  │             │  │ • setTemplate() │  │ │
│  │  │ • logout()  │  │             │  │                 │  │ │
│  │  └─────────────┘  └─────────────┘  └─────────────────┘  │ │
│  └─────────────────────────────────────────────────────────┘ │
│                              │                                │
│                              ▼                                │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                     TanStack DB                          │ │
│  │  ┌─────────────────┐  ┌─────────────────────────────┐   │ │
│  │  │ templatesStore  │  │      resumesStore           │   │ │
│  │  │ • id            │  │ • id                        │   │ │
│  │  │ • name          │  │ • userId                    │   │ │
│  │  │ • previewUrl    │  │ • extractedData (JSON)      │   │ │
│  │  │ • isPublished   │  │ • selectedTemplateId        │   │ │
│  │  │ • createdAt     │  │ • compiledPdfUrl            │   │ │
│  │  └─────────────────┘  └─────────────────────────────┘   │ │
│  └─────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

### State Responsibilities

| State Type | Location | Purpose |
|------------|----------|---------|
| **Auth State** | `AuthContext` | Current user, JWT token, login/logout |
| **UI State** | `ThemeContext` | Dark mode, sidebar collapsed, modals |
| **Resume State** | `ResumeContext` | Current resume data, selected template |
| **Server Cache** | TanStack DB | Templates list, user's saved resumes |

---

## 4. Admin Portal (Frontend)

The Admin Portal is a protected section of the frontend accessible only to users with `role: 'admin'`.

### Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/admin` | `AdminDashboard` | Overview with stats (total templates, users) |
| `/admin/templates` | `TemplateListPage` | Table of all templates with actions |
| `/admin/templates/upload` | `TemplateUploadPage` | Upload new LaTeX template |
| `/admin/templates/:id/edit` | `TemplateEditPage` | Edit template metadata |

### Access Control

```tsx
// ProtectedAdminRoute.tsx
const ProtectedAdminRoute = ({ children }) => {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'admin') return <Navigate to="/" />;
  
  return children;
};

// Usage in AppRouter
<Route path="/admin/*" element={
  <ProtectedAdminRoute>
    <AdminLayout />
  </ProtectedAdminRoute>
}>
  <Route index element={<AdminDashboard />} />
  <Route path="templates" element={<TemplateListPage />} />
  <Route path="templates/upload" element={<TemplateUploadPage />} />
</Route>
```

### Template Upload Page - Wireframe

```
┌─────────────────────────────────────────────────────────────────┐
│  Admin Portal > Upload Template                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Template Name:   ┌────────────────────────────────────────┐    │
│                   │ e.g., "Modern Professional"            │    │
│                   └────────────────────────────────────────┘    │
│                                                                  │
│  Description:     ┌────────────────────────────────────────┐    │
│                   │ A clean, modern template with sidebar. │    │
│                   │                                        │    │
│                   └────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                                                          │    │
│  │              📄 Drag & Drop .tex file here              │    │
│  │                   or click to browse                     │    │
│  │                                                          │    │
│  │                  [Only .tex files allowed]               │    │
│  │                                                          │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ☐ Publish immediately (make visible to all users)              │
│                                                                  │
│                            ┌─────────────────┐                   │
│                            │  Upload Template │                  │
│                            └─────────────────┘                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Template Upload Flow

```
┌────────────┐                    ┌────────────┐                    ┌────────────┐
│   Admin    │                    │  Gateway   │                    │  Storage   │
│  Frontend  │                    │  Service   │                    │  (S3/FS)   │
└─────┬──────┘                    └─────┬──────┘                    └─────┬──────┘
      │                                 │                                 │
      │  POST /api/templates            │                                 │
      │  FormData:                      │                                 │
      │  - file: resume-template.tex    │                                 │
      │  - name: "Modern Professional"  │                                 │
      │  - description: "..."           │                                 │
      │  - isPublished: true            │                                 │
      │ ───────────────────────────────>│                                 │
      │                                 │                                 │
      │                                 │  Validate: role === 'admin'     │
      │                                 │  Validate: file is .tex         │
      │                                 │  Validate: file size < 1MB      │
      │                                 │                                 │
      │                                 │  Store file                     │
      │                                 │ ───────────────────────────────>│
      │                                 │<───────────────────────────────│
      │                                 │  { filePath }                   │
      │                                 │                                 │
      │                                 │  INSERT INTO templates          │
      │                                 │  (name, description, file_path, │
      │                                 │   created_by, is_published)     │
      │                                 │                                 │
      │<───────────────────────────────│                                 │
      │  { id, name, status: 'created' }│                                 │
      │                                 │                                 │
      │  [Template now visible in       │                                 │
      │   User's Template Gallery]      │                                 │
```

### Template Management Table

| Column | Type | Actions |
|--------|------|---------|
| Name | String | Click to edit |
| Description | String | Click to edit |
| Created | Date | Display only |
| Status | Published/Draft | Toggle button |
| Actions | - | Edit / Delete |

```tsx
// TemplateListPage.tsx (simplified)
const TemplateListPage = () => {
  const templates = useTemplatesCollection(); // TanStack DB
  
  return (
    <Table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>Created</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {templates.map(t => (
          <tr key={t.id}>
            <td>{t.name}</td>
            <td>{t.description}</td>
            <td>{formatDate(t.createdAt)}</td>
            <td>
              <Toggle 
                checked={t.isPublished} 
                onChange={() => togglePublish(t.id)} 
              />
            </td>
            <td>
              <Button onClick={() => navigate(`/admin/templates/${t.id}/edit`)}>
                Edit
              </Button>
              <Button variant="danger" onClick={() => deleteTemplate(t.id)}>
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
```

---

## 5. Authentication Flow

### JWT-Based Authentication

```
┌────────────┐                    ┌────────────┐                    ┌────────────┐
│  Frontend  │                    │  Gateway   │                    │  Database  │
└─────┬──────┘                    └─────┬──────┘                    └─────┬──────┘
      │                                 │                                 │
      │  POST /api/auth/register        │                                 │
      │  { email, password, name }      │                                 │
      │ ───────────────────────────────>│                                 │
      │                                 │  Hash password (argon2)         │
      │                                 │  INSERT user                    │
      │                                 │ ───────────────────────────────>│
      │                                 │<───────────────────────────────│
      │                                 │  Generate JWT                   │
      │<───────────────────────────────│                                 │
      │  { token, user }                │                                 │
      │                                 │                                 │
      │  POST /api/auth/login           │                                 │
      │  { email, password }            │                                 │
      │ ───────────────────────────────>│                                 │
      │                                 │  SELECT user by email           │
      │                                 │ ───────────────────────────────>│
      │                                 │<───────────────────────────────│
      │                                 │  Verify password (argon2)       │
      │                                 │  Generate JWT                   │
      │<───────────────────────────────│                                 │
      │  { token, user }                │                                 │
      │                                 │                                 │
      │  GET /api/resume (Protected)    │                                 │
      │  Authorization: Bearer <token>  │                                 │
      │ ───────────────────────────────>│                                 │
      │                                 │  Verify JWT (authMiddleware)    │
      │                                 │  Extract userId                 │
      │                                 │  Proceed to handler             │
      │                                 │                                 │
```

### JWT Payload Structure

```typescript
interface JwtPayload {
  sub: string;        // User ID
  email: string;      // User email
  role: 'user' | 'admin';
  iat: number;        // Issued at
  exp: number;        // Expiration (24h default)
}
```

### Password Security
- **Hashing**: Argon2id (memory-hard, recommended by OWASP)
- **Salt**: Auto-generated per password
- **Token Expiry**: 24 hours (configurable)
- **Refresh**: Not implemented in MVP (can add later)

---

## 6. Database Schema

### Users Table

```sql
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name          VARCHAR(255) NOT NULL,
  role          VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at    TIMESTAMP DEFAULT NOW(),
  updated_at    TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
```

### Templates Table

```sql
CREATE TABLE templates (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          VARCHAR(255) NOT NULL,
  description   TEXT,
  file_path     VARCHAR(500) NOT NULL,       -- Path to .tex file
  preview_url   VARCHAR(500),                -- Pre-rendered preview image
  created_by    UUID REFERENCES users(id),
  is_published  BOOLEAN DEFAULT false,
  is_system     BOOLEAN DEFAULT false,       -- Built-in templates
  created_at    TIMESTAMP DEFAULT NOW(),
  updated_at    TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_templates_published ON templates(is_published);
```

### Resumes Table

```sql
CREATE TABLE resumes (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID REFERENCES users(id) ON DELETE CASCADE,
  original_file_path  VARCHAR(500),           -- Uploaded PDF path
  extracted_data      JSONB NOT NULL,         -- Structured resume JSON
  selected_template   UUID REFERENCES templates(id),
  compiled_pdf_path   VARCHAR(500),           -- Final PDF output
  status              VARCHAR(20) DEFAULT 'draft' 
                      CHECK (status IN ('draft', 'processing', 'completed', 'failed')),
  created_at          TIMESTAMP DEFAULT NOW(),
  updated_at          TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_resumes_user ON resumes(user_id);
```

### Entity Relationship Diagram

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│    users     │       │   resumes    │       │  templates   │
├──────────────┤       ├──────────────┤       ├──────────────┤
│ id (PK)      │──┐    │ id (PK)      │    ┌──│ id (PK)      │
│ email        │  │    │ user_id (FK) │────┘  │ name         │
│ password_hash│  └───>│ extracted_data│       │ file_path    │
│ name         │       │ selected_template (FK)│ created_by   │──┐
│ role         │       │ compiled_pdf_path    ││ is_published │  │
│ created_at   │       │ status       │       │ is_system    │  │
└──────────────┘       └──────────────┘       └──────────────┘  │
       │                                                         │
       └─────────────────────────────────────────────────────────┘
                         (admin creates templates)
```

---

## 7. ResumeData Schema (Shared Type)

```typescript
// packages/shared/src/types/resume.ts

export interface ResumeData {
  contact: {
    name: string;
    email: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
  summary?: string;
  experience: Array<{
    company: string;
    title: string;
    location?: string;
    startDate: string;       // "Jan 2020" or "2020-01"
    endDate?: string;        // "Present" or "2023-06"
    highlights: string[];    // Bullet points
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field?: string;
    graduationDate?: string;
    gpa?: string;
  }>;
  skills: {
    technical?: string[];
    languages?: string[];
    tools?: string[];
    soft?: string[];
  };
  projects?: Array<{
    name: string;
    description: string;
    technologies?: string[];
    link?: string;
  }>;
  certifications?: Array<{
    name: string;
    issuer: string;
    date?: string;
  }>;
}
```

---

## 8. API Endpoints Reference

### Gateway Service (Port 4000)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/register` | ❌ | Create new user account |
| `POST` | `/api/auth/login` | ❌ | Login and receive JWT |
| `GET` | `/api/auth/me` | ✅ | Get current user profile |
| `POST` | `/api/resume/upload` | ✅ | Upload PDF for parsing |
| `GET` | `/api/resume/:id` | ✅ | Get resume by ID |
| `PUT` | `/api/resume/:id` | ✅ | Update resume data |
| `GET` | `/api/templates` | ✅ | List published templates |
| `POST` | `/api/templates` | ✅ Admin | Upload new template |
| `PUT` | `/api/templates/:id` | ✅ Admin | Update template metadata |
| `DELETE` | `/api/templates/:id` | ✅ Admin | Delete template |

### AI Backend Service (Port 4001 - Internal Only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/ai/extract` | Parse PDF text → ResumeData JSON |
| `POST` | `/api/ai/compile` | Compile LaTeX + Data → PDF buffer |
| `GET` | `/api/ai/health` | Health check |

---

## 9. Environment Variables

### Frontend (.env)
```env
VITE_API_URL=http://localhost:4000/api
VITE_APP_NAME=Fast Resume
```

### Gateway (.env)
```env
PORT=4000
JWT_SECRET=your-super-secret-key
DATABASE_URL=postgresql://user:pass@localhost:5432/fastresume
AI_BACKEND_URL=http://localhost:4001
STORAGE_PATH=./uploads
```

### AI Backend (.env)
```env
PORT=4001
OLLAMA_URL=http://localhost:11434    # Ollama server URL
OLLAMA_MODEL=llama3:8b               # or llama3:70b for higher accuracy
LATEX_COMPILER=local  # or 'overleaf-api'
```

---

## 10. Security Considerations

| Area | Implementation |
|------|----------------|
| **Password Storage** | Argon2id hashing, never store plaintext |
| **JWT** | Short expiry (24h), secure secret, HttpOnly not applicable (SPA) |
| **CORS** | Whitelist frontend origin only |
| **Rate Limiting** | 100 req/min for auth, 10 req/min for AI endpoints |
| **Input Validation** | Zod schemas on all endpoints |
| **File Upload** | Type checking, size limits (10MB PDF, 1MB LaTeX) |
| **SQL Injection** | Parameterized queries via ORM (Drizzle/Prisma) |
| **XSS** | React's default escaping, no `dangerouslySetInnerHTML` |

---

## 11. Folder Structure

```
fast-resume/
├── apps/
│   ├── frontend/
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── contexts/
│   │   │   ├── hooks/
│   │   │   ├── styles/
│   │   │   └── main.tsx
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   ├── gateway/
│   │   ├── src/
│   │   │   ├── routes/
│   │   │   ├── middleware/
│   │   │   ├── services/
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   └── ai-backend/
│       ├── src/
│       │   ├── routes/
│       │   ├── services/
│       │   │   ├── pdfParser.ts
│       │   │   ├── geminiClient.ts
│       │   │   └── latexCompiler.ts
│       │   └── index.ts
│       └── package.json
│
├── packages/
│   ├── shared/
│   │   ├── src/
│   │   │   ├── types/
│   │   │   │   ├── resume.ts
│   │   │   │   ├── user.ts
│   │   │   │   └── template.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   └── db/
│       ├── src/
│       │   ├── collections/
│       │   └── index.ts
│       └── package.json
│
├── turbo.json
├── package.json
└── README.md
```
