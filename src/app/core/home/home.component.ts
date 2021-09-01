import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
// import {UiService} from '../shared/ui.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

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
  
  url: string = "https://player.vimeo.com/video/521417674?autoplay=1&loop=1&background=1";
  urlSafe: SafeResourceUrl;
  // @ViewChild('iframe', {static:true}) iframe:ElementRef;

  constructor( 
    private apiService: ApiService,
    public sanitizer: DomSanitizer,
  ) { }

  ngOnInit() {   
    this.urlSafe= this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
    
    this.apiService.getProducts().subscribe(res => {
      this.products = res; 
    });   
  }

  ngOnDestroy() {
    if(this.unsubscribe$ && !this.unsubscribe$.closed)
    this.unsubscribe$.unsubscribe();
  }

  onLoad(event: any) {
    if (event.target.src) {
        alert(event.target.src)
    }
  }
}
