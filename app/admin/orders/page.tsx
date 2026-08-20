'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Order } from '@/types/database';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    await supabase.from('orders').update({ order_status: newStatus }).eq('id', orderId);
    fetchOrders();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Order Fulfillment Center</h1>
      <p className="text-sm text-gray-500 mb-6">Track and process regional orders</p>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase border-b">
              <th className="p-4">Order ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Location</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y text-sm">
            {loading ? (
              <tr><td colSpan={6} className="p-4 text-center text-gray-500">Loading orders...</td></tr>
            ) : orders.map((o) => (
              <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 font-bold text-gray-900">{o.order_number}</td>
                <td className="p-4">{o.customer_name}</td>
                <td className="p-4 font-mono text-xs">{o.customer_phone}</td>
                <td className="p-4 text-gray-600">{o.district}, {o.division}</td>
                <td className="p-4 font-semibold text-gray-900">৳{o.total_amount}</td>
                <td className="p-4">
                  <select
                    value={o.order_status}
                    onChange={(e) => handleStatusChange(o.id, e.target.value)}
                    className="border rounded px-2.5 py-1 text-xs font-semibold bg-gray-50 outline-none"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Returned">Returned</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
