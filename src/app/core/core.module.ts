import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { ContentComponent } from './content/content.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './content/footer/footer.component';
import { NavigationMainComponent } from './header/navigation-main/navigation-main.component';
import { ToolbarCartComponent } from './header/toolbar/cart/cart.component';
import { HomeComponent } from './home/home.component';

import { ProductService } from '../products/shared/product.service';
import { ArchiveService } from '../archive/shared/archive.service';
import { CartService } from '../cart/shared/cart.service';
import { PagerService } from '../pager/pager.service';
import { CheckoutService } from '../checkout/shared/checkout.service';
import { OffcanvasService } from './shared/offcanvas.service';
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
        NavigationMainComponent,
        ToolbarCartComponent,
        HomeComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
    ],
    exports: [
        CommonModule,
        SharedModule,
        HeaderComponent,
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
        OffcanvasService,
        UiService,
        UiServiceArchive,
    ]
})
export class CoreModule {
    constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
        throwIfAlreadyLoaded(parentModule, 'CoreModule');
    }
}
