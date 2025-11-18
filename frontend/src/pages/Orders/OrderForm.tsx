import type { OrderCreate, OrderItemCreate, Customer, Product } from '../../types';

interface OrderFormProps {
  formData: OrderCreate;
  customers: Customer[];
  products: Product[];
  onFormDataChange: (data: OrderCreate) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export default function OrderForm({ formData, customers, products, onFormDataChange, onSubmit, onCancel }: OrderFormProps) {
  const addOrderItem = () => {
    onFormDataChange({
      ...formData,
      items: [...formData.items, { productId: 0, quantity: 1 }],
    });
  };

  const removeOrderItem = (index: number) => {
    onFormDataChange({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    });
  };

  const updateOrderItem = (index: number, field: keyof OrderItemCreate, value: number) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    onFormDataChange({ ...formData, items: newItems });
  };

  return (
    <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: '#f9f9f9' }}>
      <h2>Create New Order</h2>
      <form onSubmit={onSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>
            Select Customer:
            <select
              value={formData.customerId}
              onChange={(e) => onFormDataChange({ ...formData, customerId: parseInt(e.target.value) })}
              required
              style={{ marginLeft: '10px', padding: '5px', width: '250px' }}
            >
              <option value={0}>-- Please select a customer --</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} ({customer.email})
                </option>
              ))}
            </select>
          </label>
        </div>

        <h3>Order Items</h3>
        {formData.items.map((item, index) => (
          <div key={index} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: 'white' }}>
            <label style={{ marginRight: '10px' }}>
              Product:
              <select
                value={item.productId}
                onChange={(e) => updateOrderItem(index, 'productId', parseInt(e.target.value))}
                required
                style={{ marginLeft: '10px', padding: '5px', width: '200px' }}
              >
                <option value={0}>-- Please select a product --</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} (Stock: {product.currentStock})
                  </option>
                ))}
              </select>
            </label>
            <label style={{ marginRight: '10px' }}>
              Quantity:
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
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addOrderItem}
          style={{ padding: '8px 16px', marginBottom: '15px' }}
        >
          + Add Product
        </button>

        <div>
          <button type="submit" style={{ padding: '10px 20px', marginRight: '10px', fontSize: '16px' }}>
            Create Order
          </button>
          <button
            type="button"
            onClick={onCancel}
            style={{ padding: '10px 20px', fontSize: '16px' }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
