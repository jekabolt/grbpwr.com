import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {RouterModule} from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from '../app-routing.module';
import { PageTitleComponent } from '../core/page-title/page-title.component';
import { PriceComponent } from './price/price.component';

@NgModule({
    declarations: [
        PriceComponent,
        PageTitleComponent
    ],
    imports: [
        AppRoutingModule,
        RouterModule,
        CommonModule,
        FormsModule
    ],
    exports: [
        AppRoutingModule,
        RouterModule,
        PriceComponent,
        PageTitleComponent,
        CommonModule,
        FormsModule
    ]
})
export class SharedModule {}
