import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FormationService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  addFormation(formation: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/Formation/add`, formation);
  }

 getFormations(page: number = 1, limit: number = 5, search: string = '', mode: string = ''): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/Formation/getall`,
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
    return this.http.get(`${this.apiUrl}/Formation/getmyformation/${participanrId}`);
  }

  getFormationById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Formation/getformation/${id}`);
  }

  updateFormation(id: string, formation: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/Formation/update/${id}`, formation);
  }

  deleteFormation(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/Formation/delete/${id}`);
  }

  updateFormationStatus(id: string, status: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/Formation/updateStatus/${id}`, { status });
  }
}
