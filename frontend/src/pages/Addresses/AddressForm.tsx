import type { Address, Customer } from '../../types';
import { useState } from 'react';

interface AddressFormProps {
  customers: Customer[];
  formData: Omit<Address, 'id' | 'customerName'>;
  editingId: number | null;
  onFormDataChange: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export default function AddressForm({ customers, formData, editingId, onFormDataChange, onSubmit, onCancel }: AddressFormProps) {
  return (
    <form onSubmit={onSubmit} style={{ marginBottom: '20px', padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
      <h2>{editingId ? 'Edit Address' : 'Create New Address'}</h2>
      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Customer:</label>
        <select
          value={formData.customerId}
          onChange={(e) => onFormDataChange({ ...formData, customerId: parseInt(e.target.value) })}
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
          onChange={(e) => onFormDataChange({ ...formData, street: e.target.value })}
          style={{ width: '100%', padding: '8px' }}
          required
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Suburb:</label>
        <input
          type="text"
          value={formData.suburb}
          onChange={(e) => onFormDataChange({ ...formData, suburb: e.target.value })}
          style={{ width: '100%', padding: '8px' }}
          required
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Postcode:</label>
        <input
          type="text"
          value={formData.postcode}
          onChange={(e) => onFormDataChange({ ...formData, postcode: e.target.value })}
          style={{ width: '100%', padding: '8px' }}
          required
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>State:</label>
        <input
          type="text"
          value={formData.state}
          onChange={(e) => onFormDataChange({ ...formData, state: e.target.value })}
          style={{ width: '100%', padding: '8px' }}
          required
        />
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button type="submit" style={{ padding: '10px 20px' }}>{editingId ? 'Update' : 'Create'}</button>
        <button type="button" onClick={onCancel} style={{ padding: '10px 20px' }}>Cancel</button>
      </div>
    </form>
  );
}
