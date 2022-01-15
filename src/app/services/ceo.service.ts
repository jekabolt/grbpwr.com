import { Injectable } from '@angular/core';
import { Title, Meta, MetaDefinition } from '@angular/platform-browser';
import { MetaTags } from '../models/meta-tags.model';

@Injectable({
  providedIn: 'root'
})
export class SeoService {

  constructor(private title: Title, private meta: Meta) { }

  updateAllMetaTags(mt:MetaTags){
    this.updateTitle(mt.title)
    this.updateMeta(mt)
    this.updateOGMetaTags(mt)
    this.updateTwitterMetaTags(mt)
  }

  updateTitle(title: string){
    this.title.setTitle(title);
  }

  updateDescription(description: string){
    this.meta.updateTag({name:"description",content:description})
    this.meta.updateTag({property:"og:description",content:description})
    this.meta.updateTag({property:"twitter:description",content:description})
  }

  updateUrlPath(extraPath: string){
    
    var url = this.meta.getTag('name= "url"')
    this.meta.updateTag({name:"url",content:url.content+extraPath})
    this.meta.updateTag({property:"og:url",content:url.content+extraPath})
    this.meta.updateTag({property:"twitter:url",content:url.content+extraPath})
  }

  updateImage(imageUrl: string){
    this.meta.updateTag({property:"og:image:secure_url",content:imageUrl},)
    this.meta.updateTag({property:"og:image:alt",content:imageUrl},)
    this.meta.updateTag({property:"og:image:type",content:"image/jpeg"},)

    this.meta.updateTag({property:"twitter:image:secure_url",content:imageUrl},)
    this.meta.updateTag({property:"twitter:image",content:imageUrl},) 
  }
  


  updateMeta(mt:MetaTags){
    this.meta.updateTag({name:"url",content:mt.url})
    this.meta.updateTag({name:"title",content:mt.title})
    this.meta.updateTag({name:"image",content:mt.image})
    this.meta.updateTag({name:"description",content:mt.description})
  }

  updateOGMetaTags(mt:MetaTags){
    var og: MetaDefinition[] = [
      {property:"og:type",content:"website"},
      {property:"og:url",content:mt.url},
      {property:"og:title",content:mt.title},
      {property:"og:description",content:mt.description},
      {property:"og:image:secure_url",content:mt.image},
      {property:"og:image:alt",content:mt.image},
      {property:"og:image:type",content:"image/jpeg"},
    ];
    og.forEach(m=> this.meta.updateTag(m))
  }
  updateTwitterMetaTags(mt:MetaTags){
    var twitter: MetaDefinition[] = [
      {property:"twitter:card",content:"summary_large_image"},
      {property:"twitter:url",content:mt.url},
      {property:"twitter:title",content:mt.title},
      {property:"twitter:description",content:mt.description},
      {property:"twitter:image:secure_url",content:mt.image},
      {property:"twitter:image",content:mt.image},
    ];
    twitter.forEach(m=> this.meta.updateTag(m))
  }
}
