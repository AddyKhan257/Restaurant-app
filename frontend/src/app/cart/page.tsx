'use client';

import Link from 'next/link';
import { useCartStore } from '@/lib/store';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, subtotal } = useCartStore();
  const tax = subtotal() * 0.08;
  const deliveryFee = subtotal() > 50 ? 0 : 5.99;
  const total = subtotal() + tax + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <span className="text-7xl mb-6">🛒</span>
        <h1 className="text-3xl font-display font-bold mb-3">Your Cart is Empty</h1>
        <p className="text-sage-600 mb-8 max-w-md">
          Looks like you haven&apos;t added anything yet. Explore our menu and find something you love.
        </p>
        <Link href="/menu" className="btn-primary">Browse Menu</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-10">
      <div className="container-narrow">
        <h1 className="text-3xl font-display font-bold mb-8">Your Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.menuItem.id} className="card p-5 flex gap-4">
                <div className="w-20 h-20 rounded-lg bg-sage-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-3xl">🍽️</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-charcoal">{item.menuItem.name}</h3>
                      <p className="text-sm text-sage-600">{formatPrice(item.menuItem.price)} each</p>
                      {item.modifiers.length > 0 && (
                        <p className="text-xs text-sage-500 mt-1">
                          + {item.modifiers.map((m) => m.name).join(', ')}
                        </p>
                      )}
                    </div>
                    <p className="font-bold text-brand-600 whitespace-nowrap">
                      {formatPrice(Number(item.menuItem.price) * item.quantity)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full border border-sage-300 flex items-center justify-center hover:bg-sage-100 transition-colors"
                      >
                        −
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full border border-sage-300 flex items-center justify-center hover:bg-sage-100 transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.menuItem.id)}
                      className="text-sm text-red-500 hover:text-red-700 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <button onClick={clearCart} className="text-sm text-red-500 hover:underline mt-2">
              Clear Cart
            </button>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="text-xl font-display font-semibold mb-5">Order Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-sage-600">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal())}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sage-600">Tax (8%)</span>
                  <span className="font-medium">{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sage-600">Delivery Fee</span>
                  <span className="font-medium">
                    {deliveryFee === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      formatPrice(deliveryFee)
                    )}
                  </span>
                </div>
                {subtotal() < 50 && (
                  <p className="text-xs text-sage-500">Free delivery on orders over $50</p>
                )}
                <hr className="border-sage-200" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-brand-600">{formatPrice(total)}</span>
                </div>
              </div>

              <Link href="/checkout" className="btn-primary w-full mt-6 text-center">
                Proceed to Checkout
              </Link>
              <Link href="/menu" className="btn-ghost w-full mt-2 text-center text-sm">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
