import { Injectable } from '@angular/core';
import { Promotion } from '../shared/promotion';

import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { map , catchError} from 'rxjs/operators';
import { ProcessHttpmsgService } from './process-httpmsg.service';
import { baseURL } from '../shared/baseurl';


@Injectable({
  providedIn: 'root'
})


export class PromotionService {

  constructor(private http: HttpClient,
    private processHTTPMsgService: ProcessHttpmsgService) { }

    getPromotions(): Observable<Promotion[]> {
      return this.http.get<Promotion[]>(baseURL + 'promotions')
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }
  
    getPromotion(id: String): Observable<Promotion> {
      return  this.http.get<Promotion>(baseURL + 'promotions/'+ id)
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }
  
    getFeaturedPromotion(): Observable<Promotion> {
      return this.http.get<Promotion>(baseURL + 'promotions?featured=true')
      .pipe(map(promotions => promotions[0]))    
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }
 
}
