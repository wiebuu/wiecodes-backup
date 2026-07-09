
export interface Template {
  id: number;
  title: string;
  category: string;
  price: string;
  rating: number;
  downloads: string;
  preview: string;
  tags: string[];
  framework: string;
  theme: string;
  platform: string;
  description?: string;
  features?: string[];
  techStack?: string[];
  liveDemoUrl?: string;
  codePreview?: string;
}

