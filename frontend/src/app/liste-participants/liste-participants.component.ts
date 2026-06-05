import { Component, OnInit } from '@angular/core';
import { ParticipantService } from '../services/participant.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-liste-participants',
  templateUrl: './liste-participants.component.html',
  styleUrls: ['./liste-participants.component.css'],
})
export class ListeParticipantsComponent implements OnInit {
  participants: any[] = [];

  constructor(
    private participantService: ParticipantService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchParticipants();
  }

  fetchParticipants(): void {
    this.participantService.getParticipants().subscribe({
      next: (data) => {
        this.participants = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des participants:', err);
      },
    });
  }

  onUpdate(id: string): void {
    this.router.navigate(['admin-interface/modifier-participant', id]);
  }

  onDelete(id: string): void {
    const confirmDelete = confirm(
      'Êtes-vous sûr de vouloir supprimer ce participant ?'
    );
    if (confirmDelete) {
      this.participantService.deleteParticipant(id).subscribe({
        next: () => {
          this.fetchParticipants();
        },
        error: (err) => {
          console.error('Erreur lors de la suppression:', err);
          alert('Erreur lors de la suppression.');
        },
      });
    }
  }
}
