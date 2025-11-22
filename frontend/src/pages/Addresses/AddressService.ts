import { customerApi, addressApi } from '../../api';
import type { Address, Customer, AddressCreate, AddressUpdate } from '../../types';

class AddressService {
  async getAll(): Promise<Address[]> {
    const response = await addressApi.getAll();
    return response.data;
  }

  async getById(id: number): Promise<Address> {
    const response = await addressApi.getById(id);
    return response.data;
  }

  async create(data: AddressCreate): Promise<Address> {
    const response = await addressApi.create(data);
    return response.data;
  }

  async update(id: number, data: AddressUpdate): Promise<Address> {
    const response = await addressApi.update(id, data);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await addressApi.delete(id);
  }

  async getCustomers(): Promise<Customer[]> {
    const response = await customerApi.getAll();
    return response.data;
  }

  async getByCustomer(customerId: number): Promise<Address[]> {
    const response = await addressApi.getByCustomer(customerId);
    return response.data;
  }
}

export const addressService = new AddressService();
