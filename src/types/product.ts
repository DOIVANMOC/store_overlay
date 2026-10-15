export type ProductCategory =
  | 'all'
  | 'nature'
  | 'minimal'
  | 'gaming'
  | 'dark'
  | 'webcam'
  | 'full-package'
  | 'free'
  | 'paid';

export interface IncludedFile {
  name: string;
  type: string;
  size: string;
  downloadUrl?: string; // Link to download (e.g. Google Drive, direct URL)
  fileData?: string;    // Base64 Data URL or Blob URL for client-uploaded files
  isProjectSource?: boolean; // Highlighted as main project asset / source file
}

export interface ProductPreviewScenes {
  obsScene: string;
  startingSoon: string;
  beRightBack: string;
  webcamCloseup: string;
  stingerAlert: string;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  shortDesc: string;
  description: string;
  category: ProductCategory;
  categoryLabel: string;
  price: number;
  originalPrice?: number;
  isFree: boolean;
  badge?: 'Bestseller' | 'Featured' | 'New' | 'Popular' | 'Trending' | 'Free Community' | 'Staff Pick';
  featuredInHero?: boolean;
  isTopThreeFeatured?: boolean;
  platforms: string[];
  resolution: string;
  fps: number;
  aspectRatio: string;
  softwareCompatibility: string[];
  includedFiles: IncludedFile[];
  installSteps: string[];
  themeColor: string;
  accentColor: string;
  previews: ProductPreviewScenes;
  tags: string[];
  mockupPreset: 'forest_woods' | 'clean_pine' | 'cyber_emerald' | 'moss_stone' | 'bonsai_tiktok' | 'silent_mist' | 'sprout_starter' | 'whisper_willow';
  // Project files attached by Admin
  projectDownloadUrl?: string; // Master cloud link (Google Drive, Mega, MediaFire, Dropbox, etc.)
  projectPackName?: string;    // Package archive name, e.g. "Cyber_Neon_OBS_Full_Project.zip"
  projectPackSize?: string;    // Size label, e.g. "85.4 MB"
}

export interface CartItem {
  product: Product;
  addedAt: number;
}

