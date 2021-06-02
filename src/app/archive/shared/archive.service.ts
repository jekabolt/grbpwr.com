import {Observable, of} from 'rxjs';
import {Injectable} from '@angular/core';


@Injectable({providedIn: 'root'})
export class ArchiveService {


  constructor(

  ) { }

  private log(message: string) {
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead
      this.log(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }


}
