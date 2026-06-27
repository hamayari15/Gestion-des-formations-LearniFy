import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getInscriptionsPerTheme() {
    return this.http.get(`${this.baseUrl}/Dashboard/inscriptions-per-theme`);
  }

  getFormationModeDistribution() {
    return this.http.get(`${this.baseUrl}/dashboard/formation-mode`);
  }

  getInscriptionsOverTime() {
    return this.http.get(`${this.baseUrl}/dashboard/inscriptions-over-time`);
  }
}