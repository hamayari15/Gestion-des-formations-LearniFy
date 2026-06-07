import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormationService } from '../core/services/formation.service';

@Component({
  selector: 'app-modifier-formation',
  templateUrl: './modifier-formation.component.html',
  styleUrls: ['./modifier-formation.component.css'],
})
export class ModifierFormationComponent implements OnInit {
  formationForm: FormGroup;
  id!: string;

  constructor(
    private route: ActivatedRoute,
    private formationService: FormationService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.formationForm = this.fb.group({
      theme: ['', Validators.required],
      numSalle: ['', Validators.required],
      modeFormation: ['', Validators.required],
      periodeDu: ['', Validators.required],
      periodeA: ['', Validators.required],
      horaireDu: ['', Validators.required],
      horaireA: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    this.getFormationDetails(this.id);
  }

  getFormationDetails(id: string): void {
    this.formationService.getFormationById(id).subscribe(
      (data) => {
        this.formationForm.patchValue(data);
      },
      (error) => {
        console.error(
          'Erreur lors de la récupération des détails de la formation',
          error
        );
      }
    );
  }

  onSubmit(): void {
    if (this.formationForm.valid) {
      this.formationService
        .updateFormation(this.id, this.formationForm.value)
        .subscribe(
          () => {
            console.log('Formation mise à jour avec succès');
            this.router.navigate(['admin-interface/liste-formations']);
          },
          (error) => {
            console.error(
              'Erreur lors de la mise à jour de la formation',
              error
            );
          }
        );
    }
  }

  annuler(): void {
    this.router.navigate(['admin-interface/liste-formations']);
  }
}
