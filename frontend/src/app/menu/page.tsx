'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { formatPrice, DIETARY_ICONS, SPICE_LABELS } from '@/lib/utils';
import { useCartStore } from '@/lib/store';
import type { Category, MenuItem } from '@/types';
import toast from 'react-hot-toast';

export default function MenuPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [dietary, setDietary] = useState('');
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    Promise.all([
      api.get<Category[]>('/menu/categories/'),
      api.get<{ results: MenuItem[] }>('/menu/items/?page_size=100'),
    ]).then(([cats, itemsRes]) => {
      setCategories(cats);
      setItems(itemsRes.results || itemsRes as any);
    }).catch(() => {
      // Use empty state if API not available
    }).finally(() => setLoading(false));
  }, []);

  const filtered = items.filter((item) => {
    if (activeCategory !== 'all' && item.category_name !== activeCategory) return false;
    if (search && !item.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (dietary && !item.dietary_tags.includes(dietary)) return false;
    return true;
  });

  const handleAddToCart = (item: MenuItem) => {
    addItem(item);
    toast.success(`${item.name} added to cart`);
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-gradient-to-r from-sage-900 to-charcoal py-16">
        <div className="container-narrow text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Our Menu
          </h1>
          <p className="text-sage-300 text-lg max-w-xl mx-auto">
            Handcrafted dishes made with the finest seasonal ingredients
          </p>
        </div>
      </div>

      <div className="container-narrow py-10">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <input
            type="text"
            placeholder="Search dishes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field md:max-w-xs"
          />
          <select
            value={dietary}
            onChange={(e) => setDietary(e.target.value)}
            className="input-field md:max-w-[200px]"
          >
            <option value="">All Dietary</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="vegan">Vegan</option>
            <option value="gluten_free">Gluten Free</option>
            <option value="halal">Halal</option>
          </select>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeCategory === 'all'
                ? 'bg-brand-600 text-white'
                : 'bg-sage-100 text-sage-700 hover:bg-sage-200'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.name)}
              className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat.name
                  ? 'bg-brand-600 text-white'
                  : 'bg-sage-100 text-sage-700 hover:bg-sage-200'
              }`}
            >
              {cat.name} ({cat.item_count})
            </button>
          ))}
        </div>

        {/* Items grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-48 bg-sage-100" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-sage-100 rounded w-2/3" />
                  <div className="h-4 bg-sage-100 rounded w-full" />
                  <div className="h-4 bg-sage-100 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <div key={item.id} className="card group">
                {/* Image placeholder */}
                <div className="h-48 bg-gradient-to-br from-sage-100 to-sage-200 flex items-center justify-center relative overflow-hidden">
                  <span className="text-6xl opacity-50">🍽️</span>
                  {item.is_best_seller && (
                    <span className="absolute top-3 left-3 badge bg-brand-600 text-white">Best Seller</span>
                  )}
                  {item.is_featured && (
                    <span className="absolute top-3 right-3 badge bg-sage-800 text-white">Featured</span>
                  )}
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-display font-semibold text-charcoal group-hover:text-brand-600 transition-colors">
                      {item.name}
                    </h3>
                    <span className="text-lg font-bold text-brand-600 whitespace-nowrap ml-3">
                      {formatPrice(item.price)}
                    </span>
                  </div>

                  <p className="text-sage-600 text-sm mb-3 line-clamp-2">{item.description}</p>

                  {/* Tags & info */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {item.dietary_tags.map((tag) => (
                      <span key={tag} className="badge bg-sage-100 text-sage-700 text-xs">
                        {DIETARY_ICONS[tag] || ''} {tag.replace('_', ' ')}
                      </span>
                    ))}
                    {item.spice_level > 0 && (
                      <span className="badge bg-red-50 text-red-700 text-xs">
                        {SPICE_LABELS[item.spice_level]}
                      </span>
                    )}
                    {item.calories && (
                      <span className="badge bg-sage-50 text-sage-600 text-xs">
                        {item.calories} cal
                      </span>
                    )}
                  </div>

                  {/* Rating & Add */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm text-sage-500">
                      <span className="text-yellow-500">★</span>
                      <span>{item.average_rating > 0 ? item.average_rating : '—'}</span>
                      <span className="mx-1">·</span>
                      <span>{item.prep_time_minutes} min</span>
                    </div>
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="btn-primary text-sm py-2 px-4"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20 text-sage-500">
            <span className="text-5xl block mb-4">🍽️</span>
            <p className="text-lg">No items found. Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
