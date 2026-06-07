import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private apiUrl = 'http://localhost:3000/Admin';

  constructor(private http : HttpClient) { }

  getAdminById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getadmin/${id}`);
  }

  checkCurrentPassword(adminId: string, actualPassword: string): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/admin/check-password`, { adminId, actualPassword });
  }

  updatePassword(adminId: string, passwordData: { actualPassword: string; newPassword: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/${adminId}/update-password`, passwordData);
  }
}
