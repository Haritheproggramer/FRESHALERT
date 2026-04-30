import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UpdateProductArgs {
    id: ProductId;
    openedDate?: Timestamp;
    expiryDate: Timestamp;
    name: string;
    notes?: string;
    category: string;
    photo?: string;
    location: string;
}
export type Timestamp = bigint;
export type ReminderId = string;
export interface Reminder {
    id: ReminderId;
    alertHours: bigint;
    createdAt: Timestamp;
    productId: ProductId;
}
export type ProductId = string;
export interface CreateProductArgs {
    openedDate?: Timestamp;
    expiryDate: Timestamp;
    name: string;
    notes?: string;
    category: string;
    photo?: string;
    location: string;
}
export interface Product {
    id: ProductId;
    status: string;
    openedDate?: Timestamp;
    expiryDate: Timestamp;
    name: string;
    createdAt: Timestamp;
    notes?: string;
    category: string;
    photo?: string;
    location: string;
}
export interface backendInterface {
    addReminder(productId: ProductId, alertHours: bigint): Promise<Reminder>;
    createProduct(args: CreateProductArgs): Promise<Product>;
    deleteProduct(id: ProductId): Promise<boolean>;
    deleteReminder(id: ReminderId): Promise<boolean>;
    getExpiredCount(): Promise<bigint>;
    getFreshCount(): Promise<bigint>;
    getProductById(id: ProductId): Promise<Product | null>;
    getProducts(): Promise<Array<Product>>;
    getProductsByCategory(category: string): Promise<Array<Product>>;
    getReminders(): Promise<Array<Reminder>>;
    getSoonCount(): Promise<bigint>;
    getTotalProducts(): Promise<bigint>;
    getWasteSaved(): Promise<number>;
    initSampleData(): Promise<void>;
    updateProduct(args: UpdateProductArgs): Promise<boolean>;
}
