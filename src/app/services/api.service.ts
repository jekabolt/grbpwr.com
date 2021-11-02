import { HttpClient, HttpHeaders } from '@angular/common/http';
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
 
  getProducts(): Observable<Product[]> {
    console.log('getProducts '+this.baseURL +this.apiPrefix+ 'product')
    return this.http.get<Product[]>(this.baseURL +this.apiPrefix+ 'product')
  }

  getProductByID(id:string): Observable<Product> {
    console.log('getProductByID '+this.baseURL +this.apiPrefix+ 'product/'+ id)
    return this.http.get<Product>(this.baseURL +this.apiPrefix+ 'product/' + id)
  }

  getArchiveArticleByID(id:string): Observable<ArchiveArticle> {
    console.log('getArchiveArticleByID '+this.baseURL +this.apiPrefix+ 'archive/'+ id)
    return this.http.get<ArchiveArticle>(this.baseURL +this.apiPrefix+ 'archive/' + id)
  }

  getArchiveArticles(): Observable<ArchiveArticle[]> {
    console.log('getArchiveArticles '+this.baseURL +this.apiPrefix+ 'archive')
    return this.http.get<ArchiveArticle[]>(this.baseURL +this.apiPrefix+ 'archive')
  }
   
}