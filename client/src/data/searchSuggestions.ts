// ✅ Define Template type or import it from your model if available
type Template = {
  _id: string;
  title: string;
  category?: string;
  estimatedPrice?: number;
  framework?: string;
  theme?: string;
  platform?: string;
  previewImageUrl?: string;
};

// ✅ PartialTemplate extends from it
type PartialTemplate = Partial<Template> & { _id: string; title: string };

