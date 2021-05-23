import { Component, Input } from '@angular/core';

import { Product } from '../../../models/product.model';

import Products from '../../../shop-items/products.json'

@Component({
  selector: 'app-product-widget',
  templateUrl: './product-widget.component.html',
  styleUrls: ['./product-widget.component.scss']
})
export class ProductWidgetComponent {
  @Input() public products: Product[];
  @Input() public widgetTitle: string;
}
