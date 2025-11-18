import { useState, useEffect } from 'react';
import type { Product, ProductCreate } from '../../types';
import { useToast } from '../../hooks/useToast';
import { productService } from './ProductService';
import ProductForm from './ProductForm';
import ProductList from './ProductList';

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductCreate>({
    name: '',
    sku: '',
    unitPrice: 0,
    currentStock: 0,
  });
  const { showToast, ToastContainer } = useToast();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAll();
      setProducts(data);
    } catch (error) {
      console.error('Failed to load products:', error);
      showToast({ message: 'Failed to load products', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await productService.update(editing.id, formData);
        showToast({ message: 'Product updated successfully', type: 'success' });
      } else {
        await productService.create(formData);
        showToast({ message: 'Product created successfully', type: 'success' });
      }
      setFormData({ name: '', sku: '', unitPrice: 0, currentStock: 0 });
      setEditing(null);
      loadProducts();
    } catch (error) {
      console.error('Failed to save product:', error);
      showToast({ message: 'Failed to save product', type: 'error' });
    }
  };

  const handleEdit = (product: Product) => {
    setEditing(product);
    setFormData({
      name: product.name,
      sku: product.sku,
      unitPrice: product.unitPrice,
      currentStock: product.currentStock,
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await productService.delete(id);
      showToast({ message: 'Product deleted successfully', type: 'success' });
      loadProducts();
    } catch (error: any) {
      console.error('Failed to delete product:', error);
      const message = error.response?.data?.message || 'Failed to delete product';
      showToast({ message, type: 'error' });
    }
  };

  const handleCancel = () => {
    setEditing(null);
    setFormData({ name: '', sku: '', unitPrice: 0, currentStock: 0 });
  };

  return (
    <>
      <ToastContainer />
      <div style={{ padding: '20px' }}>
        <h1>Product Management</h1>
        
        <ProductForm
          product={editing}
          formData={formData}
          onFormDataChange={setFormData}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />

        <ProductList
          products={products}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </>
  );
}
