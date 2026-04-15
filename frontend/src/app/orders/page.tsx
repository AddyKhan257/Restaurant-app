'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { formatPrice, formatDate, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/utils';
import type { Order } from '@/types';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ results: Order[] }>('/orders/')
      .then((data) => setOrders(data.results || (data as any)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream py-10">
        <div className="container-narrow max-w-3xl space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="h-5 bg-sage-100 rounded w-1/3 mb-3" />
              <div className="h-4 bg-sage-100 rounded w-1/2 mb-2" />
              <div className="h-4 bg-sage-100 rounded w-1/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-10">
      <div className="container-narrow max-w-3xl">
        <h1 className="text-3xl font-display font-bold mb-8">Your Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-6xl block mb-4">📦</span>
            <p className="text-sage-600 mb-6">No orders yet</p>
            <Link href="/menu" className="btn-primary">Browse Menu</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="card p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-charcoal">{order.order_number}</h3>
                    <p className="text-sm text-sage-500">{formatDate(order.created_at)}</p>
                  </div>
                  <span className={`badge ${ORDER_STATUS_COLORS[order.status]}`}>
                    {ORDER_STATUS_LABELS[order.status]}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-sage-600">
                    <span className="capitalize">{order.order_type.replace('_', ' ')}</span>
                    {' · '}
                    <span>{(order as any).item_count || '—'} items</span>
                  </div>
                  <span className="font-bold text-brand-600">{formatPrice(order.total)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
