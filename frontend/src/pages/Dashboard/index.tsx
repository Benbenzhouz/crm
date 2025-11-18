import { useState, useEffect } from 'react';
import { customerApi, productApi, orderApi } from '../../api';
import type { Customer, Product, Order } from '../../types';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load all data in parallel
      const [customersRes, productsRes, ordersRes] = await Promise.all([
        customerApi.getAll(),
        productApi.getAll(),
        orderApi.getAll(),
      ]);

      const customers: Customer[] = customersRes.data;
      const products: Product[] = productsRes.data;
      const orders: Order[] = ordersRes.data;

      // Calculate stats
      const totalRevenue = orders
        .filter(o => o.status !== 'Cancelled')
        .reduce((sum, order) => sum + order.totalAmount, 0);

      setStats({
        totalCustomers: customers.length,
        totalProducts: products.length,
        totalOrders: orders.length,
        totalRevenue,
      });

      // Get recent orders (last 5)
      const sortedOrders = [...orders].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setRecentOrders(sortedOrders.slice(0, 5));

      // Get low stock products (stock < 20)
      const lowStock = products.filter(p => p.currentStock < 20).slice(0, 5);
      setLowStockProducts(lowStock);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Dashboard</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>Welcome to Mini CRM System</p>

      {/* Statistics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#fff', 
          border: '1px solid #ddd', 
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>Total Customers</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#2196F3' }}>{stats.totalCustomers}</div>
        </div>

        <div style={{ 
          padding: '20px', 
          backgroundColor: '#fff', 
          border: '1px solid #ddd', 
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>Total Products</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#4CAF50' }}>{stats.totalProducts}</div>
        </div>

        <div style={{ 
          padding: '20px', 
          backgroundColor: '#fff', 
          border: '1px solid #ddd', 
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>Total Orders</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#FF9800' }}>{stats.totalOrders}</div>
        </div>

        <div style={{ 
          padding: '20px', 
          backgroundColor: '#fff', 
          border: '1px solid #ddd', 
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>Total Revenue</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#9C27B0' }}>${stats.totalRevenue?.toFixed(2) || '0.00'}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
        {/* Recent Orders */}
        <div style={{ 
          backgroundColor: '#fff', 
          border: '1px solid #ddd', 
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ marginTop: 0, marginBottom: '20px' }}>Recent Orders</h2>
          {recentOrders.length === 0 ? (
            <p style={{ color: '#999' }}>No orders yet</p>
          ) : (
            <div>
              {recentOrders.map((order) => (
                <div 
                  key={order.id}
                  style={{
                    padding: '12px',
                    marginBottom: '10px',
                    border: '1px solid #eee',
                    borderRadius: '4px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 'bold' }}>Order #{order.id}</div>
                    <div style={{ fontSize: '14px', color: '#666' }}>{order.customerName || 'Unknown'}</div>
                    <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                      {new Date(order.createdAt).toLocaleString('en-US')}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>${order.totalAmount?.toFixed(2) || '0.00'}</div>
                    <span
                      style={{
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
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low Stock Products */}
        <div style={{ 
          backgroundColor: '#fff', 
          border: '1px solid #ddd', 
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ marginTop: 0, marginBottom: '20px' }}>Low Stock Alert</h2>
          {lowStockProducts.length === 0 ? (
            <p style={{ color: '#999' }}>All products in stock</p>
          ) : (
            <div>
              {lowStockProducts.map((product) => (
                <div 
                  key={product.id}
                  style={{
                    padding: '12px',
                    marginBottom: '10px',
                    border: '1px solid #ffebee',
                    borderRadius: '4px',
                    backgroundColor: product.currentStock < 10 ? '#ffebee' : '#fff3e0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{product.name}</div>
                    <div style={{ fontSize: '14px', color: '#666' }}>SKU: {product.sku}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ 
                      fontSize: '20px', 
                      fontWeight: 'bold',
                      color: product.currentStock < 10 ? '#f44336' : '#ff9800'
                    }}>
                      {product.currentStock}
                    </div>
                    <div style={{ fontSize: '12px', color: '#999' }}>In Stock</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
