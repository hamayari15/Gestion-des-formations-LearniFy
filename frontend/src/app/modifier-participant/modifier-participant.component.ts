import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ParticipantService } from '../core/services/participant.service';

@Component({
  selector: 'app-modifier-participant',
  templateUrl: './modifier-participant.component.html',
  styleUrls: ['./modifier-participant.component.css'],
})
export class ModifierParticipantComponent implements OnInit {
  participantForm!: FormGroup;
  participantId!: string;

  constructor(
    private fb: FormBuilder,
    private participantService: ParticipantService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.participantId = this.route.snapshot.paramMap.get('id') || '';
    this.initForm();
    this.loadParticipantData();
  }

  initForm(): void {
    this.participantForm = this.fb.group({
      fullname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      age: ['', [Validators.required, Validators.min(1)]],
    });
  }

  loadParticipantData(): void {
    this.participantService.getParticipantById(this.participantId).subscribe({
      next: (participant) => {
        this.participantForm.patchValue(participant); 
      },
      error: (err) => {
        console.error(
          'Erreur lors du chargement des données du participant:',
          err
        );
      },
    });
  }

  onSubmit(): void {
    if (this.participantForm.valid) {
      this.participantService
        .updateParticipant(this.participantId, this.participantForm.value)
        .subscribe({
          next: () => {
            this.router.navigate(['admin-interface/liste-participant']);
          },
          error: (err) => {
            console.error('Erreur lors de la mise à jour du participant:', err);
            alert('Erreur lors de la mise à jour.');
          },
        });
    }
  }

  annuler(): void {
    this.router.navigate(['admin-interface/liste-participant']);
  }
}
