import { useState, useEffect } from 'react';
import { productApi } from '../../api';
import type { Product, ProductCreate } from '../../types';

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductCreate>({
    name: '',
    sku: '',
    unitPrice: 0,
    currentStock: 0,
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productApi.getAll();
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to load products:', error);
      alert('加载产品列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await productApi.update(editing.id, formData);
        alert('产品更新成功');
      } else {
        await productApi.create(formData);
        alert('产品创建成功');
      }
      setFormData({ name: '', sku: '', unitPrice: 0, currentStock: 0 });
      setEditing(null);
      loadProducts();
    } catch (error) {
      console.error('Failed to save product:', error);
      alert('保存产品失败');
    }
  };

  const handleEdit = (product: Product) => {
    setEditing(product);
    setFormData({
      name: product.name,
      sku: product.sku,
      unitPrice: product.unitPrice,
      currentStock: product.currentStock,
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这个产品吗？')) return;
    try {
      await productApi.delete(id);
      alert('产品删除成功');
      loadProducts();
    } catch (error) {
      console.error('Failed to delete product:', error);
      alert('删除产品失败');
    }
  };

  const handleCancel = () => {
    setEditing(null);
    setFormData({ name: '', sku: '', unitPrice: 0, currentStock: 0 });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>产品管理</h1>

      {/* Create/Edit Form */}
      <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '4px' }}>
        <h2>{editing ? '编辑产品' : '新增产品'}</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '10px' }}>
            <label>
              产品名称：
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                style={{ marginLeft: '10px', padding: '5px', width: '200px' }}
              />
            </label>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>
              SKU：
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                required
                style={{ marginLeft: '10px', padding: '5px', width: '200px' }}
              />
            </label>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>
              单价：
              <input
                type="number"
                step="0.01"
                value={formData.unitPrice}
                onChange={(e) => setFormData({ ...formData, unitPrice: parseFloat(e.target.value) || 0 })}
                required
                style={{ marginLeft: '10px', padding: '5px', width: '200px' }}
              />
            </label>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>
              库存：
              <input
                type="number"
                value={formData.currentStock}
                onChange={(e) => setFormData({ ...formData, currentStock: parseInt(e.target.value) || 0 })}
                required
                style={{ marginLeft: '10px', padding: '5px', width: '200px' }}
              />
            </label>
          </div>
          <div>
            <button type="submit" style={{ padding: '8px 16px', marginRight: '10px' }}>
              {editing ? '更新' : '创建'}
            </button>
            {editing && (
              <button type="button" onClick={handleCancel} style={{ padding: '8px 16px' }}>
                取消
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Product List Table */}
      <div>
        <h2>产品列表</h2>
        {loading ? (
          <p>加载中...</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f0f0f0' }}>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>ID</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>产品名称</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>SKU</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>单价</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>库存</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>创建时间</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{product.id}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{product.name}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{product.sku}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>¥{product.unitPrice.toFixed(2)}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{product.currentStock}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    {new Date(product.createdAt).toLocaleString('zh-CN')}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    <button
                      onClick={() => handleEdit(product)}
                      style={{ padding: '4px 8px', marginRight: '5px' }}
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      style={{ padding: '4px 8px', backgroundColor: '#ff4444', color: 'white', border: 'none', cursor: 'pointer' }}
                    >
                      删除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
