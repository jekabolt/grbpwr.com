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
}

export interface CartActions {
  increaseQuantity: (
    productId: number,
    size: string,
    quantity?: number,
  ) => Promise<void>;
  removeProduct: (productId: number, size: string) => void;
  decreaseQuantity: (productId: number, size: string) => Promise<void>;
  clearCart: () => void;
}

export type CartStore = CartState & CartActions;

export type CartPersist = (
  config: StateCreator<CartStore>,
  options: PersistOptions<CartStore>,
) => StateCreator<CartStore>;
