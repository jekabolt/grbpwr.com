import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AppRoutingModule} from '../app-routing.module';
import {FormsModule} from '@angular/forms';


@NgModule({
    declarations: [

    ],
    imports: [
        CommonModule,
        AppRoutingModule,
        FormsModule
    ],
    exports: [
        // PriceComponent,
        CommonModule,
        AppRoutingModule,
        FormsModule
    ]
})
export class SharedModule {}
