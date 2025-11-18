import { customerApi } from '../../api';
import type { Customer, CustomerCreate, CustomerUpdate } from '../../types';

export class CustomerService {
  async getAll(): Promise<Customer[]> {
    const response = await customerApi.getAll();
    return response.data;
  }

  async getById(id: number): Promise<Customer> {
    const response = await customerApi.getById(id);
    return response.data;
  }

  async create(data: CustomerCreate): Promise<Customer> {
    const response = await customerApi.create(data);
    return response.data;
  }

  async update(id: number, data: CustomerUpdate): Promise<Customer> {
    const response = await customerApi.update(id, data);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await customerApi.delete(id);
  }
}

export const customerService = new CustomerService();
