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

  formationModeStats: any[] = [];
  onlinePercent: number = 0;
  hybridPercent: number = 0;
  offlinePercent: number = 0;

  inscriptionByStatusData: any[] = [];

  inscriptionStatusStats: any[] = [];
  pendingPercent: number = 0;
  approvedPercent: number = 0;
  rejectedPercent: number = 0;

  participantStats: any[] = [];
  activePercent: number = 0;
  inactivePercent: number = 0;

  barChartData: any;
  public barChartType: ChartType = 'bar';

  pieChartData: any;
  public pieChartType: ChartType = 'pie';

  lineChartData: any;
  public lineChartType: ChartType = 'line';

  constructor(
    private inscriptionService: InscriptionService,
    private formationService: FormationService,
    private participantService: ParticipantService,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.fetchTotalFormations();
    this.fetchTotalInscriptions();
    this.fetchParticipantStats();
    this.getInscriptionsByStatus();
    this.fetchFormationModeDistribution();
    this.fetchInscriptionsOverTime();
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

  fetchParticipantStats(): void {
    this.participantService.getActiveInactiveStats()
      .subscribe((res: any) => {

        this.totalParticipants = res.total;

        this.activePercent = res.activePercent;
        this.inactivePercent = res.inactivePercent;

        this.participantStats = [
          { _id: 'active', count: res.active },
          { _id: 'inactive', count: res.inactive }
        ];
      });
  }

  getInscriptionsByStatus(): void {
    this.dashboardService.getInscriptionsByStatus()
      .subscribe((res: any) => {

        this.inscriptionStatusStats = res;

        const total = res.reduce((sum: number, item: any) => sum + item.count, 0);

        this.pendingPercent = this.getStatusPercent(res, 'En Attente', total);
        this.approvedPercent = this.getStatusPercent(res, 'Validée', total);
        this.rejectedPercent = this.getStatusPercent(res, 'Refusée', total);

        this.inscriptionByStatusData = res;
        this.buildBarChart();
      });
  }

  buildBarChart(): void {
    const labels = this.inscriptionByStatusData.map((item: any) => item._id);
    const values = this.inscriptionByStatusData.map((item: any) => item.count);

    this.barChartData = {
      labels: labels,
      datasets: [
        {
          label: 'Inscriptions by Status',
          data: values,
          backgroundColor: [
            '#36A2EB',  
            '#4BC0C0',
            '#FF6384'   
          ],
        }
      ]
    };
  }

  fetchFormationModeDistribution(): void {
    this.dashboardService.getFormationModeDistribution()
      .subscribe((res: any) => {

        const labels = res.map((item: any) => item._id);
        const values = res.map((item: any) => item.count);

        this.formationModeStats = res;

        const total = values.reduce((a: number, b: number) => a + b, 0);

        this.onlinePercent = this.getPercent(res, 'En ligne', total);
        this.hybridPercent = this.getPercent(res, 'Hybride', total);
        this.offlinePercent = this.getPercent(res, 'Présentiel', total);

        this.pieChartData = {
          labels: labels,
          datasets: [
            {
              data: values,
              backgroundColor: [
                '#36A2EB',
                '#FF9F40',
                '#155665'
              ]
            }
          ]
        };
      });
  }

  fetchInscriptionsOverTime(): void {
    this.dashboardService.getInscriptionsOverTime()
      .subscribe((res: any) => {

        const labels = res.map((item: any) => item._id);
        const values = res.map((item: any) => item.count);

        this.lineChartData = {
          labels,
          datasets: [
            {
              label: 'Inscriptions Over Time',
              data: values,
              fill: false,
              borderColor: '#36A2EB',
              tension: 0.3,
            },
          ],
        };
      });
  }

  private getStatusPercent(data: any[], status: string, total: number): number {
    const item = data.find(x => x._id === status);
    return item ? Math.round((item.count / total) * 100) : 0;
  }

  private getPercent(data: any[], key: string, total: number): number {
    const item = data.find((x) => x._id === key);
    return item ? Math.round((item.count / total) * 100) : 0;
  }
}