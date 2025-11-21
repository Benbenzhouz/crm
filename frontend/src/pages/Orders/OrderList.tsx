import type { Order } from '../../types';
import OrderCard from './OrderCard';

interface OrderListProps {
  orders: Order[];
  loading: boolean;
  onCancel: (orderId: number) => void;
  onComplete: (orderId: number) => void;
}

export default function OrderList({ orders, loading, onCancel, onComplete }: OrderListProps) {
  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>Order List</h2>
      <div>
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} onCancel={onCancel} onComplete={onComplete} />
        ))}
      </div>
    </div>
  );
}
