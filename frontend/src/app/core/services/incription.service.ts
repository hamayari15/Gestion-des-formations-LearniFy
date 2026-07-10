import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InscriptionService {

  private Formation: any;
  private apiUrl = `${environment.apiUrl}/Inscription`;

  constructor(private http: HttpClient) {}

  addInscription(
    inscriptionData: {
      fullName: string;
      email: string;
      entreprise: string;
      service: string;
    },
    participantId: string,
    formationId: string
  ): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/addInscription/${participantId}/${formationId}`,
      inscriptionData
    );
  }

  getInscriptions(
    page: number = 1,
    limit: number = 5,
    search: string = '',
    sort: string = 'desc'
  ): Observable<any> {

    return this.http.get<any>(
      `${this.apiUrl}/getAllInscriptions`,
      {
        params: {
          page,
          limit,
          search,
          sort
        }
      }
    );

  }

  getInscriptionStats(participantId: string): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/stats/${participantId}`
    );
  }

  getInscriptionsByParticipant(participantId: string): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/getInscriptionsByParticipant/${participantId}`
    );
  }

  updateInscriptionStatus(id: string, status: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/updateStatus/${id}`, {status,});
  }

}
