import axios from 'axios';
import type { Address, Customer } from '../../types';

const api = axios.create({
  baseURL: 'http://localhost:5115/api',
});

export const addressApi = {
  getAll: () => api.get<Address[]>('/addresses'),
  getById: (id: number) => api.get<Address>(`/addresses/${id}`),
  getCustomers: () => api.get<Customer[]>('/customers'),
  create: (data: Omit<Address, 'id' | 'customerName'>) => api.post('/addresses', data),
  update: (id: number, data: Omit<Address, 'id' | 'customerName'>) => api.put(`/addresses/${id}`, data),
  delete: (id: number) => api.delete(`/addresses/${id}`),
};
