import type { Address, Customer } from '../../types';

interface AddressListProps {
  addresses: Address[];
  loading: boolean;
  onEdit: (address: Address) => void;
  onDelete: (id: number) => void;
}

export default function AddressList({ addresses, loading, onEdit, onDelete }: AddressListProps) {
  return (
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
                    onClick={() => onDelete(address.id)}
                    style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', marginRight: '8px' }}
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => onEdit(address)}
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
  );
}
