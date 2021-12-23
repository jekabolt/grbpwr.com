import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {ActivatedRoute, Params, Router} from '@angular/router';

import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {CartService} from '../../cart/shared/cart.service';
import {CartItem} from '../../models/cart-item.model';

import {ArchiveArticle, Article} from '../../models/archive.model';

// Services
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-archive-detail',
  templateUrl: './archive-detail.component.html',
  styleUrls: ['./archive-detail.component.scss']
})

export class ArchiveDetailComponent implements OnInit, OnDestroy {
    private unsubscribe$ = new Subject();
    @Input() public article: ArchiveArticle;
    public productLoading: boolean;
    public sizeActive = false
    public detailsActive = false
  
    public sizes: {avb: boolean, sz: string }[]
    // public availableSizes: AvailableSizes;
    public imagesLoaded: string[];
    public activeImageUrl: string;
    public activeImageIndex: number;
  
    public selectedQuantity: number;
    public selectedSize: string;
    public cartButtonTitle = 'add to cart';
  
    constructor(
      private router: Router,
      private route: ActivatedRoute,
      private location: Location,
      private cartService: CartService,
      private apiService: ApiService
    ) { }
  
  
    toggleSize(){
       this.sizeActive = !this.sizeActive;
    }
  
    ShowDetail() {
      this.detailsActive = !this.detailsActive;
    }
  
  
    ngOnInit(): void {
  
      this.selectedQuantity = 1;
      this.imagesLoaded = [];
  
      this.sizes = [];
  
      const id = +this.route.snapshot.paramMap.get('id');
      this.apiService.getArchiveArticleByID(String(id)).subscribe(article => {     
        if (article.article.id == id) {
            this.setupArticle(article);
            this.productLoading = false;
            return
        } else{
          this.productLoading = false;
          this.router.navigate(['/404-product-not-found']);
        }
      });    
  
    }

    public onImageLoad(e: any) {
      this.imagesLoaded.push(e.target.src);
    }
  
    private setupArticle(article:ArchiveArticle) {
      if (article) {
        this.article = article
        // article.content.forEach((obj, i) => {
        //   if (!obj.includes('://')) {
        //     product.product.productImages[i] = location.origin + obj
        //   }
        // });
        // this.activeImageUrl = product.product.productImages[0];
        // this.activeImageIndex = 0;
        // this.availableSizes = product.product.availableSizes
        
      }
    }
  
    ngOnDestroy() {
      if(this.unsubscribe$ && !this.unsubscribe$.closed)
      this.unsubscribe$.unsubscribe();
    }
  }
  