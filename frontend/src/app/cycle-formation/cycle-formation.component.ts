import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { FormationService } from '../services/formation.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cycle-formation',
  templateUrl: './cycle-formation.component.html',
  styleUrls: ['./cycle-formation.component.css'],
})
export class CycleFormationComponent {
  theme: string = '';
  modeFormation: string = '';
  numSalle: number = 0;
  creditImpot: boolean = false;
  droitIndividuel: boolean = false;
  droitCollectif: boolean = false;
  periodeDu: string = '';
  periodeA: string = '';
  horaireDu: string = '';
  horaireA: string = '';

  constructor(
    private formationService: FormationService,
    private router: Router
  ) {}

  addFormation() {
    const formation = {
      theme: this.theme,
      modeFormation: this.modeFormation,
      numSalle: this.numSalle,
      creditImpot: this.creditImpot,
      droitIndividuel: this.droitIndividuel,
      droitCollectif: this.droitCollectif,
      periodeDu: this.periodeDu,
      periodeA: this.periodeA,
      horaireDu: this.horaireDu,
      horaireA: this.horaireA,
    };

    this.formationService.addFormation(formation).subscribe(
      (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Formation ajoutée avec succées!',
        });
        this.router.navigate(['admin-interface/liste-formations']);
        console.log('Formation added:', response);
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: "Erreur lors de l'ajout la formation!",
        });
        console.error('Error:', error);
      }
    );
  }
}
