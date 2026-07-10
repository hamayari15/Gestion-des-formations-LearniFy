import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InscriptionService } from '../core/services/incription.service';
import { UserService } from '../core/services/user.service';

@Component({
  selector: 'app-mes-formations',
  templateUrl: './mes-formations.component.html',
  styleUrls: ['./mes-formations.component.css'],
})
export class MesFormationsComponent implements OnInit {
  inscriptions: any[] = [];
  participantid: string = '';

  loading: boolean = false;
  errorMessage: string = '';

  constructor(
    private inscriptionService: InscriptionService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.participantid = this.userService.getUser().id;
    this.getInscriptions();
  }

  getInscriptions(): void {
    this.loading = true;
    this.errorMessage = '';
 
    this.inscriptionService.getInscriptionsByParticipant(this.participantid).subscribe({
      next: (response: any) => {
        console.log(response)
        this.inscriptions = response.data.inscriptions;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage =
          error.error?.message || 'Erreur lors de la récupération des inscriptions';
      }
    });
  }
}