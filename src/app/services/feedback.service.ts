import { Injectable } from '@angular/core';
import { Feedback } from '../shared/feedback';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { baseURL } from '../shared/baseurl';
import { catchError} from 'rxjs/operators';

import { ProcessHttpmsgService } from './process-httpmsg.service';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(private http: HttpClient,
    private processHTTPMsgService: ProcessHttpmsgService) { }

    submitFeedback(feedback: Feedback): Observable<Feedback> {
      return this.http.post<Feedback>(baseURL + 'feedback', feedback)
      .pipe(catchError(this.processHTTPMsgService.handleError));
    }


}