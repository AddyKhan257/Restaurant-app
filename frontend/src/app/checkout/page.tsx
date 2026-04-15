'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore, useAuthStore } from '@/lib/store';
import { api } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCartStore();
  const user = useAuthStore((s) => s.user);
  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [tip, setTip] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const tax = subtotal() * 0.08;
  const deliveryFee = orderType === 'delivery' ? (subtotal() > 50 ? 0 : 5.99) : 0;
  const total = subtotal() + tax + deliveryFee + tip;

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <p className="text-sage-600 mb-4">Your cart is empty</p>
        <Link href="/menu" className="btn-primary">Browse Menu</Link>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!user) {
      toast.error('Please sign in to place an order');
      router.push('/auth/login');
      return;
    }
    if (orderType === 'delivery' && !address.trim()) {
      toast.error('Please enter a delivery address');
      return;
    }

    setSubmitting(true);
    try {
      const orderItems = items.map((item) => ({
        menu_item: item.menuItem.id,
        name: item.menuItem.name,
        price: item.menuItem.price,
        quantity: item.quantity,
        modifiers: item.modifiers.map((m) => ({ name: m.name, price: m.price })),
        special_instructions: item.specialInstructions,
      }));

      await api.post('/orders/create/', {
        order_type: orderType,
        delivery_address: address,
        delivery_notes: notes,
        tip,
        payment_method: 'card',
        items: orderItems,
      });

      clearCart();
      toast.success('Order placed successfully!');
      router.push('/orders');
    } catch (err: any) {
      toast.error(err.message || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream py-10">
      <div className="container-narrow max-w-3xl">
        <h1 className="text-3xl font-display font-bold mb-8">Checkout</h1>

        {/* Order type */}
        <div className="card p-6 mb-6">
          <h2 className="font-display font-semibold text-lg mb-4">Order Type</h2>
          <div className="flex gap-3">
            {(['delivery', 'pickup'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setOrderType(type)}
                className={`flex-1 py-3 rounded-lg font-medium transition-colors border-2 ${
                  orderType === type
                    ? 'border-brand-600 bg-brand-50 text-brand-700'
                    : 'border-sage-200 text-sage-600 hover:border-sage-300'
                }`}
              >
                {type === 'delivery' ? '🚗 Delivery' : '🏪 Pickup'}
              </button>
            ))}
          </div>
        </div>

        {/* Delivery address */}
        {orderType === 'delivery' && (
          <div className="card p-6 mb-6">
            <h2 className="font-display font-semibold text-lg mb-4">Delivery Address</h2>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your full delivery address..."
              className="input-field h-24 resize-none"
              required
            />
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Delivery notes (optional)"
              className="input-field h-16 resize-none mt-3"
            />
          </div>
        )}

        {/* Tip */}
        <div className="card p-6 mb-6">
          <h2 className="font-display font-semibold text-lg mb-4">Add a Tip</h2>
          <div className="flex gap-2">
            {[0, 3, 5, 8, 10].map((amount) => (
              <button
                key={amount}
                onClick={() => setTip(amount)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  tip === amount
                    ? 'bg-brand-600 text-white'
                    : 'bg-sage-100 text-sage-700 hover:bg-sage-200'
                }`}
              >
                {amount === 0 ? 'No Tip' : `$${amount}`}
              </button>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="card p-6 mb-6">
          <h2 className="font-display font-semibold text-lg mb-4">Order Summary</h2>
          <div className="space-y-2 text-sm">
            {items.map((item) => (
              <div key={item.menuItem.id} className="flex justify-between">
                <span className="text-sage-700">{item.quantity}x {item.menuItem.name}</span>
                <span>{formatPrice(Number(item.menuItem.price) * item.quantity)}</span>
              </div>
            ))}
            <hr className="border-sage-200 my-3" />
            <div className="flex justify-between"><span className="text-sage-600">Subtotal</span><span>{formatPrice(subtotal())}</span></div>
            <div className="flex justify-between"><span className="text-sage-600">Tax</span><span>{formatPrice(tax)}</span></div>
            {orderType === 'delivery' && (
              <div className="flex justify-between"><span className="text-sage-600">Delivery</span><span>{deliveryFee ? formatPrice(deliveryFee) : 'Free'}</span></div>
            )}
            {tip > 0 && <div className="flex justify-between"><span className="text-sage-600">Tip</span><span>{formatPrice(tip)}</span></div>}
            <hr className="border-sage-200 my-3" />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-brand-600">{formatPrice(total)}</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="btn-primary w-full text-lg py-4"
        >
          {submitting ? 'Placing Order...' : `Place Order — ${formatPrice(total)}`}
        </button>
      </div>
    </div>
  );
}
