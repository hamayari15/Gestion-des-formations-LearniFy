import { Component, OnInit } from '@angular/core';
import { UserService } from '../core/services/user.service';
import { ParticipantService } from '../core/services/participant.service';
import { InscriptionService } from '../core/services/incription.service';
import { AuthService } from '../core/services/auth.service';
import { environment } from 'src/environments/environment';

import Swal from 'sweetalert2';
import { Router } from '@angular/router';

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
    private userService: UserService,
    private participantService: ParticipantService,
    private inscriptionService: InscriptionService,
    private authService: AuthService,
    private router: Router
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

  deleteAccount(id: string): void {
    Swal.fire({
      icon: 'warning',
      title: 'Supprimer votre compte ?',
      text: 'Cette action est irréversible.',
      width: 550,
      showCancelButton: true,
      confirmButtonText: 'Supprimer',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#dc2626',
    }).then((result) => {
      if (!result.isConfirmed) return;

      this.participantService.deleteParticipant(id).subscribe({
        next: (response: any) => {
          Swal.fire({
            icon: 'success',
            title: 'Compte supprimé',
            text: response.message,
            width: 500,
            timer: 2000,
            timerProgressBar: true,
          }).then(() => {
            this.authService.logout();
            this.router.navigate(['/login']);
          });
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: error?.error?.message || 'Une erreur est survenue lors de la suppression.',
            width: 500,
          });
        },
      });
    });
  }
}