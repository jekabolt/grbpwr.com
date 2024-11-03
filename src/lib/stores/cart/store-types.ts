import { StateCreator } from "zustand";
import { PersistOptions } from "zustand/middleware";

export interface CartProduct {
  id: number;
  size: string;
  quantity: number;
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
  ) => void;
  removeProduct: (productId: number, size: string) => void;
  decreaseQuantity: (productId: number, size: string) => void;
  clearCart: () => void;
}

export type CartStore = CartState & CartActions;

export type CartPersist = (
  config: StateCreator<CartStore>,
  options: PersistOptions<CartStore>,
) => StateCreator<CartStore>;
