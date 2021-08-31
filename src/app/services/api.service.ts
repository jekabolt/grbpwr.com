import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../src/environments/environment';
import { Product } from '../models/product.model'
 
@Injectable({providedIn:'root'})
export class ApiService {
 
  baseURL = environment.API_SERVER_URL ? environment.API_SERVER_URL :  "http://localhost:8081/"
 
  constructor(private http: HttpClient) {
  }
 
  getProducts(): Observable<Product[]> {
  console.log('getProducts '+this.baseURL + 'product')
  return this.http.get<Product[]>(this.baseURL + 'product')
  }

  getProductByID(id:string): Observable<Product> {
    console.log('getProductByID '+this.baseURL + 'product/'+ id)
    return this.http.get<Product>(this.baseURL + 'product/' + id)
  }
  

 
}