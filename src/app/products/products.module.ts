import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { SharedModule } from '../shared/shared.module';

import { ProductsListComponent } from './products-list/products-list.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductsListItemComponent } from './products-list-item/products-list-item.component';

import { FileUploadService } from './shared/file-upload.service';
import { ProductsCacheService } from './shared/products-cache.service';

import { SortPipe } from './shared/sort.pipe';

@NgModule({
  declarations: [
    ProductDetailComponent,
    ProductsListComponent,
    ProductsListItemComponent,
    SortPipe,
  ],
  imports: [SharedModule],
  exports: [
    ProductDetailComponent,
    ProductsListComponent,
    ProductsListItemComponent,
    SortPipe,
  ],
  providers: [SortPipe, FileUploadService, ProductsCacheService]
})
export class ProductsModule { }
