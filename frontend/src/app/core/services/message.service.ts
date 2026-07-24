import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
}

export interface Message {
  _id: string;
  name: string;
  email: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  createdAt: string;
}

export interface MessagesResponse {
  success: boolean;
  data: Message[];
  pagination: { total: number; page: number; pages: number };
}

@Injectable({ providedIn: 'root' })

export class MessageService {
  private readonly baseUrl = `${environment.apiUrl}/Message`;

  constructor(private http: HttpClient) {}

  sendMessage(payload: ContactPayload): Observable<any> {
    return this.http.post(`${this.baseUrl}/participant/sendMessage`, payload);
  }

  getAll(page = 1, limit = 20, status?: string): Observable<MessagesResponse> {
    let params = new HttpParams().set('page', page).set('limit', limit);
    if (status) params = params.set('status', status);
    return this.http.get<MessagesResponse>(`${this.baseUrl}/admin/getMessages`, { params });
  }

  updateStatus(id: string, status: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/admin/updateStatus/${id}/status`, { status });
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/admin/deleteMessage/${id}`);
  }
}