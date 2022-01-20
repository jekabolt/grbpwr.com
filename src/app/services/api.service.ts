import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../src/environments/environment';
import { Product } from '../models/product.model'
import { ArchiveArticle } from '../models/archive.model'
 
@Injectable({providedIn:'root'})
export class ApiService {
 
  baseURL = environment.API_SERVER_URL ? environment.API_SERVER_URL :  "http://localhost:8081/"
 
  constructor(private http: HttpClient) {
  }

  apiPrefix = "/api/" 
  apiUrl = this.baseURL + this.apiPrefix
 
  getProducts(): Observable<Product[]> {
    console.log('getProducts '+this.apiUrl+ 'product')
    return this.http.get<Product[]>(this.apiUrl+ 'product')
  }

  getProductByID(id:string): Observable<Product> {
    console.log('getProductByID '+this.apiUrl+ 'product/'+ id)
    return this.http.get<Product>(this.apiUrl+ 'product/' + id)
  }

  getArchiveArticleByID(id:string): Observable<ArchiveArticle> {
    console.log('getArchiveArticleByID '+this.apiUrl+ 'archive/'+ id)
    return this.http.get<ArchiveArticle>(this.apiUrl+ 'archive/' + id)
  }

  getArchiveArticles(): Observable<ArchiveArticle[]> {
    console.log('getArchiveArticles '+this.apiUrl+ 'archive')
    return this.http.get<ArchiveArticle[]>(this.apiUrl+ 'archive')
  }
   
}