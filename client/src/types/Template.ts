export interface Template {
    _id: string;
    title: string;
    description: string;
    estimatedPrice: number;
  
    category?: string;
    framework?: string;
    platform?: string;
    theme?: string;
  
    githubRepo?: string;
    uploadType: 'github' | 'zip';
    zipFilePath?: string;
    previewImageUrl?: string;
  
    tags?: string[];
    features?: string[];
    techStack?: string[];
    codePreview?: string;
    liveLink?: string;
  
    status: 'pending' | 'approved' | 'rejected';
    uploadedBy: string;
  
    createdAt?: string;
    updatedAt?: string;
  }
  