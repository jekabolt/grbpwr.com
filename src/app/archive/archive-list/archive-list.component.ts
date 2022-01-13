import {Component, OnDestroy, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";

import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {PagerService} from '../../pager/pager.service';
import {UiServiceArchive} from '../shared/ui.service';
import {SortPipe} from '../shared/sort.pipe';

import {ArchiveArticle} from '../../models/archive.model';


// Services
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-archive',
  templateUrl: './archive-list.component.html',
  styleUrls: ['./archive-list.component.scss']
})

export class ArchiveListComponent implements OnInit, OnDestroy {
    public unsubscribe$ = new Subject();
    public articles: ArchiveArticle[];
    public articlesPaged: ArchiveArticle[];
    public pager: any = {};
    public articlesLoading: boolean;
    public currentPagingPage: number;
    public pageTitle = "archive";
  
    constructor(
      private pagerService: PagerService,
      public uiService: UiServiceArchive,
      private apiService: ApiService,
      private titleService: Title
    ) { 
      this.titleService.setTitle(this.pageTitle);
    }
  
    ngOnInit() {
      this.uiService.currentPagingPage$
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((page) => {
          this.currentPagingPage = page;
        });
      
      this.apiService.getArchiveArticles().subscribe(res => {       
        this.articles = res;
        this.setPage(this.currentPagingPage, this.articles);
      });    
    } 
    
  
    onDisplayModeChange(mode: string, e: Event) {
      this.uiService.displayMode$.next(mode);
      e.preventDefault();
    }
  
    
    setPage(page: number, articles: ArchiveArticle[]) {
        if (page < 1 || page > this.pager.totalPages) {
          return;
        }
        this.pager = this.pagerService.getPager(articles.length, page, 8);
        this.articlesPaged = articles.slice(
          this.pager.startIndex,
          this.pager.endIndex + 1
        );
        this.uiService.currentPagingPage$.next(page);
    }
  
  
    ngOnDestroy() {
      if(this.unsubscribe$ && !this.unsubscribe$.closed)
      this.unsubscribe$.unsubscribe();
    }
  }
  