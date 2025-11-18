import type { Product, ProductCreate } from '../../types';

interface ProductFormProps {
  product: Product | null;
  formData: ProductCreate;
  onFormDataChange: (data: ProductCreate) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export default function ProductForm({ product, formData, onFormDataChange, onSubmit, onCancel }: ProductFormProps) {
  return (
    <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '4px' }}>
      <h2>{product ? 'Edit Product' : 'Add New Product'}</h2>
      <form onSubmit={onSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>
            Product Name:
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
            SKU:
            <input
              type="text"
              value={formData.sku}
              onChange={(e) => onFormDataChange({ ...formData, sku: e.target.value })}
              required
              style={{ marginLeft: '10px', padding: '5px', width: '200px' }}
            />
          </label>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>
            Unit Price:
            <input
              type="number"
              step="0.01"
              value={formData.unitPrice}
              onChange={(e) => onFormDataChange({ ...formData, unitPrice: parseFloat(e.target.value) || 0 })}
              required
              style={{ marginLeft: '10px', padding: '5px', width: '200px' }}
            />
          </label>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>
            Stock:
            <input
              type="number"
              value={formData.currentStock}
              onChange={(e) => onFormDataChange({ ...formData, currentStock: parseInt(e.target.value) || 0 })}
              required
              style={{ marginLeft: '10px', padding: '5px', width: '200px' }}
            />
          </label>
        </div>
        <div>
          <button type="submit" style={{ padding: '8px 16px', marginRight: '10px' }}>
            {product ? 'Update' : 'Create'}
          </button>
          {product && (
            <button type="button" onClick={onCancel} style={{ padding: '8px 16px' }}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
