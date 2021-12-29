import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { ContentComponent } from './content/content.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { AnimationComponents } from './animation/animation.components'

import { ProductService } from '../products/shared/product.service';
import { ArchiveService } from '../archive/shared/archive.service';
import { CartService } from '../cart/shared/cart.service';
import { PagerService } from '../pager/pager.service';
import { CheckoutService } from '../checkout/shared/checkout.service';

import { UiService } from '../products/shared/ui.service';
import { ProductsCacheService } from '../products/shared/products-cache.service';
import { UiServiceArchive } from '../archive/shared/ui.service';
import { ArchiveCacheService } from '../archive/shared/archive-cache.service';

import { throwIfAlreadyLoaded } from './module-import-guard';


@NgModule({
    declarations: [
        ContentComponent,
        HeaderComponent,
        FooterComponent,
        HomeComponent,
        AnimationComponents
    ],
    imports: [
        CommonModule,
        SharedModule,
    ],
    exports: [
        CommonModule,
        SharedModule,
        HeaderComponent,
        FooterComponent,
        ContentComponent
    ],
    providers: [
        ProductService,
        ArchiveService,
        ProductsCacheService,
        ArchiveCacheService,
        CartService,
        PagerService,
        CheckoutService,
        UiService,
        UiServiceArchive,
    ]
})
export class CoreModule {
    constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
        throwIfAlreadyLoaded(parentModule, 'CoreModule');
    }
}
