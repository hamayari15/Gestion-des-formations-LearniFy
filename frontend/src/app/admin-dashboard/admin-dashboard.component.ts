import { Component, OnInit } from '@angular/core';
import { FormationService } from '../core/services/formation.service';
import { InscriptionService } from '../core/services/incription.service';
import { ParticipantService } from '../core/services/participant.service';
import { ChartType } from 'chart.js';
import { DashboardService } from '../core/services/dashboard.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent implements OnInit {

  totalFormations: number = 0;
  totalInscriptions: number = 0;
  totalParticipants: number = 0;

  inscriptionPerThemeData: any[] = [];
  barChartData: any;
  public barChartType: ChartType = 'bar';

  constructor(
    private inscriptionService: InscriptionService,
    private formationService: FormationService,
    private participantService: ParticipantService,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.fetchTotalFormations();
    this.fetchTotalInscriptions();
    this.fetchTotalParticipants();
    this.fetchInscriptionsPerTheme();
  }

  fetchTotalFormations(): void {
    this.formationService.getFormations().subscribe((res: any) => {
      this.totalFormations = res.data.totalItems;
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
    });
  }





  fetchInscriptionsPerTheme(): void {
    this.dashboardService.getInscriptionsPerTheme()
      .subscribe((res: any) => {
        this.inscriptionPerThemeData = res;
        this.buildBarChart();
      });
  }

  buildBarChart(): void {
    const labels = this.inscriptionPerThemeData.map((item: any) => item._id);
    const values = this.inscriptionPerThemeData.map((item: any) => item.count);

    this.barChartData = {
      labels: labels,
      datasets: [
        {
          label: 'Inscriptions per Theme',
          data: values,
          backgroundColor: 'rgb(54, 162, 235)',
        }
      ]
    };
  }

};