import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormationService } from '../core/services/formation.service';
import { InscriptionService } from '../core/services/incription.service';
import { UserService } from '../core/services/user.service';

@Component({
  selector: 'app-mes-formations',
  templateUrl: './mes-formations.component.html',
  styleUrls: ['./mes-formations.component.css'],
})
export class MesFormationsComponent implements OnInit {
  theme: string | null = null;
  numSalle: string | null = null;
  modeFormation: string | null = null;
  formations: any[] = [];
  inscriptions: any[] = [];
  participantid: string = '';

  inscriptionStatus: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private formationService: FormationService,
    private inscriptionService: InscriptionService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.participantid = this.userService.getUser()._id;
    this.getFormations();
    this.getInscriptions();
  }

  getFormations(): void {
    this.formationService.getFormationsbyParId(this.participantid).subscribe(
      (data) => {
        this.formations = data;
        console.log('Fetched formations:', this.formations);
      },
      (error) => {
        console.error('Error fetching formations:', error);
      }
    );
  }

  getInscriptions(): void {
    this.inscriptionService.getInscriptions().subscribe(
      (data) => {
        this.inscriptions = data;
        if (this.inscriptions.length > 0) {
          this.inscriptionStatus = this.inscriptions[0].status;
        }
        console.log('Fetched inscriptions:', this.inscriptions);
      },
      (error) => {
        console.error('Error fetching inscriptions:', error);
      }
    );
  }

  gotoformatioenligne() {
    this.router.navigate(['participant-interface/formations-enligne']);
  }

  gotoformatioenpresentielle() {
    this.router.navigate(['participant-interface/formations-presensiel']);
  }
}
