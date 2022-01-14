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
        title: 'grbpwr',
        metaTags: [
          { name: 'description', content: 'Shop the latest grbpwr menswear, womenswear, shoes and accessories now on the official grbpwr online store with worldwide express shipping.' },
          { property: 'og:title', content: 'grbpwr' },
          { property: 'og:description', content: 'Shop the latest grbpwr menswear, womenswear, shoes and accessories now on the official grbpwr online store with worldwide express shipping.' },
          { property: 'og:image', content: environment.APP_URL + '/img/small-logo.png' },
          { property: 'og:url', content: environment.APP_URL },
          { name: "twitter:card", content: "summary_large_image" },
        ]
      }
    } 
  },

  {
    path: 'products', 
    component: ProductsListComponent,
      data: {
        header:true,
        seo: {
          title: 'products',
          metaTags: [
            { name: 'description', content: 'Shop the latest grbpwr menswear, womenswear, shoes and accessories now on the official grbpwr online store with worldwide express shipping.' },
            { property: 'og:title', content: 'grbpwr' },
            { property: 'og:description', content: 'Shop the latest grbpwr menswear, womenswear, shoes and accessories now on the official grbpwr online store with worldwide express shipping.' },
            { property: 'og:image', content: environment.APP_URL + '/img/small-logo.png' },
            { property: 'og:url', content: environment.APP_URL },
            { name: "twitter:card", content: "summary_large_image" },
          ]
        }
      } 
  },
  {
    path: 'products/:id', 
    component: ProductDetailComponent,
      data: {
        header:true,
        seo: {
          title: 'products',
          metaTags: [
            { name: 'description', content: 'Shop the latest grbpwr menswear, womenswear, shoes and accessories now on the official grbpwr online store with worldwide express shipping.' },
            { property: 'og:title', content: 'grbpwr' },
            { property: 'og:description', content: 'Shop the latest grbpwr menswear, womenswear, shoes and accessories now on the official grbpwr online store with worldwide express shipping.' },
            { property: 'og:image', content: environment.APP_URL + '/img/small-logo.png' },
            { property: 'og:url', content: environment.APP_URL },
            { name: "twitter:card", content: "summary_large_image" },
          ]
        }
      } 
  },
  {
    path: 'archive', 
    component: ArchiveListComponent,
      data: {
        header:true,
        seo: {
          title: 'archive',
          metaTags: [
            { name: 'description', content: 'Shop the latest grbpwr menswear, womenswear, shoes and accessories now on the official grbpwr online store with worldwide express shipping.' },
            { property: 'og:title', content: 'grbpwr' },
            { property: 'og:description', content: 'Shop the latest grbpwr menswear, womenswear, shoes and accessories now on the official grbpwr online store with worldwide express shipping.' },
            { property: 'og:image', content: environment.APP_URL + '/img/small-logo.png' },
            { property: 'og:url', content: environment.APP_URL },
            { name: "twitter:card", content: "summary_large_image" },
          ]
        }
      } 
  },
  {
    path: 'archive/:id', 
    component: ArchiveDetailComponent,
      data: {
        header:true,
        seo: {
          title: 'archive',
          metaTags: [
            { name: 'description', content: 'Shop the latest grbpwr menswear, womenswear, shoes and accessories now on the official grbpwr online store with worldwide express shipping.' },
            { property: 'og:title', content: 'grbpwr' },
            { property: 'og:description', content: 'Shop the latest grbpwr menswear, womenswear, shoes and accessories now on the official grbpwr online store with worldwide express shipping.' },
            { property: 'og:image', content: environment.APP_URL + '/img/small-logo.png' },
            { property: 'og:url', content: environment.APP_URL },
            { name: "twitter:card", content: "summary_large_image" },
          ]
        }
      } 
  },
  {
    path: 'cart', 
    component: CartComponent,
      data: {
        header:true,
        seo: {
          title: 'cart',
          metaTags: [
            { name: 'description', content: 'Shop the latest grbpwr menswear, womenswear, shoes and accessories now on the official grbpwr online store with worldwide express shipping.' },
            { property: 'og:title', content: 'grbpwr' },
            { property: 'og:description', content: 'Shop the latest grbpwr menswear, womenswear, shoes and accessories now on the official grbpwr online store with worldwide express shipping.' },
            { property: 'og:image', content: environment.APP_URL + '/img/small-logo.png' },
            { property: 'og:url', content: environment.APP_URL },
            { name: "twitter:card", content: "summary_large_image" },
          ]
        }
      } 
  },
  {
    path: 'checkout', 
    component: CheckoutComponent,
      data: {
        header:true,
        seo: {
          title: 'checkout',
          metaTags: [
            { name: 'description', content: 'Shop the latest grbpwr menswear, womenswear, shoes and accessories now on the official grbpwr online store with worldwide express shipping.' },
            { property: 'og:title', content: 'grbpwr' },
            { property: 'og:description', content: 'Shop the latest grbpwr menswear, womenswear, shoes and accessories now on the official grbpwr online store with worldwide express shipping.' },
            { property: 'og:image', content: environment.APP_URL + '/img/small-logo.png' },
            { property: 'og:url', content: environment.APP_URL },
            { name: "twitter:card", content: "summary_large_image" },
          ]
        }
      } 
  },
  {
    path: 'order-complete', 
    component: CompleteComponent,
      data: {
        header:true,
        seo: {
          title: 'order-complete',
          metaTags: [
            { name: 'description', content: 'Shop the latest grbpwr menswear, womenswear, shoes and accessories now on the official grbpwr online store with worldwide express shipping.' },
            { property: 'og:title', content: 'grbpwr' },
            { property: 'og:description', content: 'Shop the latest grbpwr menswear, womenswear, shoes and accessories now on the official grbpwr online store with worldwide express shipping.' },
            { property: 'og:image', content: environment.APP_URL + '/img/small-logo.png' },
            { property: 'og:url', content: environment.APP_URL },
            { name: "twitter:card", content: "summary_large_image" },
          ]
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
          title: 'shipping-method',
          metaTags: [
            { name: 'description', content: 'Shop the latest grbpwr menswear, womenswear, shoes and accessories now on the official grbpwr online store with worldwide express shipping.' },
            { property: 'og:title', content: 'grbpwr' },
            { property: 'og:description', content: 'Shop the latest grbpwr menswear, womenswear, shoes and accessories now on the official grbpwr online store with worldwide express shipping.' },
            { property: 'og:image', content: environment.APP_URL + '/img/small-logo.png' },
            { property: 'og:url', content: environment.APP_URL },
            { name: "twitter:card", content: "summary_large_image" },
          ]
        }
      } 
  },
  {
    path: 'privacy-policy', 
    component: PrivacyPolicyComponent,
      data: {
        header:true,
        seo: {
          title: 'privacy-policy',
          metaTags: [
            { name: 'description', content: 'Shop the latest grbpwr menswear, womenswear, shoes and accessories now on the official grbpwr online store with worldwide express shipping.' },
            { property: 'og:title', content: 'grbpwr' },
            { property: 'og:description', content: 'Shop the latest grbpwr menswear, womenswear, shoes and accessories now on the official grbpwr online store with worldwide express shipping.' },
            { property: 'og:image', content: environment.APP_URL + '/img/small-logo.png' },
            { property: 'og:url', content: environment.APP_URL },
            { name: "twitter:card", content: "summary_large_image" },
          ]
        }
      } 
  },
  {
    path: 'contact-us', 
    component: ContactUsComponent,
      data: {
        header:true,
        seo: {
          title: 'contact-us',
          metaTags: [
            { name: 'description', content: 'Shop the latest grbpwr menswear, womenswear, shoes and accessories now on the official grbpwr online store with worldwide express shipping.' },
            { property: 'og:title', content: 'grbpwr' },
            { property: 'og:description', content: 'Shop the latest grbpwr menswear, womenswear, shoes and accessories now on the official grbpwr online store with worldwide express shipping.' },
            { property: 'og:image', content: environment.APP_URL + '/img/small-logo.png' },
            { property: 'og:url', content: environment.APP_URL },
            { name: "twitter:card", content: "summary_large_image" },
          ]
        }
      } 
  },
  {
    path: 'about', 
    component: AboutComponent,
      data: {
        header:true,
        seo: {
          title: 'about',
          metaTags: [
            { name: 'description', content: 'Shop the latest grbpwr menswear, womenswear, shoes and accessories now on the official grbpwr online store with worldwide express shipping.' },
            { property: 'og:title', content: 'grbpwr' },
            { property: 'og:description', content: 'Shop the latest grbpwr menswear, womenswear, shoes and accessories now on the official grbpwr online store with worldwide express shipping.' },
            { property: 'og:image', content: environment.APP_URL + '/img/small-logo.png' },
            { property: 'og:url', content: environment.APP_URL },
            { name: "twitter:card", content: "summary_large_image" },
          ]
        }
      } 
  },
  {
    path: 'returns', 
    component: ReturnsComponent,
      data: {
        header:true,
        seo: {
          title: 'returns',
          metaTags: [
            { name: 'description', content: 'Shop the latest grbpwr menswear, womenswear, shoes and accessories now on the official grbpwr online store with worldwide express shipping.' },
            { property: 'og:title', content: 'grbpwr' },
            { property: 'og:description', content: 'Shop the latest grbpwr menswear, womenswear, shoes and accessories now on the official grbpwr online store with worldwide express shipping.' },
            { property: 'og:image', content: environment.APP_URL + '/img/small-logo.png' },
            { property: 'og:url', content: environment.APP_URL },
            { name: "twitter:card", content: "summary_large_image" },
          ]
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