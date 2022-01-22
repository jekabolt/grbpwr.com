import { Injectable } from '@angular/core';
import { CartItem } from '../models/cart-item.model';

@Injectable({
  providedIn: 'root'
})
export class CartStorageService {

  constructor() { }

  cartKey = "cart"

  storageExist():boolean{
    return
  }
  
  setProductToStorage(items:CartItem[]){
    localStorage.setItem(this.cartKey, JSON.stringify(items));
  }

  getCartItems() {
    if (localStorage.getItem(this.cartKey)) {
      return JSON.parse(localStorage.getItem(this.cartKey))
    }
    return []
  }

  clearCartStorage() {
    localStorage.removeItem(this.cartKey);
  }

}
