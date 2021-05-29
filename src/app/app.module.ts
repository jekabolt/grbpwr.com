// Modules
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ProductsModule } from './products/products.module';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { CheckoutModule } from './checkout/checkout.module';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { environment } from '../environments/environment';

// Components
import { AppComponent } from './app.component';
import { CartComponent } from './cart/cart.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AboutComponent } from './info/about/about.component';
import { ShippingMethodsComponent } from './info/shipping-method/shipping-method.component';
import { PrivacyPolicyComponent } from './info/privacy-policy/privacy-policy.component';
import { ContactUsComponent } from './info/contact-us/contact-us.component';
import { SingleProductComponent } from './single-product/single-product.component';
import { ReturnsComponent } from './info/returns/returns.component';

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
    ReturnsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireStorageModule, // imports firebase/storage only needed for storage features
    HttpClientModule,
    SharedModule,
    CoreModule,
    ProductsModule,
    CheckoutModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
