import type {
  common_OrderItem,
  ValidateOrderItemsInsertResponse,
} from "@/api/proto-http/frontend";
import { StateCreator } from "zustand";
import { PersistOptions } from "zustand/middleware";

export interface CartProduct {
  // Public variant identity (R2/R3): encodes both colourway (leading base SKU)
  // and size, replacing the internal (product id, size id) pair. One row per unit.
  variantSku: string;
  quantity: number;
  productData?: common_OrderItem;
}

export interface CartState {
  products: CartProduct[];
  totalItems: number;
  totalPrice: number;
  subTotalPrice: number;
  isOpen: boolean;
  productToRemove: { variantSku: string; index: number } | null;
  /** Currency code used for the last successful validation (keeps symbol in sync with prices) */
  validatedCurrency: string;
  isRevalidating: boolean;
}

export interface CartActions {
  increaseQuantity: (
    variantSku: string,
    quantity?: number,
    currency?: string,
    maxOrderItems?: number,
  ) => Promise<boolean>;
  removeProduct: (variantSku: string, index?: number) => void;
  syncWithValidatedItems: (
    validationResponse: ValidateOrderItemsInsertResponse,
    maxOrderItems?: number,
  ) => void;
  revalidateCart: (currency: string) => Promise<void>;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  setProductToRemove: (
    product: { variantSku: string; index: number } | null,
  ) => void;
}

export type CartStore = CartState & CartActions;

export type CartPersist = (
  config: StateCreator<CartStore>,
  options: PersistOptions<CartStore>,
) => StateCreator<CartStore>;
