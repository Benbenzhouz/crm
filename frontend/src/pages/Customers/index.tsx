import { useState, useEffect } from 'react';
import type { Customer, CustomerCreate } from '../../types';
import { useToast } from '../../hooks/useToast';
import { customerService } from './CustomerService';
import CustomerForm from './CustomerForm';
import CustomerList from './CustomerList';

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [formData, setFormData] = useState<CustomerCreate>({
    name: '',
    email: '',
    phone: '',
  });
  const { showToast, ToastContainer } = useToast();

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const data = await customerService.getAll();
      setCustomers(data);
    } catch (error) {
      console.error('Failed to load customers:', error);
      showToast({ message: 'Failed to load customers', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await customerService.update(editing.id, formData);
        showToast({ message: 'Customer updated successfully', type: 'success' });
      } else {
        await customerService.create(formData);
        showToast({ message: 'Customer created successfully', type: 'success' });
      }
      setFormData({ name: '', email: '', phone: '' });
      setEditing(null);
      loadCustomers();
    } catch (error) {
      console.error('Failed to save customer:', error);
      showToast({ message: 'Failed to save customer', type: 'error' });
    }
  };

  const handleEdit = (customer: Customer) => {
    setEditing(customer);
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone || '',
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this customer?')) return;
    try {
      await customerService.delete(id);
      showToast({ message: 'Customer deleted successfully', type: 'success' });
      loadCustomers();
    } catch (error: any) {
      console.error('Failed to delete customer:', error);
      const message = error.response?.data?.message || 'Failed to delete customer';
      showToast({ message, type: 'error' });
    }
  };

  const handleCancel = () => {
    setEditing(null);
    setFormData({ name: '', email: '', phone: '' });
  };

  return (
    <>
      <ToastContainer />
      <div style={{ padding: '20px' }}>
        <h1>Customer Management</h1>
        
        <CustomerForm
          customer={editing}
          formData={formData}
          onFormDataChange={setFormData}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />

        <CustomerList
          customers={customers}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </>
  );
}
