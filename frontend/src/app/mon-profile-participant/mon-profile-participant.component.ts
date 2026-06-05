import { Component, OnInit } from '@angular/core';
import { ParticipantService } from '../services/participant.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-mon-profile-participant',
  templateUrl: './mon-profile-participant.component.html',
  styleUrls: ['./mon-profile-participant.component.css'],
})
export class MonProfileParticipantComponent implements OnInit {
  participant: any;
  actualPassword: string = '';
  newPassword: string = '';
  confirmNewPassword: string = '';
  successmsg: string = '';
  errormsg: string = '';
  id!: string;


  constructor(private participantService: ParticipantService, private route: ActivatedRoute, private userService : UserService) {}

  ngOnInit(): void {
    this.id = this.userService.getUser()._id
     this.participantService.getParticipantById(this.id).subscribe(
      (data) => {
        this.participant = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération du participant:', error);
      }
    );
  }

  updatePassword(): void {
    if (this.newPassword !== this.confirmNewPassword) {
      console.error('Les mots de passe ne correspondent pas.');
      this.errormsg = 'Les mots de passe ne correspondent pas.';
      return;
    }

    this.participantService
      .checkCurrentPassword(this.participant._id, this.actualPassword)
      .subscribe(
        (isValid: boolean) => {
          if (!isValid) {
            this.errormsg = 'Le mot de passe actuel est incorrect.';
            return;
          }

          this.participantService
            .updatePassword(this.participant._id, {
              actualPassword: this.actualPassword,
              newPassword: this.newPassword,
            })
            .subscribe(
              () => {
                console.log('Mot de passe mis à jour avec succès.');

                 Swal.fire({
                                  icon: 'success',
                                  title: 'Succès',
                                  text: 'Mot de passe mis à jour avec succès.',
                                });

                this.successmsg = 'Mot de passe mis à jour avec succès';
                this.actualPassword = '';
                this.newPassword = '';
                this.confirmNewPassword = '';
                this.errormsg = '';
                this.successmsg = '';
              },
              (error) => {
                console.error(
                  'Erreur lors de la mise à jour du mot de passe:',
                  error
                );
                this.errormsg =
                  'Erreur lors de la mise à jour du mot de passe.';
              }
            );
        },
        (error) => {
          console.error(
            'Erreur lors de la vérification du mot de passe actuel:',
            error
          );
          this.errormsg =
            'Erreur lors de la vérification du mot de passe actuel.';
        }
      );
  }
}
