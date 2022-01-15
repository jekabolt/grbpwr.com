import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {HomeComponent} from './core/home/home.component';
import {CartComponent} from './cart/cart.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {AboutComponent} from './info/about/about.component';
import {ShippingMethodsComponent} from './info/shipping-method/shipping-method.component';
import {ContactUsComponent} from './info/contact-us/contact-us.component';
import {PrivacyPolicyComponent} from './info/privacy-policy/privacy-policy.component';
import {ReturnsComponent} from './info/returns/returns.component';
import {CheckoutComponent} from './checkout/checkout.component';
import {ProductsListComponent} from './products/products-list/products-list.component';
import {ProductDetailComponent} from './products/product-detail/product-detail.component';
import {ArchiveListComponent} from './archive/archive-list/archive-list.component';
import {ArchiveDetailComponent} from './archive/archive-detail/archive-detail.component';
import {CompleteComponent} from './checkout/complete/complete.component';

import { environment } from '../environments/environment';


const routes: Routes = [
  { 
    path: '',
    component: HomeComponent, 
    data: {
      header:true,
      seo: {
        metaTags: {
          description:"Shop the latest grbpwr menswear, womenswear, shoes and accessories now on the official grbpwr online store with worldwide express shipping.",
          title:"grbpwr",
          image:environment.APP_URL + '/img/meta-default-pic.jpg',
          url:environment.APP_URL,
        }
      }
    } 
  },

  {
    path: 'products', 
    component: ProductsListComponent,
      data: {
        header:true,
        seo: {
          metaTags: {
            description:"Shop the latest grbpwr menswear, womenswear, shoes and accessories now on the official grbpwr online store with worldwide express shipping.",
            title:"products",
            image:environment.APP_URL + '/img/meta-default-pic.jpg',
            url:environment.APP_URL + '/products',
          }
        }
      } 
  },
  {
    path: 'products/:id', 
    component: ProductDetailComponent,
      data: {
        header:true,
        seo: {
          metaTags: {
            description:"Shop the latest grbpwr menswear, womenswear, shoes and accessories now on the official grbpwr online store with worldwide express shipping.",
            title:"products",
            image:environment.APP_URL + '/img/meta-default-pic.jpg',
            url:environment.APP_URL + '/products/',
          }
        }
      } 
  },
  {
    path: 'archive', 
    component: ArchiveListComponent,
      data: {
        header:true,
        seo: {
          metaTags: {
            description:"Shop the latest grbpwr menswear, womenswear, shoes and accessories now on the official grbpwr online store with worldwide express shipping.",
            title:"archive",
            image:environment.APP_URL + '/img/meta-default-pic.jpg',
            url:environment.APP_URL + '/archive',
          }
        }
      } 
  },
  {
    path: 'archive/:id', 
    component: ArchiveDetailComponent,
      data: {
        header:true,
        seo: {
          metaTags: {
            description:"Shop the latest grbpwr menswear, womenswear, shoes and accessories now on the official grbpwr online store with worldwide express shipping.",
            title:"archive",
            image:environment.APP_URL + '/img/meta-default-pic.jpg',
            url:environment.APP_URL + '/archive/',
          }
        }
      } 
  },
  {
    path: 'cart', 
    component: CartComponent,
      data: {
        header:true,
        seo: {
          metaTags: {
            description:"Shop the latest grbpwr menswear, womenswear, shoes and accessories now on the official grbpwr online store with worldwide express shipping.",
            title:"cart",
            image:environment.APP_URL + '/img/meta-default-pic.jpg',
            url:environment.APP_URL + '/cart',
          }
        }
      } 
  },
  {
    path: 'checkout', 
    component: CheckoutComponent,
      data: {
        header:true,
        seo: {
          metaTags: {
            description:"Shop the latest grbpwr menswear, womenswear, shoes and accessories now on the official grbpwr online store with worldwide express shipping.",
            title:"checkout",
            image:environment.APP_URL + '/img/meta-default-pic.jpg',
            url:environment.APP_URL + '/checkout',
          }
        }
      } 
  },
  {
    path: 'order-complete', 
    component: CompleteComponent,
      data: {
        header:true,
        seo: {
          metaTags: {
            description:"Shop the latest grbpwr menswear, womenswear, shoes and accessories now on the official grbpwr online store with worldwide express shipping.",
            title:"order complete",
            image:environment.APP_URL + '/img/meta-default-pic.jpg',
            url:environment.APP_URL + '/order-complete',
          }
        }
      } 
  },

  //info
  {
    path: 'shipping-method', 
    component: ShippingMethodsComponent,
      data: {
        header:true,
        seo: {
          metaTags: {
            description:"Shop the latest grbpwr menswear, womenswear, shoes and accessories now on the official grbpwr online store with worldwide express shipping.",
            title:"shipping method",
            image:environment.APP_URL + '/img/meta-default-pic.jpg',
            url:environment.APP_URL + '/shipping-method',
          }
        }
      } 
  },
  {
    path: 'privacy-policy', 
    component: PrivacyPolicyComponent,
      data: {
        header:true,
        seo: {
          metaTags: {
            description:"Shop the latest grbpwr menswear, womenswear, shoes and accessories now on the official grbpwr online store with worldwide express shipping.",
            title:"privacy policy",
            image:environment.APP_URL + '/img/meta-default-pic.jpg',
            url:environment.APP_URL + '/privacy-policy',
          }
        }
      } 
  },
  {
    path: 'contact-us', 
    component: ContactUsComponent,
      data: {
        header:true,
        seo: {
          metaTags: {
            description:"Shop the latest grbpwr menswear, womenswear, shoes and accessories now on the official grbpwr online store with worldwide express shipping.",
            title:"contact us",
            image:environment.APP_URL + '/img/meta-default-pic.jpg',
            url:environment.APP_URL + '/contact-us',
          }
        }
      } 
  },
  {
    path: 'about', 
    component: AboutComponent,
      data: {
        header:true,
        seo: {
          metaTags: {
            description:"Shop the latest grbpwr menswear, womenswear, shoes and accessories now on the official grbpwr online store with worldwide express shipping.",
            title:"about",
            image:environment.APP_URL + '/img/meta-default-pic.jpg',
            url:environment.APP_URL + '/about',
          }
        }
      } 
  },
  {
    path: 'returns', 
    component: ReturnsComponent,
      data: {
        header:true,
        seo: {
          metaTags: {
            description:"Shop the latest grbpwr menswear, womenswear, shoes and accessories now on the official grbpwr online store with worldwide express shipping.",
            title:"returns",
            image:environment.APP_URL + '/img/meta-default-pic.jpg',
            url:environment.APP_URL + '/returns',
          }
        }
      } 
  },

  { path: '**', component: PageNotFoundComponent, data: {header:false} },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled', useHash: false})],
  exports: [RouterModule],
})
export class AppRoutingModule { }