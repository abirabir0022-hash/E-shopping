'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { cart, subtotal, clearCart } = useCart();
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    division: 'Dhaka',
    district: 'Dhaka',
    area: '',
    note: ''
  });

  const [loading, setLoading] = useState(false);
  const deliveryCharge = formData.division === 'Dhaka' ? 60 : 120;
  const grandTotal = subtotal + deliveryCharge;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return alert('Your cart is empty');
    setLoading(true);

    try {
      const orderNumber = `ORD-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

      const { data: order, error: orderErr } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          customer_name: formData.fullName,
          customer_phone: formData.phone,
          customer_email: formData.email,
          shipping_address: formData.address,
          division: formData.division,
          district: formData.district,
          area: formData.area,
          delivery_note: formData.note,
          subtotal,
          delivery_charge: deliveryCharge,
          total_amount: grandTotal,
          payment_method: 'COD',
          order_status: 'Pending'
        })
        .select()
        .single();

      if (orderErr) throw orderErr;

      const itemsToInsert = cart.map((i) => ({
        order_id: order.id,
        product_id: i.product.id,
        product_title: i.product.title,
        unit_price: i.product.price,
        quantity: i.quantity,
        selected_size: i.selectedSize || null,
        selected_color: i.selectedColor || null,
        subtotal: i.product.price * i.quantity
      }));

      const { error: itemsErr } = await supabase.from('order_items').insert(itemsToInsert);
      if (itemsErr) throw itemsErr;

      clearCart();
      router.push(`/order-success?orderId=${order.order_number}`);
    } catch (err: any) {
      alert(`Order Placement Failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>
      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-gray-800 mb-2">Shipping Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Full Name *</label>
              <input
                required
                type="text"
                className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Phone Number *</label>
              <input
                required
                type="tel"
                placeholder="017XXXXXXXX"
                className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Full Address *</label>
            <textarea
              required
              rows={2}
              placeholder="House #, Road #, Area Details"
              className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Division *</label>
              <select
                className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                value={formData.division}
                onChange={(e) => setFormData({ ...formData, division: e.target.value })}
              >
                <option value="Dhaka">Dhaka</option>
                <option value="Chittagong">Chittagong</option>
                <option value="Rajshahi">Rajshahi</option>
                <option value="Khulna">Khulna</option>
                <option value="Barisal">Barisal</option>
                <option value="Sylhet">Sylhet</option>
                <option value="Rangpur">Rangpur</option>
                <option value="Mymensingh">Mymensingh</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">District *</label>
              <input
                required
                type="text"
                className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Area / Thana *</label>
              <input
                required
                type="text"
                className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              />
            </div>
          </div>
          <div className="pt-4 border-t">
            <h2 className="text-lg font-bold text-gray-800 mb-2">Payment Method</h2>
            <div className="p-4 border border-emerald-500 bg-emerald-50/50 rounded-lg flex items-center justify-between">
              <div>
                <div className="font-bold text-gray-900 text-sm">Cash on Delivery (COD)</div>
                <div className="text-xs text-gray-500">Pay inside Bangladesh upon receiving order</div>
              </div>
              <span className="text-xs font-semibold bg-emerald-600 text-white px-2.5 py-1 rounded">Active</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h2>
            <div className="divide-y max-h-80 overflow-y-auto mb-4">
              {cart.map((item, idx) => (
                <div key={idx} className="py-3 flex justify-between items-center text-sm">
                  <div>
                    <div className="font-medium text-gray-900">{item.product.title}</div>
                    <div className="text-xs text-gray-500">Qty: {item.quantity} {item.selectedSize ? `| Size: ${item.selectedSize}` : ''}</div>
                  </div>
                  <div className="font-semibold text-gray-800">৳{item.product.price * item.quantity}</div>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>৳{subtotal}</span></div>
              <div className="flex justify-between text-gray-600"><span>Delivery Charge</span><span>৳{deliveryCharge}</span></div>
              <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
                <span>Grand Total</span>
                <span className="text-emerald-600">৳{grandTotal}</span>
              </div>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition-colors shadow-lg shadow-emerald-600/20 disabled:bg-gray-400"
          >
            {loading ? 'Processing Order...' : 'Confirm Order (Cash on Delivery)'}
          </button>
        </div>
      </form>
    </div>
  );
}
