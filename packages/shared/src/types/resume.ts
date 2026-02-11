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
    startDate: string;
    endDate?: string;
    highlights: string[];
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
