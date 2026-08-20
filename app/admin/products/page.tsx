'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Product } from '@/types/database';
import { Plus, Trash2, Edit2, Upload } from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    title: '',
    price: '',
    sku: '',
    stock_quantity: '',
    brand: 'Generic',
    description: '',
    imageUrl: ''
  });

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*, images:product_images(*)')
      .order('created_at', { ascending: false });

    if (!error && data) setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const { data: prod, error: pErr } = await supabase
      .from('products')
      .insert({
        title: form.title,
        slug,
        price: parseFloat(form.price),
        sku: form.sku,
        stock_quantity: parseInt(form.stock_quantity),
        brand: form.brand,
        description: form.description,
        is_active: true
      })
      .select()
      .single();

    if (pErr) return alert(pErr.message);

    if (form.imageUrl && prod) {
      await supabase.from('product_images').insert({
        product_id: prod.id,
        image_url: form.imageUrl,
        is_primary: true
      });
    }

    setShowModal(false);
    fetchProducts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    await supabase.from('products').delete().eq('id', id);
    fetchProducts();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products Catalog</h1>
          <p className="text-sm text-gray-500">Manage catalog inventory, pricing, and statuses</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-lg hover:bg-emerald-700 transition-colors font-medium text-sm"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase border-b">
              <th className="p-4">Product</th>
              <th className="p-4">SKU</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y text-sm">
            {loading ? (
              <tr><td colSpan={5} className="p-4 text-center text-gray-500">Loading catalog...</td></tr>
            ) : products.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 font-medium text-gray-900">{p.title}</td>
                <td className="p-4 text-gray-500">{p.sku}</td>
                <td className="p-4 font-semibold text-gray-900">৳{p.price}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${p.stock_quantity > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                    {p.stock_quantity} in stock
                  </span>
                </td>
                <td className="p-4 flex gap-2">
                  <button onClick={() => handleDelete(p.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-md">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">Add New Product</h2>
            <form onSubmit={handleCreateProduct} className="space-y-3">
              <input required placeholder="Product Title" className="w-full border p-2 rounded text-sm" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} />
              <div className="grid grid-cols-2 gap-2">
                <input required placeholder="Price (BDT)" type="number" className="w-full border p-2 rounded text-sm" value={form.price} onChange={(e) => setForm({...form, price: e.target.value})} />
                <input required placeholder="Stock Qty" type="number" className="w-full border p-2 rounded text-sm" value={form.stock_quantity} onChange={(e) => setForm({...form, stock_quantity: e.target.value})} />
              </div>
              <input required placeholder="Unique SKU" className="w-full border p-2 rounded text-sm" value={form.sku} onChange={(e) => setForm({...form, sku: e.target.value})} />
              <input placeholder="Image Direct URL" className="w-full border p-2 rounded text-sm" value={form.imageUrl} onChange={(e) => setForm({...form, imageUrl: e.target.value})} />
              <textarea placeholder="Description" className="w-full border p-2 rounded text-sm" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} />
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded text-sm">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded text-sm font-semibold">Publish Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
