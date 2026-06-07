import { Component, OnInit } from '@angular/core';
import { FormationService } from '../core/services/formation.service';
import { InscriptionService } from '../core/services/incription.service';
import { ParticipantService } from '../core/services/participant.service';
import { ChartConfiguration, ChartType } from 'chart.js';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent implements OnInit {
  ageData: number[] = [0, 0, 0];
  genderData: number[] = [0, 0];
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
  };

  public ageChartData: ChartConfiguration['data'] = {
    labels: ['18-25', '26-35', '36-45', '46+'],
    datasets: [
      {
        label: 'Age Distribution',
        data: this.ageData,
        backgroundColor: [
          'rgb(0, 123, 255)',
          'rgb(138, 43, 226)',
          'rgb(255, 165, 0)',
          'rgb(255, 0, 127)',
        ],

        hoverOffset: 4,
      },
    ],
  };

  public genderChartData: ChartConfiguration['data'] = {
    labels: ['male', 'female'],
    datasets: [
      {
        label: 'Gender Distribution',
        data: this.genderData,
        backgroundColor: ['rgb(230, 126, 126)', 'rgb(126, 192, 192)'],
        hoverOffset: 4,
      },
    ],
  };

  public chartType: ChartType = 'pie';

  totalFormations: number = 0;
  totalInscriptions: number = 0;
  totalParticipants: number = 0;
  participants: any[] = [];

  constructor(
    private inscriptionService: InscriptionService,
    private formationService: FormationService,
    private participantService: ParticipantService
  ) {}

  ngOnInit(): void {
    this.fetchTotalFormations();
    this.fetchTotalInscriptions();
    this.fetchTotalParticipants();
  }

  fetchTotalFormations(): void {
    this.formationService.getFormations().subscribe((formations) => {
      this.totalFormations = formations.length;
    });
  }

  fetchTotalInscriptions(): void {
    this.inscriptionService.getInscriptions().subscribe((inscriptions) => {
      this.totalInscriptions = inscriptions.length;
    });
  }

  fetchTotalParticipants(): void {
    this.participantService.getParticipants().subscribe((participants) => {
      this.totalParticipants = participants.length;
      this.participants = participants;
      console.log(this.participants);
      this.calculateAgeDistribution();
      this.calculateGenderDistribution();
    });
  }

  calculateAgeDistribution(): void {
    this.ageData = [0, 0, 0, 0];
    this.participants.forEach((participant) => {
      const age = participant.age;
      if (age === undefined || age === null) return;

      if (age >= 18 && age <= 25) this.ageData[0]++;
      else if (age >= 26 && age <= 35) this.ageData[1]++;
      else if (age >= 36 && age <= 45) this.ageData[2]++;
      else if (age >= 46) this.ageData[3]++;
    });

    this.ageChartData = {
      ...this.ageChartData,
      datasets: [
        {
          label: 'Age Distribution',
          data: this.ageData,
          backgroundColor: [
            'rgb(52, 141, 201)',
            'rgb(138, 43, 226)',
            'rgb(255, 165, 0)',
            'rgb(99, 188, 104)',
          ],
          hoverOffset: 4,
        },
      ],
    };
  }

  calculateGenderDistribution(): void {
    this.genderData = [0, 0];
    this.participants.forEach((participant) => {
      if (participant.gender === 'male') this.genderData[0]++;
      else if (participant.gender === 'female') this.genderData[1]++;
    });

    console.log(this.genderData);

    this.genderChartData = {
      ...this.genderChartData,
      datasets: [
        {
          label: 'Gender Distribution',
          data: this.genderData,
          backgroundColor: ['rgb(52, 141, 201)', 'rgb(255, 165, 0)'],
          hoverOffset: 4,
        },
      ],
    };
  }
}
