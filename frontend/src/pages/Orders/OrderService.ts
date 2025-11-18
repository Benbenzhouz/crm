import { orderApi, customerApi, productApi } from '../../api';
import type { Order, OrderCreate, Customer, Product } from '../../types';

class OrderService {
  async getAll(): Promise<Order[]> {
    const response = await orderApi.getAll();
    return response.data;
  }

  async getById(id: number): Promise<Order> {
    const response = await orderApi.getById(id);
    return response.data;
  }

  async create(data: OrderCreate): Promise<Order> {
    const response = await orderApi.create(data);
    return response.data;
  }

  async cancel(id: number): Promise<void> {
    await orderApi.cancel(id);
  }

  async getCustomers(): Promise<Customer[]> {
    const response = await customerApi.getAll();
    return response.data;
  }

  async getProducts(): Promise<Product[]> {
    const response = await productApi.getAll();
    return response.data;
  }
}

export const orderService = new OrderService();
