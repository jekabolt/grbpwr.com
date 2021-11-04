import { ProductClass } from './product.model';

export class CartItem {
  constructor(
    public product: ProductClass,
    public amount: number,
    public size: string,
  ) { }
}
