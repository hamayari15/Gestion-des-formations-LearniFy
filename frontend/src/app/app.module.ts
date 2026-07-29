import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';


import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './features/home/home.component';
import { AboutComponent } from './features/about/about.component';
import { PrivacyComponent } from './features/privacy/privacy.component';
import { ContactComponent } from './contact/contact.component';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
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
import { FormationsDisponiblesComponent } from './formations-disponibles/formations-disponibles.component';
import { InscriptionDialogComponent } from './inscription-dialog/inscription-dialog.component';
import { MesFormationsComponent } from './mes-formations/mes-formations.component';
import { PagenotfoundComponent } from './features/pagenotfound/pagenotfound.component';
import { ChangePasswordDialogComponent } from './change-password-dialog/change-password-dialog.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    HomeComponent,
    AboutComponent,
    PrivacyComponent,
    ContactComponent,
    RegisterComponent,
    LoginComponent,
    AdminInterfaceComponent,
    AdminDashboardComponent,
    CycleFormationsComponent,
    AddFormationDialogComponent,
    EditFormationDialogComponent,
    ListeParticipantsComponent,
    EditParticipantDialogComponent,
    UsersGrowthComponent,
    ListeInscritsComponent,
    AdminMessagesComponent,
    AdminProfileSettingsComponent,
    ParticipantInterfaceComponent,
    MonProfileParticipantComponent,
    FormationsDisponiblesComponent,
    InscriptionDialogComponent,
    MesFormationsComponent,
    PagenotfoundComponent,
    ChangePasswordDialogComponent,
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
    BrowserAnimationsModule,
    TranslateModule.forRoot({
    loader: {
      provide: TranslateLoader,
      useFactory: HttpLoaderFactory,
      deps: [HttpClient]
    }
  })
    
  ],
  providers: [],
  bootstrap: [AppComponent], 
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
