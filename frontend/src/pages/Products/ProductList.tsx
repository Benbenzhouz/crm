import type { Product } from '../../types';
import ProductRow from './ProductRow';

interface ProductListProps {
  products: Product[];
  loading: boolean;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

export default function ProductList({ products, loading, onEdit, onDelete }: ProductListProps) {
  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>Product List</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f0f0f0' }}>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>ID</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Product Name</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>SKU</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Unit Price</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Stock</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Created At</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <ProductRow
              key={product.id}
              product={product}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
