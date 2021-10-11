import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {PagerService} from '../../pager/pager.service';
import {UiServiceArchive} from '../shared/ui.service';
import {SortPipe} from '../shared/sort.pipe';

import {Product} from '../../models/product.model';
import Products from '../../shop-items/products.json';


// Services
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-archive',
  templateUrl: './archive-list.component.html',
  styleUrls: ['./archive-list.component.scss']
})

export class ArchiveListComponent implements OnInit, OnDestroy {
    public unsubscribe$ = new Subject();
    public products: Product[];
    public productsPaged: Product[];
    public pager: any = {};
    public productsLoading: boolean;
    public currentPagingPage: number;
  
    constructor(
      private pagerService: PagerService,
      private sortPipe: SortPipe,
      public uiService: UiServiceArchive,
      private apiService: ApiService
    ) { }
  
    ngOnInit() {
      this.uiService.currentPagingPage$
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((page) => {
          this.currentPagingPage = page;
        });
      
      this.apiService.getProducts().subscribe(res => {
        this.products = res;
        this.setPage(this.currentPagingPage, this.products);
      });    
    } 
    
  
    onDisplayModeChange(mode: string, e: Event) {
      this.uiService.displayMode$.next(mode);
      e.preventDefault();
    }
  
    setPage(page: number, products: Product[]) {
      this.apiService.getProducts().subscribe((products=>{
        if (page < 1 || page > this.pager.totalPages) {
          return;
        }
        this.pager = this.pagerService.getPager(products.length, page, 8);
        this.productsPaged = products.slice(
          this.pager.startIndex,
          this.pager.endIndex + 1
        );
        this.uiService.currentPagingPage$.next(page);
      }));
    }
  
  
    ngOnDestroy() {
      if(this.unsubscribe$ && !this.unsubscribe$.closed)
      this.unsubscribe$.unsubscribe();
    }
  }
  