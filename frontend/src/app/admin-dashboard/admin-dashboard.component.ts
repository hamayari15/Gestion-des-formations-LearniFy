import { Component, OnInit } from '@angular/core';
import { FormationService } from '../core/services/formation.service';
import { InscriptionService } from '../core/services/incription.service';
import { ParticipantService } from '../core/services/participant.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent implements OnInit {

  totalFormations: number = 0;
  totalInscriptions: number = 0;
  totalParticipants: number = 0;

  constructor(
    private inscriptionService: InscriptionService,
    private formationService: FormationService,
    private participantService: ParticipantService
  ) {}

  ngOnInit(): void {
    this.fetchTotalFormations();
    this.fetchTotalInscriptions();
    this.fetchTotalParticipants();
  }

  fetchTotalFormations(): void {
    this.formationService.getFormations().subscribe((res: any) => {
      this.totalFormations = res.data.totalItems;
    });
  }

  fetchTotalInscriptions(): void {
    this.inscriptionService.getInscriptions().subscribe((inscriptions) => {
      this.totalInscriptions = inscriptions.length;
    });
  }

  fetchTotalParticipants(): void {
    this.participantService.getParticipants().subscribe((participants) => {
      this.totalParticipants = participants.length;
    });
  }

};