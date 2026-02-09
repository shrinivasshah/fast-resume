# Fast Resume - AI-Powered Resume Builder

Fast Resume is a modern, AI-driven application that takes the hassle out of formatting resumes. Users can upload their current resume in PDF format, choose from a variety of professionally designed templates, and let AI handle the heavy lifting of reformatting and styling their content to match the chosen template perfectly.

## Project Vision
To provide a seamless, high-quality resume building experience where the user focuses on their content, and the AI handles the complex formatting tasks.

## Technical Specifications (100% TypeScript)

### Infrastructure & Orchestration
- **Monorepo Manager**: **TurboRepo**.
- **Database**: **TanStack DB** (Reactive client store for fast, modern, and responsive data management).
- **Language**: TypeScript (End-to-end).

### Frontend
- **Framework**: React.js (TypeScript)
- **Styling**: Vanilla CSS.
- **Features**: 
    - **Login Page**: Secure user authentication.
    - **Admin Dashboard**: Upload and manage LaTeX templates.
    - **Template Selection**: Users can choose from a gallery of professionally designed and admin-uploaded templates.
    - **Live Preview**: Real-time rendering of resume data into selected templates.

### Services Architecture
1. **Gateway Service (Orchestrator)**:
    - **Framework**: Node.js (TypeScript)
    - **Role**: Sits between the React frontend and the Fastify AI Backend. 
    - **Authentication**: JWT-based auth or integration with an auth provider (e.g., Auth0/Clerk). Handles session management and secures all downstream requests.
2. **AI Backend**:
    - **Framework**: Node.js + Fastify (TypeScript)
    - **Role**: Communicates with the LLM (Gemini API). Handles PDF parsing and precise template formatting logic.

### AI Integration
- **Model**: **Llama 3 (8B/70B)** via **Ollama** (self-hosted, open-source).
- **Why Llama 3**: Excellent at structured JSON extraction, instruction-following, and runs locally without API costs.
- **Runtime**: Ollama (local dev) or vLLM/TGI (production).
- **Parsing**: `pdf-parse` for text extraction.

## Task-by-Task Roadmap

### Task 1: Foundation & Project Setup
- Initialize Next.js with TypeScript.
- Define the global CSS design system.
- Setup API routes for PDF handling and AI communication.

### Task 2: Resume Parsing Engine
- Implement the PDF upload endpoint.
- Develop the logic to extract raw text from PDF files.
- Create an LLM prompt that converts raw text into a standardized JSON resume schema (Work history, Education, Skills, etc.).

### Task 3: Template Library Development
- Design and implement multiple resume templates as React components.
- Ensure each template accepts standardized JSON data as props.
- Focus on diverse styles: Minimalist, Professional, Creative, and Technical.

### Task 4: Template Selector & AI Orchestration
- Build the frontend gallery for template selection.
- Implement the "Apply Template" flow:
    1. Extract data from PDF.
    2. Send structured data + template requirements to LLM.
    3. LLM returns formatted content ready for the specific template.

### Task 5: Preview & Export
- Create a live preview of the formatted resume.
- Implement "Print to PDF" functionality using browser print drivers or a backend PDF generator (e.g., Puppeteer).

### Task 6: Polishing & Deployment
- Final UI/UX refinements.
- Responsive testing (Desktop/Mobile).
- Deployment to Vercel/similar.
