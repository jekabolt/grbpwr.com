import type { common_OrderItem } from "@/api/proto-http/frontend";
import { StateCreator } from "zustand";
import { PersistOptions } from "zustand/middleware";

export interface CartProduct {
  id: number;
  size: string;
  quantity: number;
  productData?: common_OrderItem;
}

export interface CartState {
  products: CartProduct[];
  totalItems: number;
  totalPrice: number;
  subTotalPrice: number;
  isOpen: boolean;
  productToRemove: { id: number; size: string; index: number } | null;
}

export interface CartActions {
  increaseQuantity: (
    productId: number,
    size: string,
    quantity?: number,
    currency?: string,
  ) => Promise<void>;
  removeProduct: (productId: number, size: string, index?: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  setProductToRemove: (product: { id: number; size: string; index: number } | null) => void;
}

export type CartStore = CartState & CartActions;

export type CartPersist = (
  config: StateCreator<CartStore>,
  options: PersistOptions<CartStore>,
) => StateCreator<CartStore>;
