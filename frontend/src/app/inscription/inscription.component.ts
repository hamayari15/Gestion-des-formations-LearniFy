import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../core/services/user.service';
import { InscriptionService } from '../core/services/incription.service';
import { FormationService } from '../core/services/formation.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.css'],
})
export class InscriptionComponent implements OnInit {
  theme: string | null = null;
  modeFormation: string | null = null;
  numSalle: string | null = null;
  fullname: string | null = null;
  email: string | null = null;
  entreprise: string = '';
  service: string = '';
  formations: any[] = [];
  errorMessage: string = '';
  participantId: string = '';
  formationid: string | null = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private inscriptionService: InscriptionService,
    private userService: UserService,
    private formationService: FormationService
  ) {}

  ngOnInit() {
    this.getFormations();

    const user = this.userService.getUser();
    this.participantId = user._id;

    this.route.paramMap.subscribe((params) => {
      this.theme = params.get('theme');
      this.numSalle = params.get('numSalle');
      this.formationid = params.get('id');
    });

    this.route.queryParams.subscribe((params) => {
      this.modeFormation = params['modeFormation'];
    });

    if (user) {
      this.fullname = user.fullname;
      this.email = user.email;
    }
  }

  getFormations(): void {
    this.formationService.getFormations().subscribe(
      (data) => {
        this.formations = data;
        console.log('Formations fetched:', this.formations);
        if (this.formations && this.formations.length > 0) {
          this.modeFormation = this.formations[0].modeFormation;
        }
      },
      (error) => {
        this.errorMessage = 'Erreur lors de la récupération des formations';
        console.error('Erreur:', error);
      }
    );
  }

  onSubmit() {
    const inscriptionData = {
      theme: this.theme,
      numSalle: this.numSalle,
      fullname: this.fullname,
      email: this.email,
      service: this.service,
      entreprise: this.entreprise,
      modeFormation: this.modeFormation,
    };

    console.log('Inscription Data:', inscriptionData);

    this.inscriptionService
      .addInscriptions(inscriptionData, this.participantId, this.formationid)
      .subscribe(
        (response) => {
          console.log('Inscription ajoutée avec succès:', inscriptionData);
          Swal.fire({
            icon: 'success',
            title: 'Inscription réussie!',
            text: 'Votre inscription a été ajoutée avec succès.',
            confirmButtonText: 'OK',
          }).then(() => {
            this.router.navigate(['participant-interface/mes-formations']);
          });
        },
        (error) => {
          console.error("Erreur lors de l'ajout de l'inscription:", error);
          Swal.fire({
            icon: 'error',
            title: 'Erreur!',
            text: "Une erreur est survenue lors de l'ajout de l'inscription.",
            confirmButtonText: 'Réessayer',
          });
        }
      );
  }
}
