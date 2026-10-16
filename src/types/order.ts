import { IncludedFile } from './product';

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  image: string;
  resolution: string;
  projectDownloadUrl?: string;
  projectPackName?: string;
  projectPackSize?: string;
  includedFiles?: IncludedFile[];
}

export interface Order {
  id: string; // e.g. "FO-829104"
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  items: OrderItem[];
  totalAmount: number;
  discountAmount: number;
  couponCode?: string;
  paymentMethod: 'vietqr' | 'momo' | 'free';
  paymentStatus: 'completed' | 'pending';
  licenseKey: string;
  createdAt: string;
}
