import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {Subject} from 'rxjs';

import { DomSanitizer} from '@angular/platform-browser';

import {ArchiveArticle, Content} from '../../models/archive.model';

// Services
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-archive-detail',
  templateUrl: './archive-detail.component.html',
  styleUrls: ['./archive-detail.component.scss']
})

export class ArchiveDetailComponent implements OnInit, OnDestroy {
    private unsubscribe$ = new Subject();
    @Input() public article: ArchiveArticle;
  
    public articleLoading: boolean;
    public date: string;
  
    constructor(
      private router: Router,
      private route: ActivatedRoute,
      private apiService: ApiService,
      public sanitizer: DomSanitizer,
    ) { }

  
    ngOnInit(): void {
      const id = +this.route.snapshot.paramMap.get('id');
      this.apiService.getArchiveArticleByID(String(id)).subscribe(article => {
        if (article.article.id == id) {
            this.setupArticle(article);
            this.articleLoading = false;
            return
        } else{
          this.articleLoading = false;
          
          this.router.navigate(['/#/404']);
        }
      });    
  
    }

  
    private setupArticle(article:ArchiveArticle) {
      if (article) {
        article.article.content.forEach((obj:Content, i) => {
          if (obj.descriptionAlternative == "video") {
            obj.isVideo = true
            obj.safeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(obj.mediaLink);
            article.article.content[i] = obj
          }
        })
        this.date = new Date(article.article.dateCreated*1000).toLocaleDateString("en-US")
        this.article = article 
      }
    }
  
    ngOnDestroy() {
      if(this.unsubscribe$ && !this.unsubscribe$.closed)
      this.unsubscribe$.unsubscribe();
    }
  }
  