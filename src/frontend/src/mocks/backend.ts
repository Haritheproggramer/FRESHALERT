import type { backendInterface } from "../backend";

const now = BigInt(Date.now()) * BigInt(1_000_000);
const dayMs = BigInt(24 * 60 * 60 * 1000) * BigInt(1_000_000);

export const mockBackend: backendInterface = {
  addReminder: async (productId, alertHours) => ({
    id: "reminder-1",
    alertHours,
    createdAt: now,
    productId,
  }),

  createProduct: async (args) => ({
    id: "product-new",
    status: "fresh",
    expiryDate: args.expiryDate,
    name: args.name,
    createdAt: now,
    category: args.category,
    location: args.location,
    notes: args.notes,
    photo: args.photo,
    openedDate: args.openedDate,
  }),

  deleteProduct: async () => true,

  deleteReminder: async () => true,

  getExpiredCount: async () => BigInt(2),

  getFreshCount: async () => BigInt(12),

  getProductById: async (id) => ({
    id,
    status: "soon",
    expiryDate: now + dayMs * BigInt(3),
    name: "Greek Yogurt",
    createdAt: now - dayMs * BigInt(5),
    category: "Food",
    location: "Fridge",
    notes: "Buy more next week",
    photo: undefined,
    openedDate: now - dayMs * BigInt(2),
  }),

  getProducts: async () => [
    {
      id: "p1",
      status: "fresh",
      expiryDate: now + dayMs * BigInt(14),
      name: "Organic Milk",
      createdAt: now - dayMs * BigInt(3),
      category: "Food",
      location: "Fridge",
      notes: undefined,
      photo: undefined,
      openedDate: undefined,
    },
    {
      id: "p2",
      status: "soon",
      expiryDate: now + dayMs * BigInt(3),
      name: "Greek Yogurt",
      createdAt: now - dayMs * BigInt(5),
      category: "Food",
      location: "Fridge",
      notes: "Buy more next week",
      photo: undefined,
      openedDate: now - dayMs * BigInt(2),
    },
    {
      id: "p3",
      status: "expired",
      expiryDate: now - dayMs * BigInt(2),
      name: "Vitamin C Tablets",
      createdAt: now - dayMs * BigInt(90),
      category: "Medicine",
      location: "Cabinet",
      notes: undefined,
      photo: undefined,
      openedDate: undefined,
    },
    {
      id: "p4",
      status: "fresh",
      expiryDate: now + dayMs * BigInt(30),
      name: "Pasta",
      createdAt: now - dayMs * BigInt(1),
      category: "Food",
      location: "Pantry",
      notes: undefined,
      photo: undefined,
      openedDate: undefined,
    },
    {
      id: "p5",
      status: "soon",
      expiryDate: now + dayMs * BigInt(5),
      name: "Ibuprofen",
      createdAt: now - dayMs * BigInt(60),
      category: "Medicine",
      location: "Cabinet",
      notes: "Check dosage",
      photo: undefined,
      openedDate: undefined,
    },
    {
      id: "p6",
      status: "expired",
      expiryDate: now - dayMs * BigInt(7),
      name: "Salad Dressing",
      createdAt: now - dayMs * BigInt(30),
      category: "Food",
      location: "Fridge",
      notes: undefined,
      photo: undefined,
      openedDate: undefined,
    },
  ],

  getProductsByCategory: async (category) => [
    {
      id: "p1",
      status: "fresh",
      expiryDate: now + dayMs * BigInt(14),
      name: "Organic Milk",
      createdAt: now - dayMs * BigInt(3),
      category,
      location: "Fridge",
      notes: undefined,
      photo: undefined,
      openedDate: undefined,
    },
  ],

  getReminders: async () => [
    {
      id: "r1",
      alertHours: BigInt(24),
      createdAt: now,
      productId: "p2",
    },
  ],

  getSoonCount: async () => BigInt(3),

  getTotalProducts: async () => BigInt(17),

  getWasteSaved: async () => 47.5,

  initSampleData: async () => undefined,

  updateProduct: async () => true,
};
