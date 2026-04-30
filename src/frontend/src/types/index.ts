export type ProductStatus = "safe" | "soon" | "expired";

export type ProductCategory = "Food" | "Medicine" | "Daily";

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  location: string;
  expiryDate: number; // timestamp ms
  openedDate?: number; // timestamp ms
  photo?: string;
  notes?: string;
  status: ProductStatus;
  createdAt: number;
}

export interface AppState {
  products: Product[];
  theme: "light" | "dark";
  selectedCategory: string;
}
