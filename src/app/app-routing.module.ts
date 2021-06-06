import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './core/home/home.component';
import {CartComponent} from './cart/cart.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {AboutComponent} from './info/about/about.component';
import {ShippingMethodsComponent} from './info/shipping-method/shipping-method.component';
import {ContactUsComponent} from './info/contact-us/contact-us.component';
import {PrivacyPolicyComponent} from './info/privacy-policy/privacy-policy.component';
import {SingleProductComponent} from './single-product/single-product.component';
import {ReturnsComponent} from './info/returns/returns.component';


import {CheckoutComponent} from './checkout/checkout.component';
// import { RegisterLoginComponent } from './account/register-login/register-login.component';
import {ProductsListComponent} from './products/products-list/products-list.component';
import {ProductDetailComponent} from './products/product-detail/product-detail.component';

import {ArchiveListComponent} from './archive/archive-list/archive-list.component';
import {ArchiveDetailComponent} from './archive/archive-detail/archive-detail.component';
import {CompleteComponent} from './checkout/complete/complete.component';

const routes: Routes = [
  { path: '', component: HomeComponent,  data: {header:true} },
  { path: 'products', component: ProductsListComponent,  data: {header:true} },
  { path: 'products/:id', component: ProductDetailComponent ,  data: {header:false}},

  { path: 'archive', component: ArchiveListComponent,  data: {header:true} },
  { path: 'archive/:id', component: ArchiveDetailComponent,  data: {header:true} },

  { path: 'cart', component: CartComponent,  data: {header:true} },

  { path: 'checkout', component: CheckoutComponent,data: {header:false} },

  { path: 'order-complete', component: CompleteComponent,  data: {header:true} },

  //info
  { path: 'shipping-method', component: ShippingMethodsComponent,  data: {header:true} },
  { path: 'privacy-policy', component: PrivacyPolicyComponent,  data: {header:true} },
  { path: 'contact-us', component: ContactUsComponent,  data: {header:true} },
  { path: 'about', component: AboutComponent,  data: {header:true} },
  { path: 'returns', component: ReturnsComponent,  data: {header:true} },

  { path: 'single-product', component: SingleProductComponent,  data: {header:true} },
  { path: '**', component: PageNotFoundComponent, data: {header:false} },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
