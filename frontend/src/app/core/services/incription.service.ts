import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InscriptionService {
  private Formation: any;
  private apiUrl = 'http://localhost:3000';

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
      `${this.apiUrl}/Inscription/addInscription/${participantId}/${formationId}`,
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
      `${this.apiUrl}/Inscription/getAllInscriptions`,
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
      `${this.apiUrl}/Inscription/Inscription/stats/${participantId}`
    );
  }

  getInscriptionsByParticipant(participantId: string): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Inscription/getInscriptionsByParticipant/${participantId}`
    );
  }

  updateInscriptionStatus(id: string, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/Inscription/inscriptions/${id}`, {status,});
  }

}
