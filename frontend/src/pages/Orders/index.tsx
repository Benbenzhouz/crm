import { useState, useEffect } from 'react';
import type { Order, OrderCreate, Customer, Product } from '../../types';
import { useToast } from '../../hooks/useToast';
import { useConfirm } from '../../components/ConfirmDialog';
import { orderService } from './OrderService';
import OrderForm from './OrderForm';
import OrderList from './OrderList';

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<OrderCreate>({
    customerId: 0,
    addressId: undefined,
    items: [{ productId: 0, quantity: 1 }],
  });
  const { showToast, ToastContainer } = useToast();
  const confirm = useConfirm();

  useEffect(() => {
    loadOrders();
    loadCustomers();
    loadProducts();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getAll();
      setOrders(data);
    } catch (error) {
      console.error('Failed to load orders:', error);
      showToast({ message: 'Failed to load orders', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const loadCustomers = async () => {
    try {
      const data = await orderService.getCustomers();
      setCustomers(data);
    } catch (error) {
      console.error('Failed to load customers:', error);
      showToast({ message: 'Failed to load customers', type: 'error' });
    }
  };

  const loadProducts = async () => {
    try {
      const data = await orderService.getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Failed to load products:', error);
      showToast({ message: 'Failed to load products', type: 'error' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.customerId === 0) {
      showToast({ message: 'Please select a customer', type: 'warning' });
      return;
    }
    if (!formData.addressId || formData.addressId === 0) {
      showToast({ message: 'Please select an address', type: 'warning' });
      return;
    }
    if (formData.items.some(item => item.productId === 0 || item.quantity <= 0)) {
      showToast({ message: 'Please complete all order item details', type: 'warning' });
      return;
    }
    try {
      await orderService.create(formData);
      showToast({ message: 'Order created successfully', type: 'success' });
  setFormData({ customerId: 0, addressId: undefined, items: [{ productId: 0, quantity: 1 }] });
      setShowForm(false);
      loadOrders();
      loadProducts();
    } catch (error: any) {
      console.error('Failed to create order:', error);
      const message = error.response?.data?.message || 'Failed to create order';
      showToast({ message, type: 'error' });
    }
  };

  const handleCancel = async (orderId: number) => {
    if (!(await confirm('Are you sure you want to cancel this order? Stock will be restored.'))) return;
    try {
      await orderService.cancel(orderId);
      showToast({ message: 'Order cancelled successfully', type: 'success' });
      loadOrders();
      loadProducts();
    } catch (error: any) {
      console.error('Failed to cancel order:', error);
      const message = error.response?.data?.message || 'Failed to cancel order';
      showToast({ message, type: 'error' });
    }
  };

  const handleComplete = async (orderId: number) => {
    if (!(await confirm('Are you sure you want to mark this order as completed?'))) return;
    try {
      await orderService.complete(orderId);
      showToast({ message: 'Order completed successfully', type: 'success' });
      loadOrders();
    } catch (error: any) {
      console.error('Failed to complete order:', error);
      const message = error.response?.data?.message || 'Failed to complete order';
      showToast({ message, type: 'error' });
    }
  };

  return (
    <>
      <ToastContainer />
      <div style={{ padding: '20px' }}>
        <h1>Order Management</h1>

        <div style={{ marginBottom: '20px' }}>
          <button
            onClick={() => setShowForm(!showForm)}
            style={{ padding: '10px 20px', fontSize: '16px' }}
          >
            {showForm ? 'Cancel' : '+ Create Order'}
          </button>
        </div>

        {showForm && (
          <OrderForm
            formData={formData}
            customers={customers}
            products={products}
            onFormDataChange={setFormData}
            onSubmit={handleSubmit}
            onCancel={() => setShowForm(false)}
          />
        )}

        <OrderList
          orders={orders}
          loading={loading}
          onCancel={handleCancel}
          onComplete={handleComplete}
        />
      </div>
    </>
  );
}
