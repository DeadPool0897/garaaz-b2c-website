export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  image_url: string | null;
  sort_order: number;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
}

export interface VehicleMake {
  id: string;
  name: string;
  slug: string;
}

export interface VehicleModel {
  id: string;
  make_id: string;
  name: string;
  slug: string;
  make?: VehicleMake;
}

export interface Part {
  id: string;
  category_id: string;
  brand_id: string | null;
  name: string;
  slug: string;
  oem_number: string | null;
  description: string | null;
  image_url: string | null;
  price: number;
  mrp: number | null;
  in_stock: boolean;
  is_genuine: boolean;
  category?: Category;
  brand?: Brand;
}

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
}

export interface UserVehicle {
  id: string;
  user_id: string;
  model_id: string;
  registration_number: string | null;
  nickname: string | null;
  model?: VehicleModel;
}

export interface CartItem {
  id: string;
  user_id: string;
  part_id: string;
  quantity: number;
  part?: Part;
}

export interface Order {
  id: string;
  user_id: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: number;
  shipping_address: Record<string, string> | null;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  part_id: string;
  quantity: number;
  unit_price: number;
  part?: Part;
}
