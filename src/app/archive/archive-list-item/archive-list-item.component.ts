import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { ArchiveArticle } from '../../models/archive.model';

@Component({
  selector: 'app-archive-list-item',
  templateUrl: './archive-list-item.component.html',
  styleUrls: ['./archive-list-item.component.scss']
})
export class ArchiveListItemComponent implements OnInit, OnDestroy {
  @Input() public article: ArchiveArticle;
  @Input() public displayMode: string;
  public imageLoading: boolean;
  public date: string;

  constructor(
  ) { }

  ngOnInit() {
    this.imageLoading = true; 
    this.date = new Date(this.article.article.dateCreated*1000).toLocaleDateString("en-US")
  }

  public onImageLoad() {
    this.imageLoading = false;
  }

  ngOnDestroy() {
  }
}
