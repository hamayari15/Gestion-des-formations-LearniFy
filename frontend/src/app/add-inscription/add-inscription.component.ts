// import { Component } from '@angular/core';
// import { Router } from '@angular/router';
// import { InscriptionService } from '../services/incription.service';

// @Component({
//   selector: 'app-add-inscription',
//   templateUrl: './add-inscription.component.html',
//   styleUrls: ['./add-inscription.component.css'],
// })
// export class AddInscriptionComponent {
//   inscriptionData = {
//     fullname: '',
//     email: '',
//     numero: '',
//     entreprise: '',
//     direction: '',
//     theme: '',
//   };

//   constructor(
//     private inscriptionService: InscriptionService,
//     private router: Router
//   ) {}

//   addInscription() {
//     if (
//       !this.inscriptionData.fullname ||
//       !this.inscriptionData.email ||
//       !this.inscriptionData.numero ||
//       !this.inscriptionData.entreprise ||
//       !this.inscriptionData.direction ||
//       !this.inscriptionData.theme
//     ) {
//       console.error('Please fill all fields');
//       return;
//     }

//     this.inscriptionService.addInscriptions(this.inscriptionData).subscribe(
//       (response) => {
//         console.log('Inscription added successfully:', response);
//       },
//       (error) => {
//         console.error('Error adding inscription:', error);
//       }
//     );
//   }
// }
