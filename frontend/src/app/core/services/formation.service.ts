import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FormationService {
  
  private apiUrl = `${environment.apiUrl}/Formation`;

  constructor(private http: HttpClient) {}

  addFormation(formation: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/Add`, formation);
  }

  getFormations(page: number = 1, limit: number = 5, search: string = '', mode: string = ''): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/getAll`,
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
    return this.http.get(`${this.apiUrl}/getMyFormation/${participanrId}`);
  }

  getFormationById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getFormation/${id}`);
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
