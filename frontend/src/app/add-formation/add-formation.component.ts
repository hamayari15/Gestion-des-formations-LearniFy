import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormationService } from '../services/formation.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-add-formation',
  templateUrl: './add-formation.component.html',
  styleUrls: ['./add-formation.component.css'],
})
export class AddFormationComponent {
  formationForm: FormGroup;
  
  constructor(
    private fb: FormBuilder,
    private formationService: FormationService,
    private router: Router
  ) {
    this.formationForm = this.fb.group({
      numSalle: [null],
      creditImpot: [false],
      droitIndividuel: [false],
      droitCollectif: [false],
      theme: [null, [Validators.required]],
      modeFormation: [null, [Validators.required]],
      periodeDu: [null, [Validators.required]],
      periodeA: [null, [Validators.required]],
      horaireDu: [null, [Validators.required]],
      horaireA: [null, [Validators.required]],
    });
  }
  addFormation() {
    if (this.formationForm.valid) {
      this.formationService.addFormation(this.formationForm.value).subscribe(
         (response) => {
                Swal.fire({
                  icon: 'success',
                  title: 'Success',
                  text: 'Formation ajoutée avec succées!',
                });
  
          this.formationForm.reset();
  
          setTimeout(() => {
            this.router.navigate(['admin-interface/liste-formations']);
          }, 2000);
        },
        (error) => {
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: "Erreur lors de l'ajout de formation!",
                });
          console.error("Erreur", error);          
        }
    )
  }}
};
      
  

