'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import toast from 'react-hot-toast';

export default function ReservationsPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [form, setForm] = useState({
    guest_name: '',
    guest_email: '',
    guest_phone: '',
    party_size: 2,
    date: '',
    time: '19:00',
    special_requests: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please sign in to make a reservation');
      router.push('/auth/login');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/reservations/create/', {
        ...form,
        party_size: Number(form.party_size),
      });
      setSubmitted(true);
      toast.success('Reservation submitted!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to create reservation');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <span className="text-7xl mb-6">🎉</span>
        <h1 className="text-3xl font-display font-bold mb-3">Reservation Received!</h1>
        <p className="text-sage-600 mb-2 max-w-md">
          We&apos;ll confirm your reservation for <strong>{form.party_size} guests</strong> on{' '}
          <strong>{form.date}</strong> at <strong>{form.time}</strong> shortly.
        </p>
        <p className="text-sage-500 text-sm mb-8">A confirmation email has been sent.</p>
        <button onClick={() => { setSubmitted(false); setForm({ guest_name: '', guest_email: '', guest_phone: '', party_size: 2, date: '', time: '19:00', special_requests: '' }); }} className="btn-secondary">
          Make Another Reservation
        </button>
      </div>
    );
  }

  // Build min date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-gradient-to-r from-sage-900 to-charcoal py-16">
        <div className="container-narrow text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">Reserve a Table</h1>
          <p className="text-sage-300 text-lg">Join us for an unforgettable dining experience</p>
        </div>
      </div>

      <div className="container-narrow py-12 max-w-2xl">
        <form onSubmit={handleSubmit} className="card p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-sage-700 mb-1.5">Full Name *</label>
              <input name="guest_name" value={form.guest_name} onChange={handleChange} required className="input-field" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-medium text-sage-700 mb-1.5">Email *</label>
              <input name="guest_email" type="email" value={form.guest_email} onChange={handleChange} required className="input-field" placeholder="john@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-sage-700 mb-1.5">Phone</label>
              <input name="guest_phone" value={form.guest_phone} onChange={handleChange} className="input-field" placeholder="(555) 123-4567" />
            </div>
            <div>
              <label className="block text-sm font-medium text-sage-700 mb-1.5">Party Size *</label>
              <select name="party_size" value={form.party_size} onChange={handleChange} required className="input-field">
                {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 20].map((n) => (
                  <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-sage-700 mb-1.5">Date *</label>
              <input name="date" type="date" value={form.date} onChange={handleChange} min={minDate} required className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-sage-700 mb-1.5">Time *</label>
              <select name="time" value={form.time} onChange={handleChange} required className="input-field">
                {['11:30', '12:00', '12:30', '13:00', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-sage-700 mb-1.5">Special Requests</label>
            <textarea name="special_requests" value={form.special_requests} onChange={handleChange} className="input-field h-24 resize-none" placeholder="Allergies, celebrations, seating preferences..." />
          </div>

          <button type="submit" disabled={submitting} className="btn-primary w-full text-lg py-4">
            {submitting ? 'Submitting...' : 'Reserve Table'}
          </button>
        </form>
      </div>
    </div>
  );
}
