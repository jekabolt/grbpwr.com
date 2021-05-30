import {Component, OnDestroy, OnInit} from '@angular/core';

import {PagerService} from '../../pager/pager.service';

import {UiService} from '../shared/ui.service';
import {SortPipe} from '../shared/sort.pipe';

import {Article} from '../../models/article.model';
import Articles from '../../archive-articles/articles.json';

@Component({
  selector: 'app-archive-list',
  templateUrl: './archive-list.component.html',
  styleUrls: ['./archive-list.component.scss']
})

export class ArchiveListComponent implements OnInit, OnDestroy {
  articles: Article[];
  articlesPaged: Article[];
  pager: any = {};
  articlesLoading: boolean;
  currentPagingPage: number;

  constructor(
    private pagerService: PagerService,
    private sortPipe: SortPipe,
    public uiService: UiService
  ) { }

  ngOnInit() {
    alert("lel")
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
