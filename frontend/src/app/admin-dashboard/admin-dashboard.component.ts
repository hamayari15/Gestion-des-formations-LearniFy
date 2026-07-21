import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, forkJoin } from 'rxjs';
import { FormationService } from '../core/services/formation.service';
import { InscriptionService } from '../core/services/incription.service';
import { ParticipantService } from '../core/services/participant.service';
import { ChartType, ChartOptions } from 'chart.js';
import { DashboardService } from '../core/services/dashboard.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent implements OnInit, OnDestroy {

  isLoading: boolean = true;
  hasData: boolean = false;
  hasError: boolean = false;

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

  get hasBarData(): boolean {
    return !!this.barChartData?.datasets?.[0]?.data?.some((v: number) => v > 0);
  }

  get hasPieData(): boolean {
    return !!this.pieChartData?.datasets?.[0]?.data?.some((v: number) => v > 0);
  }

  get hasLineData(): boolean {
    return !!this.lineChartData?.datasets?.[0]?.data?.some((v: number) => v > 0);
  }

  private statusColorMap: Record<string, string> = {
    'En Attente': '#3b82f6',
    'Validée': '#22c55e',
    'Refusée': '#ef4444',
  };

  private modeColorMap: Record<string, string> = {
    'En ligne': '#3b82f6',
    'Hybride': '#f59e0b',
    'Présentiel': '#22c55e',
  };

  private rawFormationModes: any[] = [];
  private rawInscriptionsOverTime: any[] = [];
  private langChangeSub!: Subscription;

  constructor(
    private inscriptionService: InscriptionService,
    private formationService: FormationService,
    private participantService: ParticipantService,
    private dashboardService: DashboardService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadDashboard();

    this.langChangeSub = this.translate.onLangChange.subscribe(() => {
      if (this.hasData) {
        this.buildBarChart();
        this.setFormationModeDistribution(this.rawFormationModes);
        this.setInscriptionsOverTime(this.rawInscriptionsOverTime);
      }
    });
  }

  ngOnDestroy(): void {
    this.langChangeSub?.unsubscribe();
  }

  loadDashboard(): void {
  this.isLoading = true;
  this.hasError = false;

  forkJoin({
    formations: this.formationService.getFormations(1, 5, '', '', 'all'),
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
      this.hasError = true;
      this.isLoading = false;
    },
  });
}

  private setParticipantStats(res: any): void {
    this.totalParticipants = res.total;
    this.activePercent = Math.round(res.activePercent) || 0;
    this.inactivePercent = Math.round(res.inactivePercent) || 0;

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
    const labels = this.inscriptionByStatusData.map((item: any) => {
      switch (item._id) {
        case 'En Attente':
          return this.translate.instant('ADMIN_DASHBOARD.PENDING');

        case 'Validée':
          return this.translate.instant('ADMIN_DASHBOARD.APPROVED');

        case 'Refusée':
          return this.translate.instant('ADMIN_DASHBOARD.REJECTED');

        default:
          return item._id;
      }
    });
    const values = this.inscriptionByStatusData.map((item: any) => item.count);
    const colors = this.inscriptionByStatusData.map(
      (item: any) => this.statusColorMap[item._id] || '#94a3b8'
    );

    this.barChartData = {
      labels: labels,
      datasets: [
        {
          label: this.translate.instant('ADMIN_DASHBOARD.CHART.REGISTRATIONS_BY_STATUS'),
          data: values,
          backgroundColor: colors,
          borderRadius: 6,
        },
      ],
    };
  }

  private setFormationModeDistribution(res: any[]): void {
    this.rawFormationModes = res;

    const labels = res.map((item: any) => {
      switch (item._id) {
        case 'En ligne':
          return this.translate.instant('ADMIN_DASHBOARD.CHART.ONLINE');

        case 'Hybride':
          return this.translate.instant('ADMIN_DASHBOARD.CHART.HYBRID');

        case 'Présentiel':
          return this.translate.instant('ADMIN_DASHBOARD.CHART.IN_PERSON');

        default:
          return item._id;
      }
    });
    const values = res.map((item: any) => item.count);

    this.formationModeStats = res;

    const total = values.reduce((a: number, b: number) => a + b, 0);

    this.onlinePercent = this.getPercent(res, 'En ligne', total);
    this.hybridPercent = this.getPercent(res, 'Hybride', total);
    this.offlinePercent = this.getPercent(res, 'Présentiel', total);

    const colors = res.map((item: any) => this.modeColorMap[item._id] || '#94a3b8');

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
    this.rawInscriptionsOverTime = res;

    const labels = res.map((item: any) => item._id);
    const values = res.map((item: any) => item.count);

    this.lineChartData = {
      labels,
      datasets: [
        {
          label: this.translate.instant('ADMIN_DASHBOARD.CHART.REGISTRATIONS_OVER_TIME'),
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
    if (!total) return 0;
    const item = data.find((x) => x._id === status);
    return item ? Math.round((item.count / total) * 100) : 0;
  }

  private getPercent(data: any[], key: string, total: number): number {
    if (!total) return 0;
    const item = data.find((x) => x._id === key);
    return item ? Math.round((item.count / total) * 100) : 0;
  }
}