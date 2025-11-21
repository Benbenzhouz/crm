import type { Order } from '../../types';

interface OrderCardProps {
  order: Order;
  onCancel: (orderId: number) => void;
  onComplete: (orderId: number) => void;
}

export default function OrderCard({ order, onCancel, onComplete }: OrderCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return '#4CAF50';
      case 'Completed': return '#2196F3';
      case 'Cancelled': return '#f44336';
      default: return '#999';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'New': return 'New';
      case 'Completed': return 'Completed';
      case 'Cancelled': return 'Cancelled';
      default: return status;
    }
  };

  return (
    <div
      style={{
        marginBottom: '20px',
        padding: '15px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        backgroundColor: '#fff',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div>
          <strong>Order #{order.id}</strong> - Customer: {order.customerName || 'Unknown'}
          <span
            style={{
              marginLeft: '10px',
              padding: '3px 8px',
              borderRadius: '3px',
              backgroundColor: getStatusColor(order.status),
              color: 'white',
              fontSize: '12px',
            }}
          >
            {getStatusText(order.status)}
          </span>
        </div>
        <div>
          <strong>Total: ${order.totalAmount?.toFixed(2) || '0.00'}</strong>
        </div>
      </div>
      {/* 地址信息新起一行显示 */}
      {(order.street || order.suburb || order.postcode || order.state) && (
        <div style={{ fontSize: '14px', color: '#444', marginBottom: '8px', marginLeft: '2px' }}>
          <span style={{ fontWeight: 500 }}>Address: </span>
          {order.street || ''}
          {order.suburb ? `, ${order.suburb}` : ''}
          {order.postcode ? `, ${order.postcode}` : ''}
          {order.state ? `, ${order.state}` : ''}
        </div>
      )}
      <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
        Created: {new Date(order.createdAt).toLocaleString('en-US')}
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '10px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f5f5f5' }}>
            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Product</th>
            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right' }}>Unit Price</th>
            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right' }}>Quantity</th>
            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right' }}>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {order.items?.map((item) => (
            <tr key={item.id}>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>{item.productName}</td>
              <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right' }}>
                ${item.unitPrice?.toFixed(2) || '0.00'}
              </td>
              <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right' }}>
                {item.quantity}
              </td>
              <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right' }}>
                ${item.lineTotal?.toFixed(2) || '0.00'}
              </td>
            </tr>
          )) || <tr><td colSpan={4} style={{ textAlign: 'center', padding: '8px' }}>No items</td></tr>}
        </tbody>
      </table>
      {order.status === 'New' && (
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => onComplete(order.id)}
            style={{
              padding: '6px 12px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '3px',
            }}
          >
            Complete Order
          </button>
          <button
            onClick={() => onCancel(order.id)}
            style={{
              padding: '6px 12px',
              backgroundColor: '#ff9800',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '3px',
            }}
          >
            Cancel Order
          </button>
        </div>
      )}
    </div>
  );
}
