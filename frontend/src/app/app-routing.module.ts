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
import { CycleFormationComponent } from './cycle-formation/cycle-formation.component';
import { ListeFormationsComponent } from './liste-formations/liste-formations.component';
import { AddFormationComponent } from './add-formation/add-formation.component';
import { ModifierFormationComponent } from './modifier-formation/modifier-formation.component';
import { ListeInscritsComponent } from './liste-inscrits/liste-inscrits.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { MonProfileAdminComponent } from './mon-profile-admin/mon-profile-admin.component';

import { ParticipantInterfaceComponent } from './participant-interface/participant-interface.component';
import { MonProfileParticipantComponent } from './mon-profile-participant/mon-profile-participant.component';
import { choisirFormationComponent } from './choisir-formation/choisir-formation.component';
import { InscriptionComponent } from './inscription/inscription.component';
import { PagenotfoundComponent } from './features/pagenotfound/pagenotfound.component';
import { MesFormationsComponent } from './mes-formations/mes-formations.component';
import { ListeParticipantsComponent } from './liste-participants/liste-participants.component';
import { formationsenligneComponent } from './formations-enligne/formations-enligne.component';
import { formationspresensielComponent } from './formations-presensiel/formations-presensiel.component';
import { ModifierParticipantComponent } from './modifier-participant/modifier-participant.component';

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
        path: 'admin-interface',
        redirectTo: 'admin-interface/cycle-formation',
        pathMatch: 'full',
      },
      { path: 'mon-profile-admin', component: MonProfileAdminComponent },
      { path: 'admin-dashboard', component: AdminDashboardComponent },
      { path: 'cycle-formation', component: CycleFormationComponent },
      { path: 'liste-formations', component: ListeFormationsComponent },
      { path: 'modifier-formation/:id', component: ModifierFormationComponent },
      { path: 'add-formation', component: AddFormationComponent },
      { path: 'liste-participant', component: ListeParticipantsComponent},
      { path: 'modifier-participant/:id', component: ModifierParticipantComponent},
      { path: 'liste-inscrits', component: ListeInscritsComponent },
    ],
  },

  {
    path: 'participant-interface',
    component: ParticipantInterfaceComponent,
    canActivate: [ParticipantGuard],
    canActivateChild: [ParticipantChildrensGuard],
    children: [
      {
        path: 'participant-interface',
        redirectTo: 'participant-interface/mon-profile-participant/:id',
        pathMatch: 'full',
      },
      { path: 'mon-profile-participant', component: MonProfileParticipantComponent },
      { path: 'inscription/:theme/:numSalle/:id', component: InscriptionComponent },
      { path: 'choisir-formation', component: choisirFormationComponent },
      { path: 'formations-presensiel', component: formationspresensielComponent},
      { path: 'formations-enligne', component: formationsenligneComponent},
      { path: 'mes-formations', component: MesFormationsComponent},
    ],
  },

  { path: 'pagenotfound', component: PagenotfoundComponent },
  { path: '**', redirectTo: '/pagenotfound' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
