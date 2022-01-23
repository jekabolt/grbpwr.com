import { EventEmitter, Injectable } from '@angular/core';
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

  public getTotal(currency:string) {
    let totalUSD = 0;
    let totalEUR = 0;
    let totalRUB = 0;

    this.cartItems.forEach(cartItem => {
      totalUSD += cartItem.product.price.usd;
      totalEUR += cartItem.product.price.eur;
      totalRUB += cartItem.product.price.rub;
    });
    switch (currency) {
      case "usd":
         return totalUSD
      case "eur":
        return totalEUR
      case "rub":
        return totalRUB
      default:
        console.log("No such currency exists!");
        return totalUSD
    }
  }

}
