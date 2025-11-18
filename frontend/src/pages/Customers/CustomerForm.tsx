import type { Customer, CustomerCreate } from '../../types';

interface CustomerFormProps {
  customer: Customer | null;
  formData: CustomerCreate;
  onFormDataChange: (data: CustomerCreate) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export default function CustomerForm({
  customer,
  formData,
  onFormDataChange,
  onSubmit,
  onCancel,
}: CustomerFormProps) {
  return (
    <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '4px' }}>
      <h2>{customer ? 'Edit Customer' : 'Add New Customer'}</h2>
      <form onSubmit={onSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>
            Name:
            <input
              type="text"
              value={formData.name}
              onChange={(e) => onFormDataChange({ ...formData, name: e.target.value })}
              required
              style={{ marginLeft: '10px', padding: '5px', width: '200px' }}
            />
          </label>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>
            Email:
            <input
              type="email"
              value={formData.email}
              onChange={(e) => onFormDataChange({ ...formData, email: e.target.value })}
              required
              style={{ marginLeft: '10px', padding: '5px', width: '200px' }}
            />
          </label>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>
            Phone:
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => onFormDataChange({ ...formData, phone: e.target.value })}
              style={{ marginLeft: '10px', padding: '5px', width: '200px' }}
            />
          </label>
        </div>
        <div>
          <button type="submit" style={{ padding: '8px 16px', marginRight: '10px' }}>
            {customer ? 'Update' : 'Create'}
          </button>
          {customer && (
            <button type="button" onClick={onCancel} style={{ padding: '8px 16px' }}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
