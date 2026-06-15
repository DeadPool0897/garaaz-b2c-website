import type { Order, OrderItem, Part } from '../types';

export type DemoOrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface DemoOrder extends Order {
  order_items: OrderItem[];
  eta: string;
  itemCount: number;
}

const demoParts: Record<string, Partial<Part>> = {
  'demo-1': { id: 'demo-1', name: 'Front Disc Brake Pad Set — Swift / Dzire', slug: 'brake-pad-swift', oem_number: 'MS-BP-001', price: 1850, image_url: null, brand_id: null, category_id: '', in_stock: true, is_genuine: true, description: null, mrp: 2100 },
  'demo-2': { id: 'demo-2', name: 'Bosch Ceramic Front Brake Pads', slug: 'bosch-brake-pads', oem_number: 'F002H23001', price: 1245, image_url: null, brand_id: null, category_id: '', in_stock: true, is_genuine: false, description: null, mrp: null },
  'demo-3': { id: 'demo-3', name: 'Oil Filter Element — K-Series 1.2L', slug: 'oil-filter-k-series', oem_number: 'MS-OF-220', price: 245, image_url: null, brand_id: null, category_id: '', in_stock: true, is_genuine: true, description: null, mrp: 320 },
  'demo-4': { id: 'demo-4', name: 'Air Filter — High Flow Cotton', slug: 'air-filter-kn', oem_number: 'BSH-AF-77', price: 1690, image_url: null, brand_id: null, category_id: '', in_stock: true, is_genuine: false, description: null, mrp: null },
  'demo-5': { id: 'demo-5', name: 'Clutch Plate Assembly', slug: 'clutch-plate', oem_number: 'CL-8821', price: 4350, image_url: null, brand_id: null, category_id: '', in_stock: false, is_genuine: true, description: null, mrp: 4800 },
};

function makeItem(orderId: string, partKey: string, qty: number, idx: number): OrderItem {
  const part = demoParts[partKey]!;
  return {
    id: `${orderId}-item-${idx}`,
    order_id: orderId,
    part_id: part.id!,
    quantity: qty,
    unit_price: part.price!,
    part: part as Part,
  };
}

export const DEMO_ORDERS: DemoOrder[] = [
  {
    id: 'demo-ord-pending',
    user_id: 'demo',
    status: 'pending',
    total_amount: 3095,
    shipping_address: null,
    created_at: '2026-06-14T10:30:00Z',
    eta: 'Awaiting confirmation',
    itemCount: 2,
    order_items: [
      makeItem('demo-ord-pending', 'demo-1', 1, 0),
      makeItem('demo-ord-pending', 'demo-3', 1, 1),
    ],
  },
  {
    id: 'demo-ord-confirmed',
    user_id: 'demo',
    status: 'confirmed',
    total_amount: 9165,
    shipping_address: null,
    created_at: '2026-06-12T14:00:00Z',
    eta: 'Arriving today',
    itemCount: 3,
    order_items: [
      makeItem('demo-ord-confirmed', 'demo-1', 2, 0),
      makeItem('demo-ord-confirmed', 'demo-2', 1, 1),
      makeItem('demo-ord-confirmed', 'demo-4', 1, 2),
    ],
  },
  {
    id: 'demo-ord-shipped',
    user_id: 'demo',
    status: 'shipped',
    total_amount: 4350,
    shipping_address: null,
    created_at: '2026-06-10T09:15:00Z',
    eta: 'Arriving 14 Jun',
    itemCount: 2,
    order_items: [
      makeItem('demo-ord-shipped', 'demo-5', 1, 0),
    ],
  },
  {
    id: 'demo-ord-delivered-1',
    user_id: 'demo',
    status: 'delivered',
    total_amount: 12790,
    shipping_address: null,
    created_at: '2026-06-06T11:00:00Z',
    eta: 'Delivered 08 Jun',
    itemCount: 5,
    order_items: [
      makeItem('demo-ord-delivered-1', 'demo-1', 2, 0),
      makeItem('demo-ord-delivered-1', 'demo-2', 2, 1),
      makeItem('demo-ord-delivered-1', 'demo-3', 3, 2),
      makeItem('demo-ord-delivered-1', 'demo-4', 1, 3),
    ],
  },
  {
    id: 'demo-ord-delivered-2',
    user_id: 'demo',
    status: 'delivered',
    total_amount: 2450,
    shipping_address: null,
    created_at: '2026-06-01T16:45:00Z',
    eta: 'Delivered 03 Jun',
    itemCount: 1,
    order_items: [
      makeItem('demo-ord-delivered-2', 'demo-3', 1, 0),
    ],
  },
  {
    id: 'demo-ord-cancelled',
    user_id: 'demo',
    status: 'cancelled',
    total_amount: 1980,
    shipping_address: null,
    created_at: '2026-05-22T08:20:00Z',
    eta: 'Cancelled by user',
    itemCount: 2,
    order_items: [
      makeItem('demo-ord-cancelled', 'demo-2', 1, 0),
      makeItem('demo-ord-cancelled', 'demo-3', 1, 1),
    ],
  },
];

export const ORDER_TABS = ['All', 'Active', 'Delivered', 'Cancelled'] as const;

export function filterDemoOrders(tab: string): DemoOrder[] {
  if (tab === 'All') return DEMO_ORDERS;
  if (tab === 'Active') return DEMO_ORDERS.filter(o => ['pending', 'confirmed', 'shipped'].includes(o.status));
  if (tab === 'Delivered') return DEMO_ORDERS.filter(o => o.status === 'delivered');
  if (tab === 'Cancelled') return DEMO_ORDERS.filter(o => o.status === 'cancelled');
  return DEMO_ORDERS;
}

export const statusBarColors: Record<DemoOrderStatus, string> = {
  pending: 'bg-amber-500',
  confirmed: 'bg-sky-500',
  shipped: 'bg-indigo-500',
  delivered: 'bg-slate-400',
  cancelled: 'bg-red-500',
};
