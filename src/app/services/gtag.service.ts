import { Injectable } from '@angular/core';
import { CartItem } from "../models/cart-item.model";

declare var gtag

@Injectable({
  providedIn: 'root'
})
export class GTagService {

  constructor() { }

  onAddToCart(cartItem:CartItem){
      gtag('event', 'add_to_cart', {
            'event_category': 'cart',
            'value': JSON.stringify(cartItem)
          }
      )
  }

}
