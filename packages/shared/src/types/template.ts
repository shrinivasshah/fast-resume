export interface Template {
  id: string;
  name: string;
  description?: string;
  filePath: string;
  previewUrl?: string;
  createdBy: string;
  isPublished: boolean;
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
}
