import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../shared/shared.module';

import {ArchiveListComponent} from './archive-list/archive-list.component';
import {ArchiveDetailComponent} from './archive-detail/archive-detail.component';
import {ArchiveListItemComponent} from './archive-list-item/archive-list-item.component';
import {ArchiveCacheService} from './shared/archive-cache.service';

import {SortPipe} from './shared/sort.pipe';

@NgModule({
  declarations: [
    ArchiveDetailComponent,
    ArchiveListComponent,
    ArchiveListItemComponent,
    SortPipe,
  ],
  imports: [SharedModule,RouterModule],
  exports: [
    ArchiveDetailComponent,
    ArchiveListComponent,
    ArchiveListItemComponent,
    SortPipe,
  ],
  providers: [SortPipe, ArchiveCacheService]
})
export class ArchiveModule { }
