import { create } from "zustand";
import type { Product } from "@/types";

interface UIStore {
  isSearchOpen: boolean;
  comparisonList: Product[];
  openSearch: () => void;
  closeSearch: () => void;
  addToComparison: (product: Product) => void;
  removeFromComparison: (productId: string) => void;
  clearComparison: () => void;
}

export const useUIStore = create<UIStore>((set, get) => ({
  isSearchOpen: false,
  comparisonList: [],

  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),

  addToComparison: (product) => {
    const list = get().comparisonList;
    if (list.length >= 3 || list.find((p) => p._id === product._id)) return;
    set({ comparisonList: [...list, product] });
  },

  removeFromComparison: (productId) =>
    set({ comparisonList: get().comparisonList.filter((p) => p._id !== productId) }),

  clearComparison: () => set({ comparisonList: [] }),
}));
