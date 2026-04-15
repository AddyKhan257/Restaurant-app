'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCartStore, useAuthStore } from '@/lib/store';

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const itemCount = useCartStore((s) => s.itemCount());
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const links = [
    { href: '/menu', label: 'Menu' },
    { href: '/reservations', label: 'Reservations' },
    { href: '/orders', label: 'Orders' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-cream/90 backdrop-blur-md border-b border-sage-100">
      <nav className="container-narrow flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl md:text-3xl font-display font-bold text-charcoal tracking-tight">
            Savoria
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sage-700 font-medium hover:text-brand-600 transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <Link
            href="/cart"
            className="relative p-2 hover:bg-sage-100 rounded-full transition-colors"
          >
            <svg className="w-6 h-6 text-charcoal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {itemCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="hidden md:flex items-center gap-3">
              <span className="text-sm text-sage-600">Hi, {user.first_name}</span>
              {user.role !== 'customer' && (
                <Link href="/admin" className="btn-ghost text-sm">Dashboard</Link>
              )}
              <button onClick={logout} className="btn-ghost text-sm text-red-600">Logout</button>
            </div>
          ) : (
            <Link href="/auth/login" className="hidden md:inline-flex btn-primary text-sm py-2 px-4">
              Sign In
            </Link>
          )}

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-cream border-t border-sage-100 animate-fade-in">
          <div className="container-narrow py-4 flex flex-col gap-3">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="py-2 text-sage-700 font-medium"
                onClick={() => setMobileOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            {user ? (
              <button onClick={() => { logout(); setMobileOpen(false); }} className="py-2 text-red-600 text-left font-medium">
                Logout
              </button>
            ) : (
              <Link href="/auth/login" className="btn-primary text-center" onClick={() => setMobileOpen(false)}>
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
