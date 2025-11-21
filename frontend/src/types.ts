// Customer Types
export interface Customer {
  id: number;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
}

export interface CustomerCreate {
  name: string;
  email: string;
  phone?: string;
}

export interface CustomerUpdate {
  name: string;
  email: string;
  phone?: string;
}

// Product Types
export interface Product {
  id: number;
  name: string;
  sku: string;
  unitPrice: number;
  currentStock: number;
  createdAt: string;
}

export interface ProductCreate {
  name: string;
  sku: string;
  unitPrice: number;
  currentStock: number;
}

export interface ProductUpdate {
  name: string;
  sku: string;
  unitPrice: number;
  currentStock: number;
}

// Order Types
export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface Order {
  id: number;
  customerId: number;
  customerName: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
}

export interface OrderItemCreate {
  productId: number;
  quantity: number;
}

export interface OrderCreate {
  customerId: number;
  items: OrderItemCreate[];
}

// Address Types
export interface Address {
  id: number;
  customerId: number;
  customerName: string;
  street: string;
  suburb: string;
  postcode: string;
  state: string;
}

export interface AddressCreate {
  customerId: number;
  street: string;
  suburb: string;
  postcode: string;
  state: string;
}

export interface AddressUpdate {
  street: string;
  suburb: string;
  postcode: string;
  state: string;
}
