import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../shared/shared.module';

import {ProductsListComponent} from './products-list/products-list.component';
import {ProductDetailComponent} from './product-detail/product-detail.component';
import {ProductsListItemComponent} from './products-list-item/products-list-item.component';
import {ProductsCacheService} from './shared/products-cache.service';

import {SortPipe} from './shared/sort.pipe';

@NgModule({
  declarations: [
    ProductDetailComponent,
    ProductsListComponent,
    ProductsListItemComponent,
    SortPipe,
  ],
  imports: [SharedModule,RouterModule],
  exports: [
    ProductDetailComponent,
    ProductsListComponent,
    ProductsListItemComponent,
    SortPipe,
  ],
  providers: [SortPipe, ProductsCacheService]
})
export class ProductsModule { }
