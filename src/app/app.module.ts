// Modules
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {ProductsModule} from './products/products.module';
import {ArchiveModule} from './archive/archive.module';
import {SharedModule} from './shared/shared.module';
import {CoreModule} from './core/core.module';
import {CheckoutModule} from './checkout/checkout.module';

// Components
import {AppComponent} from './app.component';
import {CartComponent} from './cart/cart.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {AboutComponent} from './info/about/about.component';
import {ShippingMethodsComponent} from './info/shipping-method/shipping-method.component';
import {PrivacyPolicyComponent} from './info/privacy-policy/privacy-policy.component';
import {ContactUsComponent} from './info/contact-us/contact-us.component';
import {SingleProductComponent} from './single-product/single-product.component';
import {ReturnsComponent} from './info/returns/returns.component';

@NgModule({
  declarations: [
    AppComponent,
    CartComponent,
    PageNotFoundComponent,
    AboutComponent,
    ShippingMethodsComponent,
    PrivacyPolicyComponent,
    ContactUsComponent,
    SingleProductComponent,
    ReturnsComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    SharedModule,
    CoreModule,
    ProductsModule,
    ArchiveModule,
    CheckoutModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
