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

  setformation(formation: any) {
    this.Formation = formation;
  }

  getformation() {
    return this.Formation;
  }

  register(inscriptionData: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/participants/register`,
      inscriptionData
    );
  }

  addInscriptions(inscriptionData: any, participanrId: string, formationid: string | null): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/Inscription/addinscription/${participanrId}/${formationid}`, inscriptionData);
  }

  getInscriptions(
    page: number = 1,
    limit: number = 5,
    search: string = '',
    sort: string = 'desc'
  ): Observable<any> {

    return this.http.get<any>(
      `${this.apiUrl}/Inscription/getinscriptions`,
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

  getInscriptionsByParticipant(participantId: string): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/Inscription/participant/${participantId}`
    );
  }

  // getInscriptionById(id: string): Observable<any> {
  //   return this.http.get<any>(`${this.apiUrl}/Inscription/getinscription/${id}`);
  // }

  updateInscriptionStatus(id: string, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/Inscription/inscriptions/${id}`, {status,});
  }

  // patchInscriptionStatus(id: string, status: string): Observable<any> {
  //   return this.http.patch(`${this.apiUrl}/Inscription/updatestatus/${id}`, {status});
  // }
}
