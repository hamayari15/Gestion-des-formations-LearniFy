import { Component, OnInit } from '@angular/core';
import { ParticipantService } from '../core/services/participant.service';
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

  constructor(
    private participantService: ParticipantService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.id = this.userService.getUser().id;
    console.log(this.userService.getUser());

    this.participantService.getParticipantById(this.id).subscribe(
      (data) => {
        this.participant = data;
        console.log(this.participant);
      },
      (error) => {
        console.error('Erreur lors de la récupération du participant:', error);
      }
    );
  }
}