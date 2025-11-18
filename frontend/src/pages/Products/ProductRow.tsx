import type { Product } from '../../types';

interface ProductRowProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

export default function ProductRow({ product, onEdit, onDelete }: ProductRowProps) {
  return (
    <tr>
      <td style={{ padding: '10px', border: '1px solid #ddd' }}>{product.id}</td>
      <td style={{ padding: '10px', border: '1px solid #ddd' }}>{product.name}</td>
      <td style={{ padding: '10px', border: '1px solid #ddd' }}>{product.sku || '-'}</td>
      <td style={{ padding: '10px', border: '1px solid #ddd' }}>${product.unitPrice?.toFixed(2) || '0.00'}</td>
      <td style={{ padding: '10px', border: '1px solid #ddd' }}>{product.currentStock ?? 0}</td>
      <td style={{ padding: '10px', border: '1px solid #ddd' }}>
        {new Date(product.createdAt).toLocaleString('en-US')}
      </td>
      <td style={{ padding: '10px', border: '1px solid #ddd' }}>
        <button
          onClick={() => onEdit(product)}
          style={{ padding: '4px 8px', marginRight: '5px' }}
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(product.id)}
          style={{ padding: '4px 8px', backgroundColor: '#ff4444', color: 'white', border: 'none', cursor: 'pointer' }}
        >
          Delete
        </button>
      </td>
    </tr>
  );
}
