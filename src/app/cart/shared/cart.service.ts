import {AfterViewInit, EventEmitter, Injectable} from '@angular/core';
import { CartItem } from '../../models/cart-item.model';

@Injectable()
export class CartService {
  // Init and generate some fixtures
  private cartItems: CartItem[];
  public itemsChanged: EventEmitter<CartItem[]> = new EventEmitter<CartItem[]>();

  constructor() {
    this.cartItems = [];
    if (localStorage.getItem('cart')) {
      this.cartItems = JSON.parse(localStorage.getItem('cart'))
    }
  }

  public getItems() {
    return this.cartItems;
  }

  // Get Product ids out of CartItem[] in a new array
  private getItemIds() {
    return this.getItems().map(cartItem => cartItem.product.id);
  }

  public addItem(item: CartItem) {
    let ok = true
    this.cartItems.forEach(function (cartItem) {
      if (cartItem.product.id === item.product.id &&
        cartItem.size === item.product.selectedSize) { 
        ok = false
        return
      }
    });
    if (ok) {
      this.cartItems.push(item);
    }
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
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
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }

  public clearCart() {
    this.cartItems = [];
    this.itemsChanged.emit(this.cartItems.slice());
    localStorage.removeItem('cart');
  }

  public getTotal() {
    let total = 0;
    this.cartItems.forEach(cartItem => {
      total += cartItem.product.price.usd;
    });
    return total;
  }

}
