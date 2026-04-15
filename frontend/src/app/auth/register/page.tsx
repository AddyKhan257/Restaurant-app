'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', username: '', first_name: '', last_name: '', phone: '', password: '', password_confirm: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.password_confirm) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await api.register(form);
      toast.success('Account created! Please sign in.');
      router.push('/auth/login');
    } catch (err: any) {
      const msg = err.data ? Object.values(err.data).flat().join(', ') : 'Registration failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="card p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold">Create Account</h1>
          <p className="text-sage-600 mt-2">Join Savoria for the best dining experience</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-sage-700 mb-1">First Name</label>
              <input name="first_name" value={form.first_name} onChange={handleChange} required className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-sage-700 mb-1">Last Name</label>
              <input name="last_name" value={form.last_name} onChange={handleChange} required className="input-field" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-sage-700 mb-1">Username</label>
            <input name="username" value={form.username} onChange={handleChange} required className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-sage-700 mb-1">Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} required className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-sage-700 mb-1">Phone</label>
            <input name="phone" value={form.phone} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-sage-700 mb-1">Password</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} required className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-sage-700 mb-1">Confirm Password</label>
            <input name="password_confirm" type="password" value={form.password_confirm} onChange={handleChange} required className="input-field" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-sage-600 mt-6">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-brand-600 font-medium hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
