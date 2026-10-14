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
}

export interface CartItem {
  product: Product;
  addedAt: number;
}
