import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FormationService {
  private apiUrl = 'http://localhost:3000/Formation';

  constructor(private http: HttpClient) {}

  addFormation(formation: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, formation);
  }

  getFormations(page: number = 1, limit: number = 5, search: string = '', mode: string = ''): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/getall`,
      {
        params: {
          page,
          limit,
          search,
          mode
        }
      }
    );
  }
  
  getFormationsbyParId(participanrId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/getmyformation/${participanrId}`);
  }

  getFormationById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getformation/${id}`);
  }

  updateFormation(id: string, formation: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, formation);
  }

  deleteFormation(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }

  updateFormationStatus(id: string, status: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/updateStatus/${id}`, { status });
  }
}
