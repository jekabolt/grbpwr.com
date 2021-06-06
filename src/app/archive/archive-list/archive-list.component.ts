import {Component, OnDestroy, OnInit} from '@angular/core';

import {PagerService} from '../../pager/pager.service';
import {UiServiceArchive} from '../shared/ui.service';
import {SortPipe} from '../shared/sort.pipe';

import {Product} from '../../models/product.model';
import {User} from '../../models/user.model';
import Products from '../../shop-items/products.json';

@Component({
  selector: 'app-archive',
  templateUrl: './archive-list.component.html',
  styleUrls: ['./archive-list.component.scss']
})
export class ArchiveListComponent implements OnInit, OnDestroy {
  products: Product[];
  productsPaged: Product[];
  pager: any = {};
  user: User;
  productsLoading: boolean;
  currentPagingPage: number;

  constructor(
    private pagerService: PagerService,
    private sortPipe: SortPipe,
    public uiService: UiServiceArchive
  ) { }

  ngOnInit() {
    this.getProducts();
  }

  getProducts() {
    this.productsLoading = true;
    this.products = Products;
    this.setPage(this.currentPagingPage);
    this.productsLoading = false;
  }

  onDisplayModeChange(mode: string, e: Event) {
    this.uiService.displayMode$.next(mode);
    e.preventDefault();
  }

  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    this.pager = this.pagerService.getPager(this.products.length, page, 8);
    this.productsPaged = this.products.slice(
      this.pager.startIndex,
      this.pager.endIndex + 1
    );
    this.uiService.currentPagingPage$.next(page);
  }

  onSort(sortBy: string) {
    this.sortPipe.transform(
      this.products,
      sortBy.replace(':reverse', ''),
      sortBy.endsWith(':reverse')
    );
    this.uiService.sorting$.next(sortBy);
    this.setPage(1);
  }

  ngOnDestroy() {
  }
}
