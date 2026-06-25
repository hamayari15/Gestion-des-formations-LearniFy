import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParticipantService {
  private apiUrl = 'http://localhost:3000/Participant';

  constructor(private http: HttpClient) {}

  getParticipants(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getparticipants`);
  }

  getParticipantsGrowth(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getparticipantsGrowth`);
  }

  getParticipantById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getparticipant/${id}`);
  }

  updateParticipant(id: string, updatedData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/updateparticipant/${id}`, updatedData);
  }

  deleteParticipant(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteparticipant/${id}`);
  }
  
  checkCurrentPassword(participantId: string, actualPassword: string): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/participant/check-password`, { participantId, actualPassword });
  }

  updatePassword(participantId: string, passwordData: { actualPassword: string; newPassword: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/participant/${participantId}/update-password`, passwordData);
  }
}
