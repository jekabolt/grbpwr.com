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
import {CompleteComponent} from './checkout/complete/complete.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'products', component: ProductsListComponent },
  { path: 'products/:id', component: ProductDetailComponent },
  { path: 'cart', component: CartComponent },

  { path: 'checkout', component: CheckoutComponent },

  { path: 'order-complete', component: CompleteComponent },

  //info
  { path: 'shipping-method', component: ShippingMethodsComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'contact-us', component: ContactUsComponent },
  { path: 'about', component: AboutComponent },
  { path: 'returns', component: ReturnsComponent },

  { path: 'single-product', component: SingleProductComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
