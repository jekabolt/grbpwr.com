import { EventEmitter, Injectable } from '@angular/core';
import { CartItem } from '../../models/cart-item.model';
import { MessageService } from '../../messages/message.service';

@Injectable()
export class CartService {
  // Init and generate some fixtures
  private cartItems: CartItem[];
  public itemsChanged: EventEmitter<CartItem[]> = new EventEmitter<CartItem[]>();

  constructor(private messageService: MessageService) {
    this.cartItems = [];
  }

  public getItems() {
    return this.cartItems.slice();
  }

  // Get Product ids out of CartItem[] in a new array
  private getItemIds() {
    return this.getItems().map(cartItem => cartItem.product.id);
  }

  public addItem(item: CartItem) {
    let ok = true
    this.cartItems.forEach(function (cartItem) {
      if (cartItem.product.id === item.product.id &&
        cartItem.size === item.product.size) {
        cartItem.amount += item.amount;
        ok = false
        return
      }
    });
    if (ok) {
      this.cartItems.push(item);
      this.messageService.add('Added to cart: ' + item.product.name);
    }
  }

  public addItems(items: CartItem[]) {
    items.forEach((cartItem) => {
      this.addItem(cartItem);
    });
  }

  public removeItem(item: CartItem) {
    const indexToRemove = this.cartItems.findIndex(element => element === item);
    this.cartItems.splice(indexToRemove, 1);
    this.itemsChanged.emit(this.cartItems.slice());
    this.messageService.add('Deleted from cart: ' + item.product.name);
  }

  public updateItemAmount(item: CartItem, newAmount: number) {
    this.cartItems.forEach((cartItem) => {
      if (cartItem.product.id === item.product.id &&
        cartItem.size === item.size) {
        cartItem.amount = newAmount;
        return
      }
    });
    this.itemsChanged.emit(this.cartItems.slice());
    this.messageService.add('Updated amount for: ' + item.product.name);
  }

  public clearCart() {
    this.cartItems = [];
    this.itemsChanged.emit(this.cartItems.slice());
    this.messageService.add('Cleared cart');
  }

  public getTotal() {
    let total = 0;
    this.cartItems.forEach((cartItem) => {
      total += cartItem.amount * cartItem.product.price;
    });
    return total;
  }

}
