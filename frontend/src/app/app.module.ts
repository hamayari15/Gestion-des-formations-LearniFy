import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';


import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { LocationComponent } from './location/location.component';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { AdminInterfaceComponent } from './admin-interface/admin-interface.component';
import { MonProfileAdminComponent } from './mon-profile-admin/mon-profile-admin.component';
import { CycleFormationComponent } from './cycle-formation/cycle-formation.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ListeFormationsComponent } from './liste-formations/liste-formations.component';
import { AddFormationComponent } from './add-formation/add-formation.component';
import { ModifierFormationComponent } from './modifier-formation/modifier-formation.component';
import { ListeParticipantsComponent } from './liste-participants/liste-participants.component';
import { ListeInscritsComponent } from './liste-inscrits/liste-inscrits.component';
import { ParticipantInterfaceComponent } from './participant-interface/participant-interface.component';
import { MonProfileParticipantComponent } from './mon-profile-participant/mon-profile-participant.component';
import { InscriptionComponent } from './inscription/inscription.component';
import { MesFormationsComponent } from './mes-formations/mes-formations.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { formationsenligneComponent } from './formations-enligne/formations-enligne.component';
import { formationspresensielComponent } from './formations-presensiel/formations-presensiel.component';
import { ModifierParticipantComponent } from './modifier-participant/modifier-participant.component';



@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    AboutComponent,
    LocationComponent,
    RegisterComponent,
    LoginComponent,
    AdminInterfaceComponent,
    AdminDashboardComponent,
    MonProfileAdminComponent,
    CycleFormationComponent,
    ListeParticipantsComponent,
    ListeInscritsComponent,
    ListeFormationsComponent,
    AddFormationComponent,
    ModifierFormationComponent,
    ParticipantInterfaceComponent,
    MonProfileParticipantComponent,
    InscriptionComponent,
    MesFormationsComponent,
    PagenotfoundComponent,
    formationsenligneComponent,
    formationspresensielComponent,
    ModifierParticipantComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgChartsModule
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
