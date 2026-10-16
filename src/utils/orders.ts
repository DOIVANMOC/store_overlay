import { Order, OrderItem } from '../types/order';

const ORDERS_STORAGE_KEY = 'forest_orders_db';

class OrderService {
  private getStoredOrders(): Order[] {
    try {
      const data = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (!data) return [];
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  private saveStoredOrders(orders: Order[]): void {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (err) {
      console.error('Failed to save orders database', err);
    }
  }

  public generateLicenseKey(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const segment = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    return `FO-${segment()}-${segment()}-${segment()}`;
  }

  public createOrder(data: {
    userId?: string;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    items: OrderItem[];
    totalAmount: number;
    discountAmount: number;
    couponCode?: string;
    paymentMethod: 'vietqr' | 'momo' | 'free';
  }): Order {
    const orders = this.getStoredOrders();
    const orderNum = Math.floor(100000 + Math.random() * 900000);
    const newOrder: Order = {
      id: `FO-${orderNum}`,
      userId: data.userId,
      customerName: data.customerName.trim(),
      customerEmail: data.customerEmail.trim().toLowerCase(),
      customerPhone: data.customerPhone?.trim(),
      items: data.items,
      totalAmount: data.totalAmount,
      discountAmount: data.discountAmount,
      couponCode: data.couponCode,
      paymentMethod: data.paymentMethod,
      paymentStatus: 'completed',
      licenseKey: this.generateLicenseKey(),
      createdAt: new Date().toISOString()
    };

    orders.unshift(newOrder);
    this.saveStoredOrders(orders);
    return newOrder;
  }

  public getOrdersByCustomer(userId?: string, email?: string): Order[] {
    const orders = this.getStoredOrders();
    return orders.filter(o => {
      if (userId && o.userId === userId) return true;
      if (email && o.customerEmail.toLowerCase() === email.toLowerCase().trim()) return true;
      return false;
    });
  }

  public getAllOrders(): Order[] {
    return this.getStoredOrders();
  }

  public getVietQrUrl(amount: number, orderId: string): string {
    // Official VietQR standard format (MB Bank)
    return `https://img.vietqr.io/image/MB-0933933933-compact2.png?amount=${amount}&addInfo=FOREST%20${orderId}&accountName=HONG%20GIA%20HUY`;
  }
}

export const orderService = new OrderService();
