import { Injectable } from '@angular/core';
import { Convert, Product } from "../models/product.model";

declare var gtag

@Injectable({
  providedIn: 'root'
})
export class GTagService {

  constructor() { }

  onAddToCart(prd:Product){
      gtag('event', 'ADD_TO_CART', {
            'event_category': 'CART',
            'value': Convert.productToJson(prd)
          }
      )
  }

}
