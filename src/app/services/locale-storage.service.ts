import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocaleService {

  constructor() { }
  
  setLocale(locale:string){
   
  }
  getLocale(){
   
  }

  setDefaultCurrency(currency:string){
    localStorage.setItem('currency', currency);
  }

  getCurrency():string{
   if (!localStorage.getItem('currency')) {
     return "usd"
   }
   return localStorage.getItem('currency')
  }
}
