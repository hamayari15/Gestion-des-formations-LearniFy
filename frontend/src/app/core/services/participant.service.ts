import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParticipantService {

  private apiUrl = `${environment.apiUrl}/Participant`;

  constructor(private http: HttpClient) {}

  getParticipants(
    page: number = 1,
    limit: number = 5,
    search: string = '',
    status: string = ''
  ): Observable<any> {

    return this.http.get(
      `${this.apiUrl}/getParticipants`,
      {
        params: {
          page,
          limit,
          search,
          status
        }
      }
    );

  }

  getParticipantsGrowth(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getParticipantsGrowth`);
  }

  getActiveInactiveStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stats/active-inactive`);
  }

  getParticipantById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getParticipant/${id}`);
  }

  updateParticipant(id: string, updatedData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/updateParticipant/${id}`, updatedData);
  }

  deleteParticipant(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteParticipant/${id}`);
  }

};
