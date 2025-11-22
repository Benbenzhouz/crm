import axios from 'axios';
import type {
  Customer,
  CustomerCreate,
  CustomerUpdate,
  Product,
  ProductCreate,
  ProductUpdate,
  Order,
  OrderCreate,
  Address,
  AddressCreate,
  AddressUpdate,
} from './types';

const api = axios.create({
  baseURL: 'http://localhost:5115/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Customer API
export const customerApi = {
  getAll: () => api.get<Customer[]>('/customers'),
  getById: (id: number) => api.get<Customer>(`/customers/${id}`),
  create: (data: CustomerCreate) => api.post<Customer>('/customers', data),
  update: (id: number, data: CustomerUpdate) => api.put<Customer>(`/customers/${id}`, data),
  delete: (id: number) => api.delete(`/customers/${id}`),
};

// Product API
export const productApi = {
  getAll: () => api.get<Product[]>('/products'),
  getById: (id: number) => api.get<Product>(`/products/${id}`),
  create: (data: ProductCreate) => api.post<Product>('/products', data),
  update: (id: number, data: ProductUpdate) => api.put<Product>(`/products/${id}`, data),
  delete: (id: number) => api.delete(`/products/${id}`),
};

// Order API
export const orderApi = {
  getAll: () => api.get<Order[]>('/orders'),
  getById: (id: number) => api.get<Order>(`/orders/${id}`),
  create: (data: OrderCreate) => api.post<Order>('/orders', data),
  cancel: (id: number) => api.post(`/orders/${id}/cancel`),
  complete: (id: number) => api.post(`/orders/${id}/complete`),
};

// Address API
export const addressApi = {
  getAll: () => api.get<Address[]>('/addresses'),
  getById: (id: number) => api.get<Address>(`/addresses/${id}`),
  getByCustomer: (customerId: number) => api.get<Address[]>(`/addresses/customer/${customerId}`),
  create: (data: AddressCreate) => api.post<Address>('/addresses', data),
  update: (id: number, data: AddressUpdate) => api.put<Address>(`/addresses/${id}`, data),
  delete: (id: number) => api.delete(`/addresses/${id}`),
};
