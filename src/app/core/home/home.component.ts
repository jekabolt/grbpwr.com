import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {PagerService} from '../../pager/pager.service';
// import {UiService} from '../shared/ui.service';

// models 
import {Product} from '../../models/product.model';

// Services
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject();
  public products: Product[];
  public productsPaged: Product[];
  public pager: any = {};
  public currentPagingPage: number = 1;
  constructor( 
    private apiService: ApiService,
    private pagerService: PagerService,
  ) { }

  ngOnInit() {   
    this.apiService.getProducts().subscribe(res => {
      this.products = res; 
    });   
  }

  ngOnDestroy() {
    if(this.unsubscribe$ && !this.unsubscribe$.closed)
    this.unsubscribe$.unsubscribe();
  }
}
