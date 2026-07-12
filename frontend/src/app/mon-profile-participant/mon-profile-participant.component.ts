import { Component, OnInit } from '@angular/core';
import { ParticipantService } from '../core/services/participant.service';
import { InscriptionService } from '../core/services/incription.service';
import { environment } from 'src/environments/environment';
import { UserService } from '../core/services/user.service';

@Component({
  selector: 'app-mon-profile-participant',
  templateUrl: './mon-profile-participant.component.html',
  styleUrls: ['./mon-profile-participant.component.css'],
})
export class MonProfileParticipantComponent implements OnInit {

  environment = environment;

  participant: any;
  id!: string;

  loadingParticipant = true;
  loadingStats = true;

  errorMessage: string = '';

  stats = {
    total: 0,
    valide: 0,
    refuse: 0,
    enAttente: 0,
  };

  constructor(
    private participantService: ParticipantService,
    private inscriptionService: InscriptionService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.id = this.userService.getUser().id;

    this.fetchParticipant();
    this.fetchStats();
  }

  fetchParticipant(): void {
    this.loadingParticipant = true;
    this.errorMessage = '';

    this.participantService.getParticipantById(this.id).subscribe({
      next: (data) => {
        this.participant = data;
        this.loadingParticipant = false;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération du participant:', error);
        this.errorMessage =
          error.error?.message ||
          'Impossible de charger les données du profil';
        this.loadingParticipant = false;
      },
    });
  }

  fetchStats(): void {
    this.loadingStats = true;

    this.inscriptionService.getInscriptionStats(this.id).subscribe({
      next: (res: any) => {
        this.stats = res.data.stats;
        this.loadingStats = false;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des stats:', error);
        this.loadingStats = false;
      },
    });
  }

  retry(): void {
    this.fetchParticipant();
    this.fetchStats();
  }

  isParticipantActive(lastLogin: string | Date | null): boolean {
    if (!lastLogin) return false;

    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 7);

    return new Date(lastLogin) >= cutoff;
  }

  getInitials(fullName: string): string {
    if (!fullName) return '?';

    const parts = fullName.trim().split(' ').filter(Boolean);

    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }

    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
}