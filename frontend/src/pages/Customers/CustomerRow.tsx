import type { Customer } from '../../types';

interface CustomerRowProps {
  customer: Customer;
  onEdit: (customer: Customer) => void;
  onDelete: (id: number) => void;
}

export default function CustomerRow({ customer, onEdit, onDelete }: CustomerRowProps) {
  return (
    <tr>
      <td style={{ padding: '10px', border: '1px solid #ddd' }}>{customer.id}</td>
      <td style={{ padding: '10px', border: '1px solid #ddd' }}>{customer.name}</td>
      <td style={{ padding: '10px', border: '1px solid #ddd' }}>{customer.email}</td>
      <td style={{ padding: '10px', border: '1px solid #ddd' }}>{customer.phone || '-'}</td>
      <td style={{ padding: '10px', border: '1px solid #ddd' }}>
        {new Date(customer.createdAt).toLocaleString('en-US')}
      </td>
      <td style={{ padding: '10px', border: '1px solid #ddd' }}>
        <button
          onClick={() => onEdit(customer)}
          style={{ padding: '4px 8px', marginRight: '5px' }}
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(customer.id)}
          style={{ padding: '4px 8px', backgroundColor: '#ff4444', color: 'white', border: 'none', cursor: 'pointer' }}
        >
          Delete
        </button>
      </td>
    </tr>
  );
}
