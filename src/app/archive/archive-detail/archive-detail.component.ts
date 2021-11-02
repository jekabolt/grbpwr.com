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
    @Input() public article: Article;
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
            this.setupArticle(article.article);
            this.productLoading = false;
            return
        } else{
          this.productLoading = false;
          this.router.navigate(['/404-product-not-found']);
        }
      });    
  
    }
  
    // public setSizes(as: AvailableSizes) {
    //   this.sizes = []
    //   if(as.hasOwnProperty('xxs')) {
    //     if (as.xxs == 0) {
    //       this.sizes.push({ sz: "xxs", avb: false })
    //     }else{
    //       this.sizes.push({ sz: "xxs", avb: true })
    //     }
    //   }
  
    //   if(as.hasOwnProperty('xs')) {
    //     if (as.xs == 0) {
    //       this.sizes.push({ sz: "xs", avb: false })
    //     }else{
    //       this.sizes.push({ sz: "xs", avb: true })
    //     }
    //   }
  
    //   if(as.hasOwnProperty('s')) {
    //     if (as.s == 0) {
    //       this.sizes.push({ sz: "s", avb: false })
    //     }else{
    //       this.sizes.push({ sz: "s", avb: true })
    //     }
    //   }
  
    //   if(as.hasOwnProperty('m')) {
    //     if (as.m == 0) {
    //       this.sizes.push({ sz: "m", avb: false })
    //     }else{
    //       this.sizes.push({ sz: "m", avb: true })
    //     }
    //   }
  
    //   if(as.hasOwnProperty('l')) {
    //     if (as.l == 0) {
    //       this.sizes.push({ sz: "l", avb: false })
    //     }else{
    //       this.sizes.push({ sz: "l", avb: true })
    //     }
    //   }
  
    //   if(as.hasOwnProperty('xl')) {
    //     if (as.xl == 0) {
    //       this.sizes.push({ sz: "xl", avb: false })
    //     }else{
    //       this.sizes.push({ sz: "xl", avb: true })
    //     }
    //   }
  
    //   if(as.hasOwnProperty('xxl')) {
    //     if (as.xxl == 0) {
    //       this.sizes.push({ sz: "xxl", avb: false })
    //     }else{
    //       this.sizes.push({ sz: "xxl", avb: true })
    //     }
    //   }
  
    //   if(as.hasOwnProperty('os')) {
    //     if (as.os == 0) {
    //       this.sizes.push({ sz: "os", avb: false })
    //     }else{
    //       this.sizes.push({ sz: "os", avb: true })
    //     }
    //   }
  
    // }
  
  
    // public onSelectThumbnail(event, index) {
    //   event.preventDefault();
    //   this.activeImageUrl = this.product.product.productImages[index];
    //   this.activeImageIndex = index;
    // }
  
    // public setCartButtonText(lbl) {
    //   setTimeout(function () {
    //     this.cartButtonTitle = 'ADDED';
    //   }, 1500);
    // }
  
    // public get() {
    //   alert(this.cartService.getTotal())
    // }
  
    // public onAddToCart(lbl) {
    //   if (this.selectedSize == undefined || this.selectedSize == "") {
    //     this.cartButtonTitle = 'select size';
    //     this.setCartButtonText(lbl)
    //     return
    //   }
    //   this.cartButtonTitle = 'ITEM ADDED';
    //   this.setCartButtonText(lbl)
  
    //   this.product.product.selectedSize = this.selectedSize
    //   this.cartService.addItem(new CartItem(this.product, this.selectedQuantity, this.product.product.selectedSize));
    // }
  
    // public onSelectQuantity(event) {
    //   this.selectedQuantity = <number>+event.target.value;
    // }
  
    // public onSelectSize(event) {
    //   this.selectedSize = String(event.target.value);
    // }
  
    // public onRadioSize(sz) {
    //   this.selectedSize = sz;
    // }
  
    public onImageLoad(e: any) {
      this.imagesLoaded.push(e.target.src);
    }
  
    private setupArticle(article:Article) {
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
  