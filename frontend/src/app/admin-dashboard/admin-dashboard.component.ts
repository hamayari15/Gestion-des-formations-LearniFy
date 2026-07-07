import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { FormationService } from '../core/services/formation.service';
import { InscriptionService } from '../core/services/incription.service';
import { ParticipantService } from '../core/services/participant.service';
import { ChartType, ChartOptions } from 'chart.js';
import { DashboardService } from '../core/services/dashboard.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent implements OnInit {

  isLoading: boolean = true;
  hasData: boolean = false;
  errorMessage: string = '';

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

  public chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { boxWidth: 10, font: { size: 11 } },
      },
    },
  };

  private statusColorMap: Record<string, string> = {
    'En Attente': '#f59e0b',
    'Validée': '#22c55e',
    'Refusée': '#ef4444',
  };

  private modeColorMap: Record<string, string> = {
    'En ligne': '#3b82f6',
    'Hybride': '#f59e0b',
    'Présentiel': '#22c55e',
  };

  constructor(
    private inscriptionService: InscriptionService,
    private formationService: FormationService,
    private participantService: ParticipantService,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.isLoading = true;
    this.errorMessage = '';

    forkJoin({
      formations: this.formationService.getFormations(),
      inscriptions: this.inscriptionService.getInscriptions(),
      participants: this.participantService.getActiveInactiveStats(),
      inscriptionsByStatus: this.dashboardService.getInscriptionsByStatus(),
      formationModes: this.dashboardService.getFormationModeDistribution(),
      inscriptionsOverTime: this.dashboardService.getInscriptionsOverTime(),
    }).subscribe({
      next: (res: any) => {
        this.totalFormations = res.formations.data.totalItems;
        this.totalInscriptions = res.inscriptions.data.totalItems;

        this.setParticipantStats(res.participants);
        this.setInscriptionsByStatus(res.inscriptionsByStatus);
        this.setFormationModeDistribution(res.formationModes);
        this.setInscriptionsOverTime(res.inscriptionsOverTime);

        this.hasData =
          this.totalFormations > 0 ||
          this.totalInscriptions > 0 ||
          this.totalParticipants > 0;

        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Impossible de charger les données du tableau de bord.';
        this.isLoading = false;
      },
    });
  }

  private setParticipantStats(res: any): void {
    this.totalParticipants = res.total;
    this.activePercent = res.activePercent;
    this.inactivePercent = res.inactivePercent;

    this.participantStats = [
      { _id: 'active', count: res.active },
      { _id: 'inactive', count: res.inactive },
    ];
  }

  private setInscriptionsByStatus(res: any[]): void {
    this.inscriptionStatusStats = res;

    const total = res.reduce((sum: number, item: any) => sum + item.count, 0);

    this.pendingPercent = this.getStatusPercent(res, 'En Attente', total);
    this.approvedPercent = this.getStatusPercent(res, 'Validée', total);
    this.rejectedPercent = this.getStatusPercent(res, 'Refusée', total);

    this.inscriptionByStatusData = res;
    this.buildBarChart();
  }

  buildBarChart(): void {
    const labels = this.inscriptionByStatusData.map((item: any) => item._id);
    const values = this.inscriptionByStatusData.map((item: any) => item.count);

    const colors = labels.map((label: string) => this.statusColorMap[label] || '#94a3b8');

    this.barChartData = {
      labels: labels,
      datasets: [
        {
          label: 'Inscriptions par statut',
          data: values,
          backgroundColor: colors,
          borderRadius: 6,
        },
      ],
    };
  }

  private setFormationModeDistribution(res: any[]): void {
    const labels = res.map((item: any) => item._id);
    const values = res.map((item: any) => item.count);

    this.formationModeStats = res;

    const total = values.reduce((a: number, b: number) => a + b, 0);

    this.onlinePercent = this.getPercent(res, 'En ligne', total);
    this.hybridPercent = this.getPercent(res, 'Hybride', total);
    this.offlinePercent = this.getPercent(res, 'Présentiel', total);

    const colors = labels.map((label: string) => this.modeColorMap[label] || '#94a3b8');

    this.pieChartData = {
      labels: labels,
      datasets: [
        {
          data: values,
          backgroundColor: colors,
          borderWidth: 0,
        },
      ],
    };
  }

  private setInscriptionsOverTime(res: any[]): void {
    const labels = res.map((item: any) => item._id);
    const values = res.map((item: any) => item.count);

    this.lineChartData = {
      labels,
      datasets: [
        {
          label: 'Inscriptions dans le temps',
          data: values,
          fill: true,
          borderColor: '#4f46e5',
          backgroundColor: 'rgba(79, 70, 229, 0.08)',
          tension: 0.3,
          pointBackgroundColor: '#4f46e5',
        },
      ],
    };
  }

  private getStatusPercent(data: any[], status: string, total: number): number {
    const item = data.find((x) => x._id === status);
    return item ? Math.round((item.count / total) * 100) : 0;
  }

  private getPercent(data: any[], key: string, total: number): number {
    const item = data.find((x) => x._id === key);
    return item ? Math.round((item.count / total) * 100) : 0;
  }
}