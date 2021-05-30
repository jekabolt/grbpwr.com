import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../shared/shared.module';

import {ArchiveListComponent} from './archive-list/archive-list.component';

import {SortPipe} from './shared/sort.pipe';

@NgModule({
  declarations: [
    ArchiveListComponent,
    SortPipe,
  ],
  imports: [SharedModule,RouterModule],
  exports: [
    ArchiveListComponent,
    SortPipe,
  ],
  providers: [SortPipe]
})
export class ArchiveModule { }
