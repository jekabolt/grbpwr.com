import {Component, OnDestroy, OnInit} from '@angular/core';
import {Title , Meta} from "@angular/platform-browser";

import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {PagerService} from '../../pager/pager.service';
import {UiService} from '../shared/ui.service';
import {SortPipe} from '../shared/sort.pipe';

import {Product} from '../../models/product.model';

// Services
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-products',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss']
})
export class ProductsListComponent implements OnInit, OnDestroy {
  public unsubscribe$ = new Subject();
  public products: Product[];
  public productsPaged: Product[];
  public pager: any = {};
  public productsLoading: boolean;
  public currentPagingPage: number;
  public pageTitle = "products";
  public pageMetaDescription = "Shop the latest grbpwr menswear, womenswear, shoes and accessories now on the official grbpwr online store with worldwide express shipping.";

  constructor(
    private pagerService: PagerService,
    private sortPipe: SortPipe,
    public uiService: UiService,
    private apiService: ApiService,
    private titleService: Title,
    private meta: Meta
  ) {
    this.titleService.setTitle(this.pageTitle);
    this.meta.addTag({ name: 'og:description', content: this.pageMetaDescription });  
    this.meta.addTag({ name: 'og:image', content: "src/img/smal-logo.png"}); 
   }

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
      console.log(this.productsPaged[0])
      this.uiService.currentPagingPage$.next(page);
    }));
  }


  ngOnDestroy() {
    if(this.unsubscribe$ && !this.unsubscribe$.closed)
    this.unsubscribe$.unsubscribe();
  }
}
