'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import type { DashboardData } from '@/types';

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<DashboardData>('/analytics/dashboard/')
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream py-10">
        <div className="container-narrow">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card p-6 animate-pulse">
                <div className="h-4 bg-sage-100 rounded w-1/2 mb-3" />
                <div className="h-8 bg-sage-100 rounded w-2/3" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-sage-600 mb-4">Unable to load dashboard. Staff access required.</p>
        </div>
      </div>
    );
  }

  const statCards = [
    { label: 'Revenue (30d)', value: formatPrice(data.revenue.last_30_days), icon: '💰', color: 'bg-green-50 text-green-700' },
    { label: 'Orders Today', value: data.orders.today, icon: '📦', color: 'bg-blue-50 text-blue-700' },
    { label: 'Pending Orders', value: data.orders.pending, icon: '⏳', color: 'bg-yellow-50 text-yellow-700' },
    { label: 'Upcoming Reservations', value: data.reservations.upcoming, icon: '📅', color: 'bg-purple-50 text-purple-700' },
  ];

  return (
    <div className="min-h-screen bg-cream py-10">
      <div className="container-narrow">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-display font-bold">Dashboard</h1>
          <span className="text-sm text-sage-500">Average Rating: ⭐ {data.average_rating}/5</span>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {statCards.map((card) => (
            <div key={card.label} className="card p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-sage-600">{card.label}</span>
                <span className="text-2xl">{card.icon}</span>
              </div>
              <p className="text-3xl font-bold text-charcoal">{card.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Daily Revenue Chart (simple text-based) */}
          <div className="card p-6">
            <h2 className="text-lg font-display font-semibold mb-4">Revenue (Last 30 Days)</h2>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {data.daily_revenue.length > 0 ? data.daily_revenue.map((day) => (
                <div key={day.date} className="flex items-center gap-3">
                  <span className="text-xs text-sage-500 w-20 flex-shrink-0">{day.date.slice(5)}</span>
                  <div className="flex-1 bg-sage-100 rounded-full h-4 overflow-hidden">
                    <div
                      className="h-full bg-brand-500 rounded-full transition-all"
                      style={{
                        width: `${Math.min((day.revenue / Math.max(...data.daily_revenue.map((d) => d.revenue), 1)) * 100, 100)}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs font-medium w-16 text-right">{formatPrice(day.revenue)}</span>
                </div>
              )) : (
                <p className="text-sage-500 text-sm">No revenue data yet</p>
              )}
            </div>
          </div>

          {/* Popular Items */}
          <div className="card p-6">
            <h2 className="text-lg font-display font-semibold mb-4">Top Items (30 Days)</h2>
            <div className="space-y-3">
              {data.popular_items.length > 0 ? data.popular_items.map((item, i) => (
                <div key={item.name} className="flex items-center gap-3">
                  <span className="text-sm font-bold text-sage-400 w-6">{i + 1}</span>
                  <span className="flex-1 text-sm font-medium text-charcoal">{item.name}</span>
                  <span className="badge bg-sage-100 text-sage-700">{item.total_ordered} sold</span>
                </div>
              )) : (
                <p className="text-sage-500 text-sm">No order data yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Quick summary */}
        <div className="card p-6 mt-8">
          <h2 className="text-lg font-display font-semibold mb-4">Quick Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-2xl font-bold text-charcoal">{formatPrice(data.revenue.total)}</p>
              <p className="text-sm text-sage-500">Total Revenue</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-charcoal">{data.orders.last_7_days}</p>
              <p className="text-sm text-sage-500">Orders (7d)</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-charcoal">{data.reservations.today}</p>
              <p className="text-sm text-sage-500">Reservations Today</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-charcoal">⭐ {data.average_rating}</p>
              <p className="text-sm text-sage-500">Avg Rating</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
