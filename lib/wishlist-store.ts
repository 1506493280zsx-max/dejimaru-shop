import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface WishlistItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  imageUrl: string | null;
  brand: string;
  grade: string | null;
}

interface WishlistStore {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (id: string) => void;
  hasItem: (id: string) => boolean;
  toggle: (item: WishlistItem) => void;
  count: () => number;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => set((state) => {
        if (state.items.find(i => i.id === item.id)) return state;
        return { items: [...state.items, item] };
      }),
      removeItem: (id) => set((state) => ({ items: state.items.filter(i => i.id !== id) })),
      hasItem: (id) => !!get().items.find(i => i.id === id),
      toggle: (item) => {
        const has = get().hasItem(item.id);
        if (has) get().removeItem(item.id);
        else get().addItem(item);
      },
      count: () => get().items.length,
    }),
    { name: "dejimaru-wishlist" }
  )
);
