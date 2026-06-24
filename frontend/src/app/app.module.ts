import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { NgChartsModule } from 'ng2-charts';


import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './features/home/home.component';
import { AboutComponent } from './features/about/about.component';
import { PrivacyComponent } from './features/privacy/privacy.component';
import { ContactComponent } from './contact/contact.component';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { AdminInterfaceComponent } from './admin-interface/admin-interface.component';
import { MonProfileAdminComponent } from './mon-profile-admin/mon-profile-admin.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { CycleFormationsComponent } from './cycle-formations/cycle-formations.component';
import { AddFormationDialogComponent } from './add-formation-dialog/add-formation-dialog.component';
import { ModifierFormationComponent } from './modifier-formation/modifier-formation.component';
import { ListeParticipantsComponent } from './liste-participants/liste-participants.component';
import { ListeInscritsComponent } from './liste-inscrits/liste-inscrits.component';
import { ParticipantInterfaceComponent } from './participant-interface/participant-interface.component';
import { MonProfileParticipantComponent } from './mon-profile-participant/mon-profile-participant.component';
import { InscriptionComponent } from './inscription/inscription.component';
import { MesFormationsComponent } from './mes-formations/mes-formations.component';
import { PagenotfoundComponent } from './features/pagenotfound/pagenotfound.component';
import { formationsenligneComponent } from './formations-enligne/formations-enligne.component';
import { formationspresensielComponent } from './formations-presensiel/formations-presensiel.component';
import { ModifierParticipantComponent } from './modifier-participant/modifier-participant.component';
import { FooterComponent } from './footer/footer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UsersGrowthComponent } from './users-growth/users-growth.component';
import { EditFormationDialogComponent } from './edit-formation-dialog/edit-formation-dialog.component';



@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    AboutComponent,
    PrivacyComponent,
    ContactComponent,
    RegisterComponent,
    LoginComponent,
    AdminInterfaceComponent,
    AdminDashboardComponent,
    MonProfileAdminComponent,
    CycleFormationsComponent,
    ListeParticipantsComponent,
    ListeInscritsComponent,
    ModifierFormationComponent,
    ParticipantInterfaceComponent,
    MonProfileParticipantComponent,
    InscriptionComponent,
    MesFormationsComponent,
    PagenotfoundComponent,
    formationsenligneComponent,
    formationspresensielComponent,
    ModifierParticipantComponent,
    FooterComponent,
    UsersGrowthComponent,
    AddFormationDialogComponent,
    CycleFormationsComponent,
    EditFormationDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatCardModule,
    MatSnackBarModule,
    MatDialogModule,
    NgChartsModule,
    BrowserAnimationsModule
    
  ],
  providers: [],
  bootstrap: [AppComponent], 
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
