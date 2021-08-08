import {Component, OnDestroy, OnInit} from '@angular/core';

import {PagerService} from '../../pager/pager.service';
import {UiServiceArchive} from '../shared/ui.service';
import {SortPipe} from '../shared/sort.pipe';

import {ArchiveArticle} from '../../models/archive.model'
import Articles from '../../archive-items/articles.json';

@Component({
  selector: 'app-archive',
  templateUrl: './archive-list.component.html',
  styleUrls: ['./archive-list.component.scss']
})
export class ArchiveListComponent implements OnInit, OnDestroy {
  articles: ArchiveArticle[ ];
  articlesPaged: ArchiveArticle[];
  pager: any = {};
  articlesLoading: boolean;
  currentPagingPage: number;

  constructor(
    private pagerService: PagerService,
    private sortPipe: SortPipe,
    public uiService: UiServiceArchive
  ) { }

  ngOnInit() {
    this.getArticles();
  }

  getArticles() {
    this.articlesLoading = true;
    this.articles = Articles;
    this.setPage(this.currentPagingPage);
    this.articlesLoading = false;
  }

  onDisplayModeChange(mode: string, e: Event) {
    this.uiService.displayMode$.next(mode);
    e.preventDefault();
  }

  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    this.pager = this.pagerService.getPager(this.articles.length, page, 8);
    this.articlesPaged = this.articles.slice(
      this.pager.startIndex,
      this.pager.endIndex + 1
    );
    this.uiService.currentPagingPage$.next(page);
  }

  onSort(sortBy: string) {
    this.sortPipe.transform(
      this.articles,
      sortBy.replace(':reverse', ''),
      sortBy.endsWith(':reverse')
    );
    this.uiService.sorting$.next(sortBy);
    this.setPage(1);
  }

  ngOnDestroy() {
  }
}
