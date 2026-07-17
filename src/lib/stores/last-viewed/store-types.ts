import { StorefrontColorway } from "@/api/proto-http/frontend";

export interface LastViewedState {
  products: StorefrontColorway[];
}

export interface LastViewedActions {
  addProduct: (product: StorefrontColorway) => void;
}

export type LastViewedStore = LastViewedState & LastViewedActions;
