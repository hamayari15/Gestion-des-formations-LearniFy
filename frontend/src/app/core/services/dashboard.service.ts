import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private baseUrl = `${environment.apiUrl}/Dashboard`;

  constructor(private http: HttpClient) { }

  getInscriptionsByStatus() {
    return this.http.get(`${this.baseUrl}/inscriptions-by-status`);
  }

  getFormationModeDistribution() {
    return this.http.get(`${this.baseUrl}/formation-mode`);
  }

  getInscriptionsOverTime() {
    return this.http.get(`${this.baseUrl}/inscriptions-over-time`);
  }
}