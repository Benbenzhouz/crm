import axios from 'axios';
import type { Address } from './types';

const api = axios.create({
  baseURL: 'http://localhost:5115/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const addressApi = {
  getByCustomer: (customerId: number) => api.get<Address[]>(`/addresses/customer/${customerId}`),
};
