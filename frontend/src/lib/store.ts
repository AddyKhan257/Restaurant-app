import { create } from 'zustand';
import type { CartItem, MenuItem, Modifier, User } from '@/types';
import { api } from '@/lib/api';

// ── Cart Store ──────────────────────────────────────────────
interface CartStore {
  items: CartItem[];
  addItem: (menuItem: MenuItem, quantity?: number, modifiers?: Modifier[], instructions?: string) => void;
  removeItem: (menuItemId: number) => void;
  updateQuantity: (menuItemId: number, quantity: number) => void;
  clearCart: () => void;
  subtotal: () => number;
  itemCount: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],

  addItem: (menuItem, quantity = 1, modifiers = [], instructions = '') => {
    set((state) => {
      const existing = state.items.find((i) => i.menuItem.id === menuItem.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.menuItem.id === menuItem.id ? { ...i, quantity: i.quantity + quantity } : i
          ),
        };
      }
      return {
        items: [...state.items, { menuItem, quantity, modifiers, specialInstructions: instructions }],
      };
    });
  },

  removeItem: (menuItemId) => {
    set((state) => ({ items: state.items.filter((i) => i.menuItem.id !== menuItemId) }));
  },

  updateQuantity: (menuItemId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(menuItemId);
      return;
    }
    set((state) => ({
      items: state.items.map((i) =>
        i.menuItem.id === menuItemId ? { ...i, quantity } : i
      ),
    }));
  },

  clearCart: () => set({ items: [] }),

  subtotal: () => {
    return get().items.reduce((sum, item) => {
      const modTotal = item.modifiers.reduce((s, m) => s + Number(m.price), 0);
      return sum + (Number(item.menuItem.price) + modTotal) * item.quantity;
    }, 0);
  },

  itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
}));

// ── Auth Store ──────────────────────────────────────────────
interface AuthStore {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  fetchProfile: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: true,

  setUser: (user) => set({ user, loading: false }),

  fetchProfile: async () => {
    try {
      if (!api.isAuthenticated()) {
        set({ user: null, loading: false });
        return;
      }
      const user = await api.get<User>('/auth/profile/');
      set({ user, loading: false });
    } catch {
      set({ user: null, loading: false });
    }
  },

  logout: () => {
    api.logout();
    set({ user: null });
  },
}));
