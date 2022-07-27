import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Comment } from './comments.model';
import { environment } from 'src/environments/environment';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  
  baseUrl = environment.baseUrl

  constructor(private httpClient: HttpClient) { }

  getComments(): Observable<Comment[]> {
    const url = `${this.baseUrl}/getComments`;

    return this.httpClient.get<Comment[]>(url).pipe(
      map(response => response)
    );
  }

}
