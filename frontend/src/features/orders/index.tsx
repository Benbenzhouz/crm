import { useState, useEffect } from 'react';
import { orderApi, customerApi, productApi } from '../../api';
import { useConfirm } from '../../components/ConfirmDialog';
import type { Order, OrderCreate, OrderItemCreate, Customer, Product } from '../../types';

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<OrderCreate>({
    customerId: 0,
    items: [{ productId: 0, quantity: 1 }],
  });
  const confirm = useConfirm();

  useEffect(() => {
    loadOrders();
    loadCustomers();
    loadProducts();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await orderApi.getAll();
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to load orders:', error);
      alert('加载订单列表失败');
    } finally {
      setLoading(false);
    }
  };

  const loadCustomers = async () => {
    try {
      const response = await customerApi.getAll();
      setCustomers(response.data);
    } catch (error) {
      console.error('Failed to load customers:', error);
    }
  };

  const loadProducts = async () => {
    try {
      const response = await productApi.getAll();
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.customerId === 0) {
      alert('请选择客户');
      return;
    }
    if (formData.items.some(item => item.productId === 0 || item.quantity <= 0)) {
      alert('请完整填写订单明细');
      return;
    }
    try {
      await orderApi.create(formData);
      alert('订单创建成功');
      setFormData({ customerId: 0, items: [{ productId: 0, quantity: 1 }] });
      setShowForm(false);
      loadOrders();
      loadProducts(); // Reload to update stock
    } catch (error: any) {
      console.error('Failed to create order:', error);
      alert(error.response?.data?.message || '创建订单失败');
    }
  };

  const handleCancel = async (orderId: number) => {
    if (!(await confirm('确定要取消这个订单吗？库存将会恢复。'))) return;
    try {
      await orderApi.cancel(orderId);
      alert('订单已取消');
      loadOrders();
      loadProducts(); // Reload to update stock
    } catch (error: any) {
      console.error('Failed to cancel order:', error);
      alert(error.response?.data?.message || '取消订单失败');
    }
  };

  const addOrderItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { productId: 0, quantity: 1 }],
    });
  };

  const removeOrderItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    });
  };

  const updateOrderItem = (index: number, field: keyof OrderItemCreate, value: number) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
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
      case 'New': return '新订单';
      case 'Completed': return '已完成';
      case 'Cancelled': return '已取消';
      default: return status;
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>订单管理</h1>

      {/* Create Order Button */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{ padding: '10px 20px', fontSize: '16px' }}
        >
          {showForm ? '取消创建' : '+ 创建订单'}
        </button>
      </div>

      {/* Create Order Form */}
      {showForm && (
        <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: '#f9f9f9' }}>
          <h2>新建订单</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '15px' }}>
              <label>
                选择客户：
                <select
                  value={formData.customerId}
                  onChange={(e) => setFormData({ ...formData, customerId: parseInt(e.target.value) })}
                  required
                  style={{ marginLeft: '10px', padding: '5px', width: '250px' }}
                >
                  <option value={0}>-- 请选择客户 --</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name} ({customer.email})
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <h3>订单明细</h3>
            {formData.items.map((item, index) => (
              <div key={index} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: 'white' }}>
                <label style={{ marginRight: '10px' }}>
                  产品：
                  <select
                    value={item.productId}
                    onChange={(e) => updateOrderItem(index, 'productId', parseInt(e.target.value))}
                    required
                    style={{ marginLeft: '10px', padding: '5px', width: '200px' }}
                  >
                    <option value={0}>-- 请选择产品 --</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} (库存: {product.currentStock})
                      </option>
                    ))}
                  </select>
                </label>
                <label style={{ marginRight: '10px' }}>
                  数量：
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateOrderItem(index, 'quantity', parseInt(e.target.value) || 0)}
                    required
                    style={{ marginLeft: '10px', padding: '5px', width: '80px' }}
                  />
                </label>
                {formData.items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeOrderItem(index)}
                    style={{ padding: '5px 10px', backgroundColor: '#ff4444', color: 'white', border: 'none', cursor: 'pointer' }}
                  >
                    删除
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addOrderItem}
              style={{ padding: '8px 16px', marginBottom: '15px' }}
            >
              + 添加产品
            </button>

            <div>
              <button type="submit" style={{ padding: '10px 20px', marginRight: '10px', fontSize: '16px' }}>
                创建订单
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                style={{ padding: '10px 20px', fontSize: '16px' }}
              >
                取消
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Order List */}
      <div>
        <h2>订单列表</h2>
        {loading ? (
          <p>加载中...</p>
        ) : (
          <div>
            {orders.map((order) => (
              <div
                key={order.id}
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
                    <strong>订单 #{order.id}</strong> - 客户: {order.customerName}
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
                    <strong>总金额：¥{order.totalAmount.toFixed(2)}</strong>
                  </div>
                </div>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
                  创建时间: {new Date(order.createdAt).toLocaleString('zh-CN')}
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '10px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f5f5f5' }}>
                      <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>产品</th>
                      <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right' }}>单价</th>
                      <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right' }}>数量</th>
                      <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right' }}>小计</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item) => (
                      <tr key={item.id}>
                        <td style={{ padding: '8px', border: '1px solid #ddd' }}>{item.productName}</td>
                        <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right' }}>
                          ¥{item.unitPrice.toFixed(2)}
                        </td>
                        <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right' }}>
                          {item.quantity}
                        </td>
                        <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right' }}>
                          ¥{item.lineTotal.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {order.status === 'New' && (
                  <button
                    onClick={() => handleCancel(order.id)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#ff9800',
                      color: 'white',
                      border: 'none',
                      cursor: 'pointer',
                      borderRadius: '3px',
                    }}
                  >
                    取消订单
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
