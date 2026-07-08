import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private apiUrl = `${environment.apiUrl}/Admin`;

  constructor(private http : HttpClient) { }

  getAdminById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getAdmin/${id}`);
  }

  checkCurrentPassword(adminId: string, actualPassword: string): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/check-password`, { adminId, actualPassword });
  }

  updatePassword(adminId: string, passwordData: { actualPassword: string; newPassword: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/${adminId}/update-password`, passwordData);
  }
}
