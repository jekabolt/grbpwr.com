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
    var newUrl = url.content+extraPath
    this.meta.updateTag({name:"url",content:newUrl})
    this.meta.updateTag({property:"og:url",content:newUrl})
    this.meta.updateTag({property:"twitter:url",content:newUrl})
  }

  getMetaImage(url, callback, meta) {
    var img = new Image();
    img.src = url;
    img.onload = function() { callback(img.width, img.height, meta); }
  }

  updateImage(imageUrl: string){
    let img = new Image();
    img.src = imageUrl;  
    
    this.meta.updateTag({property:"og:image",content:imageUrl},)
    this.meta.updateTag({property:"og:image:secure_url",content:imageUrl},)
    this.meta.updateTag({property:"og:image:alt",content:imageUrl},)
    this.meta.updateTag({property:"og:image:type",content:"image/jpeg"},)
    this.meta.updateTag({property:"og:image",content:imageUrl},)

    this.getMetaImage(
      imageUrl,
      function(width, height,meta) { 
        meta.updateTag({property:"og:image:width",width},)
        meta.updateTag({property:"og:image:height",height},)
      },
      this.meta
    );

    this.meta.updateTag({property:"twitter:image:secure_url",content:imageUrl},)
    this.meta.updateTag({property:"twitter:image",content:imageUrl},) 
  }
  


  updateMeta(mt:MetaTags){
    this.meta.updateTag({name:"robots",content:"index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"})
    this.meta.updateTag({name:"url",content:mt.url})
    this.meta.updateTag({name:"title",content:mt.title})
    this.meta.updateTag({name:"image",content:mt.image})
    this.meta.updateTag({name:"description",content:mt.description})
  }

  updateOGMetaTags(mt:MetaTags){
    var og: MetaDefinition[] = [
      {property:"og:locale",content:"en_GB"},
      {property:"og:site_name",content:"grbpwr"},
      {property:"og:type",content:"website"},
      {property:"og:url",content:mt.url},
      {property:"og:title",content:mt.title},
      {property:"og:description",content:mt.description},
      {property:"og:image",content:mt.image},
      {property:"og:image:alt",content:mt.image},
      {property:"og:image:type",content:"image/jpeg"},
    ];
    og.forEach(m=> this.meta.updateTag(m))
    this.getMetaImage(
      mt.image,
      function(width, height,meta) { 
        meta.updateTag({property:"og:image:width",width},)
        meta.updateTag({property:"og:image:height",height},)
      },
      this.meta
    );
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
