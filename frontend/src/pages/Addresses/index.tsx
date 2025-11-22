import { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '../../hooks/useToast';
import { useConfirm } from '../../components/ConfirmDialog';

const api = axios.create({
  baseURL: 'http://localhost:5115/api',
});

interface Address {
  id: number;
  customerId: number;
  customerName: string;
  street: string;
  suburb: string;
  postcode: string;
  state: string;
}

interface Customer {
  id: number;
  name: string;
}

export default function Addresses() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    customerId: 0,
    street: '',
    suburb: '',
    postcode: '',
    state: '',
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const { showToast, ToastContainer } = useToast();
  const confirm = useConfirm();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [addressesRes, customersRes] = await Promise.all([
        api.get('/addresses'),
        api.get('/customers'),
      ]);
      setAddresses(addressesRes.data);
      setCustomers(customersRes.data);
    } catch (error) {
      console.error('Failed to load data:', error);
      showToast({ message: 'Failed to load data', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.customerId === 0) {
      showToast({ message: 'Please select a customer', type: 'warning' });
      return;
    }
    try {
      if (editingId) {
        await api.put(`/addresses/${editingId}`, formData);
        showToast({ message: 'Address updated successfully', type: 'success' });
      } else {
        await api.post('/addresses', formData);
        showToast({ message: 'Address created successfully', type: 'success' });
      }
      setFormData({ customerId: 0, street: '', suburb: '', postcode: '', state: '' });
      setEditingId(null);
      setShowForm(false);
      loadData();
    } catch (error: any) {
      const message = error.response?.data?.message || (editingId ? 'Failed to update address' : 'Failed to create address');
      showToast({ message, type: 'error' });
    }
  };

  const handleDelete = async (id: number) => {
    if (!(await confirm('Are you sure you want to delete this address?'))) return;
    try {
      await api.delete(`/addresses/${id}`);
      showToast({ message: 'Address deleted successfully', type: 'success' });
      loadData();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete address';
      showToast({ message, type: 'error' });
    }
  };

  return (
    <>
      <ToastContainer />
      <div style={{ padding: '20px' }}>
        <h1>Address Management</h1>

        <div style={{ marginBottom: '20px' }}>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setFormData({ customerId: 0, street: '', suburb: '', postcode: '', state: '' });
              setEditingId(null);
            }}
            style={{ padding: '10px 20px', fontSize: '16px' }}
          >
            {showForm ? 'Cancel' : '+ Create Address'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} style={{ marginBottom: '20px', padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
            <h2>{editingId ? 'Edit Address' : 'Create New Address'}</h2>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Customer:</label>
              <select
                value={formData.customerId}
                onChange={(e) => setFormData({ ...formData, customerId: parseInt(e.target.value) })}
                style={{ width: '100%', padding: '8px' }}
                required
                disabled={!!editingId}
              >
                <option value={0}>Select Customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Street:</label>
              <input
                type="text"
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                style={{ width: '100%', padding: '8px' }}
                required
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Suburb:</label>
              <input
                type="text"
                value={formData.suburb}
                onChange={(e) => setFormData({ ...formData, suburb: e.target.value })}
                style={{ width: '100%', padding: '8px' }}
                required
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Postcode:</label>
              <input
                type="text"
                value={formData.postcode}
                onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                style={{ width: '100%', padding: '8px' }}
                required
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>State:</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                style={{ width: '100%', padding: '8px' }}
                required
              />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" style={{ padding: '10px 20px' }}>{editingId ? 'Update' : 'Create'}</button>
              <button type="button" onClick={() => { setShowForm(false); setEditingId(null); setFormData({ customerId: 0, street: '', suburb: '', postcode: '', state: '' }); }} style={{ padding: '10px 20px' }}>Cancel</button>
            </div>
          </form>
        )}

        <div>
          <h2>Address List</h2>
          {loading ? (
            <div>Loading addresses...</div>
          ) : addresses.length === 0 ? (
            <div>No addresses found. Create one to get started!</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f5f5f5' }}>
                  <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>ID</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Customer</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Street</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Suburb</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Postcode</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>State</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {addresses.map((address) => (
                  <tr key={address.id}>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{address.id}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{address.customerName}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{address.street}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{address.suburb}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{address.postcode}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{address.state}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                      <button
                        onClick={() => handleDelete(address.id)}
                        style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', marginRight: '8px' }}
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => {
                          setShowForm(true);
                          setEditingId(address.id);
                          setFormData({
                            customerId: address.customerId,
                            street: address.street,
                            suburb: address.suburb,
                            postcode: address.postcode,
                            state: address.state,
                          });
                        }}
                        style={{ padding: '5px 10px', backgroundColor: '#007bff', color: 'white' }}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
