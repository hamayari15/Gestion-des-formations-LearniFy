import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminGuard } from './core/guards/auth.guard.admin';
import { ParticipantGuard } from './core/guards/auth.guard.participant';


import { AdminChildrensGuard } from './core/guards/admin-childrens.guard';
import { ParticipantChildrensGuard } from './core/guards/participant-childrens.guard';

import { HomeComponent } from './features/home/home.component';
import { AboutComponent } from './features/about/about.component';
import { PrivacyComponent } from './features/privacy/privacy.component';
import { ContactComponent } from './contact/contact.component';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { FooterComponent } from './footer/footer.component';

import { AdminInterfaceComponent } from './admin-interface/admin-interface.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { CycleFormationsComponent } from './cycle-formations/cycle-formations.component';
import { AddFormationDialogComponent } from './add-formation-dialog/add-formation-dialog.component';
import { EditFormationDialogComponent } from './edit-formation-dialog/edit-formation-dialog.component';
import { ListeParticipantsComponent } from './liste-participants/liste-participants.component';
import { EditParticipantDialogComponent } from './edit-participant-dialog/edit-participant-dialog.component';
import { UsersGrowthComponent } from './users-growth/users-growth.component';
import { ListeInscritsComponent } from './liste-inscrits/liste-inscrits.component';
import { AdminMessagesComponent } from './admin-messages/admin-messages.component';
import { AdminProfileSettingsComponent } from './admin-profile-settings/admin-profile-settings.component';

import { ParticipantInterfaceComponent } from './participant-interface/participant-interface.component';
import { MonProfileParticipantComponent } from './mon-profile-participant/mon-profile-participant.component';
import { ChangePasswordDialogComponent } from './change-password-dialog/change-password-dialog.component';
import { FormationsDisponiblesComponent } from './formations-disponibles/formations-disponibles.component';
import { InscriptionDialogComponent } from './inscription-dialog/inscription-dialog.component';
import { MesFormationsComponent } from './mes-formations/mes-formations.component';
import { PagenotfoundComponent } from './features/pagenotfound/pagenotfound.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'privacy', component: PrivacyComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'login', component: LoginComponent },
  { path: 'footer', component: FooterComponent },

  {
    path: 'admin-interface',
    component: AdminInterfaceComponent,
    canActivate: [AdminGuard],
    canActivateChild: [AdminChildrensGuard],
    children: [
      {
        path: '',
        redirectTo: 'cycle-formation',
        pathMatch: 'full',
      },
      { path: 'admin-dashboard', component: AdminDashboardComponent },
      { path: 'cycle-formations', component: CycleFormationsComponent },
      { path: 'add-formation-dialog', component: AddFormationDialogComponent },
      { path: 'edit-formation-dialog', component: EditFormationDialogComponent },
      { path: 'liste-participant', component: ListeParticipantsComponent},
      { path: 'edit-participant-dialog', component: EditParticipantDialogComponent},
      { path: 'users-growth', component: UsersGrowthComponent },
      { path: 'liste-inscrits', component: ListeInscritsComponent },
      { path: 'admin-messages', component: AdminMessagesComponent },
      { path: 'admin-profile-settings', component: AdminProfileSettingsComponent },
    ],
  },

  {
    path: 'participant-interface',
    component: ParticipantInterfaceComponent,
    canActivate: [ParticipantGuard],
    canActivateChild: [ParticipantChildrensGuard],
    children: [
      {
        path: '',
        redirectTo: 'mon-profile-participant',
        pathMatch: 'full',
      },
      { path: 'mon-profile-participant', component: MonProfileParticipantComponent },
      { path: 'change-password-dialog', component: ChangePasswordDialogComponent },
      { path: 'formations-disponibles', component: FormationsDisponiblesComponent},
      { path: 'inscription-dialog', component: InscriptionDialogComponent },
      { path: 'mes-formations', component: MesFormationsComponent},
    ],
  },

  { path: 'pagenotfound', component: PagenotfoundComponent },
  { path: '**', redirectTo: '/pagenotfound' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top',
      anchorScrolling: 'enabled'
    })
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
