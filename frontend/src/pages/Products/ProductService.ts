import { productApi } from '../../api';
import type { Product, ProductCreate } from '../../types';

class ProductService {
  async getAll(): Promise<Product[]> {
    const response = await productApi.getAll();
    return response.data;
  }

  async getById(id: number): Promise<Product> {
    const response = await productApi.getById(id);
    return response.data;
  }

  async create(data: ProductCreate): Promise<Product> {
    const response = await productApi.create(data);
    return response.data;
  }

  async update(id: number, data: ProductCreate): Promise<Product> {
    const response = await productApi.update(id, data);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await productApi.delete(id);
  }
}

export const productService = new ProductService();
