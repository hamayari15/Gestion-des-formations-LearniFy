import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormationService } from '../core/services/formation.service';
import { InscriptionService } from '../core/services/incription.service';

@Component({
  selector: 'app-participants',
  templateUrl: './formations-presensiel.component.html',
  styleUrls: ['./formations-presensiel.component.css'],
})
export class formationspresensielComponent implements OnInit {
  formations: any[] = [];

  constructor(
    private formationService: FormationService,
    private router: Router,
    private incriptionService: InscriptionService
  ) {}

  ngOnInit() {
    this.getFormations();
  }

  getFormations() {
    this.formationService.getFormations().subscribe(
      (response: any) => {
        this.formations = response;
        console.log('Formations:', response);
      },
      (error: any) => {
        console.error('Error getting formations:', error);
      }
    );
  }

  inscrire(formation: any) {
    console.log(formation);
    this.incriptionService.setformation(formation);
    this.router.navigate([
      'participant-interface/inscription/',
      formation.theme,
      formation.numSalle,
      formation._id,
    ]);
  }
}
