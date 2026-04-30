import { sampleProducts } from "@/data/sampleProducts";
import { getProductStatus } from "@/lib/productHelpers";
import type { Product, ProductCategory } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AppStore {
  products: Product[];
  theme: "light" | "dark";
  selectedCategory: string;
  setTheme: (theme: "light" | "dark") => void;
  toggleTheme: () => void;
  setSelectedCategory: (category: string) => void;
  addProduct: (product: Omit<Product, "id" | "createdAt" | "status">) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProductsByCategory: (
    category: ProductCategory | "All" | "Expired",
  ) => Product[];
  getSummaryStats: () => {
    expired: number;
    soon: number;
    fresh: number;
    total: number;
  };
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      products: sampleProducts,
      theme: "light",
      selectedCategory: "All",

      setTheme: (theme) => {
        set({ theme });
        if (theme === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      },

      toggleTheme: () => {
        const current = get().theme;
        get().setTheme(current === "light" ? "dark" : "light");
      },

      setSelectedCategory: (category) => set({ selectedCategory: category }),

      addProduct: (productData) => {
        const id = `product_${Date.now()}`;
        const status = getProductStatus(productData.expiryDate);
        const product: Product = {
          ...productData,
          id,
          status,
          createdAt: Date.now(),
        };
        set((state) => ({ products: [product, ...state.products] }));
      },

      updateProduct: (id, updates) => {
        set((state) => ({
          products: state.products.map((p) => {
            if (p.id !== id) return p;
            const updated = { ...p, ...updates };
            return { ...updated, status: getProductStatus(updated.expiryDate) };
          }),
        }));
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));
      },

      getProductsByCategory: (category) => {
        const { products } = get();
        if (category === "All") return products;
        if (category === "Expired")
          return products.filter((p) => p.status === "expired");
        return products.filter((p) => p.category === category);
      },

      getSummaryStats: () => {
        const { products } = get();
        return {
          expired: products.filter((p) => p.status === "expired").length,
          soon: products.filter((p) => p.status === "soon").length,
          fresh: products.filter((p) => p.status === "safe").length,
          total: products.length,
        };
      },
    }),
    {
      name: "freshalert-store",
      partialize: (state) => ({
        products: state.products,
        theme: state.theme,
        selectedCategory: state.selectedCategory,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.theme === "dark") {
          document.documentElement.classList.add("dark");
        }
      },
    },
  ),
);
