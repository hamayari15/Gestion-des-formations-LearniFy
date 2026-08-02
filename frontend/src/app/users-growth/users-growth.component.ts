import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, forkJoin } from 'rxjs';
import { Chart } from 'chart.js/auto';
import { ParticipantService } from '../core/services/participant.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-users-growth',
  templateUrl: './users-growth.component.html',
  styleUrls: ['./users-growth.component.css']
})
export class UsersGrowthComponent implements OnInit, OnDestroy {

  participants: any[] = [];

  ageData: number[] = [0, 0, 0, 0];
  genderData: number[] = [0, 0];
  activeInactiveData: number[] = [0, 0];

  chartType: any = 'pie';

  chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        align: 'center' as const,
        labels: {
          boxWidth: 40,
          boxHeight: 10,
          padding: 10,
          font: { size: 11 },
        },
      },
    },
  };

  ageChartData: any;
  genderChartData: any;
  doughnutChartData: any;
  doughnutChartType: any = 'doughnut';

  lineChart!: Chart;

  isLoading = false;
  hasData = false;
  hasError = false;

  private rawGrowthLabels: string[] = [];
  private rawDailyData: number[] = [];
  private rawCumulativeData: number[] = [];
  private langChangeSub!: Subscription;

  constructor(
    private participantService: ParticipantService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadDashboard();

    this.langChangeSub = this.translate.onLangChange.subscribe(() => {
      if (this.hasData) {
        this.calculateAgeDistribution();
        this.calculateGenderDistribution();
        this.rebuildDoughnutChart();
        this.createChart(this.rawGrowthLabels, this.rawDailyData);
        this.createLineChart(this.rawGrowthLabels, this.rawCumulativeData);
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
      growth: this.participantService.getParticipantsGrowth(),
      participants: this.participantService.getParticipants(1, 1000),
      activeInactive: this.participantService.getActiveInactiveStats(),
    }).subscribe({
      next: (res: any) => {
        this.handleGrowth(res.growth);
        this.handleParticipants(res.participants);
        this.handleActiveInactive(res.activeInactive);

        this.hasData =
          this.participants.length > 0 ||
          this.activeInactiveData.some((v) => v > 0);

        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.hasError = true;
      }
    });
  }

  private handleGrowth(response: any): void {
    const labels = response.data.map((item: any) => item._id);
    const dailyData = response.data.map((item: any) => item.count);

    this.rawGrowthLabels = labels;
    this.rawDailyData = dailyData;

    this.createChart(labels, dailyData);

    const cumulativeData: number[] = [];
    let total = 0;

    dailyData.forEach((value: number) => {
      total += value;
      cumulativeData.push(total);
    });

    this.rawCumulativeData = cumulativeData;

    this.createLineChart(labels, cumulativeData);
  }

  private handleParticipants(res: any): void {
    this.participants = res.data.participants;

    this.calculateAgeDistribution();
    this.calculateGenderDistribution();
  }

  private handleActiveInactive(res: any): void {
    this.activeInactiveData = [res.active, res.inactive];
    this.rebuildDoughnutChart();
  }

  private rebuildDoughnutChart(): void {
    this.doughnutChartData = {
      labels: [
        this.translate.instant('USERS_GROWTH.CHART.ACTIVE'),
        this.translate.instant('USERS_GROWTH.CHART.INACTIVE'),
      ],
      datasets: [
        {
          label: this.translate.instant('USERS_GROWTH.CHART.USERS_STATUS'),
          data: this.activeInactiveData,
          backgroundColor: [
            '#22c55e',
            '#ef4444'
          ],
          hoverOffset: 4
        }
      ]
    };
  }

  calculateAgeDistribution(): void {
    this.ageData = [0, 0, 0, 0];

    this.participants.forEach(participant => {
      const age = participant.age;

      if (age == null) return;

      if (age >= 16 && age <= 25)
        this.ageData[0]++;
      else if (age >= 26 && age <= 35)
        this.ageData[1]++;
      else if (age >= 36 && age <= 45)
        this.ageData[2]++;
      else if (age >= 46)
        this.ageData[3]++;
    });

    this.ageChartData = {
      labels: ['16-25', '26-35', '36-45', '46+'],
      datasets: [
        {
          label: this.translate.instant('USERS_GROWTH.CHART.AGE_DISTRIBUTION'),
          data: this.ageData,
          backgroundColor: [
            'rgb(52, 141, 201)',
            'rgb(138, 43, 226)',
            'rgb(255, 165, 0)',
            'rgb(99, 188, 104)'
          ],
          hoverOffset: 4
        }
      ]
    };
  }

  calculateGenderDistribution(): void {
    this.genderData = [0, 0];

    this.participants.forEach(participant => {
      if (participant.gender === 'Male')
        this.genderData[0]++;
      else if (participant.gender === 'Female')
        this.genderData[1]++;
    });

    this.genderChartData = {
      labels: [
        this.translate.instant('USERS_GROWTH.CHART.MALE'),
        this.translate.instant('USERS_GROWTH.CHART.FEMALE'),
      ],
      datasets: [
        {
          label: this.translate.instant('USERS_GROWTH.CHART.GENDER_DISTRIBUTION'),
          data: this.genderData,
          backgroundColor: [
            'rgb(52, 141, 201)',
            'rgb(255, 165, 0)'
          ],
          hoverOffset: 4
        }
      ]
    };
  }

createChart(labels: string[], data: number[]) {
    setTimeout(() => {
      const canvas = document.getElementById('growthChart') as HTMLCanvasElement;
      const scrollInner = document.getElementById('growthScrollInner') as HTMLElement;

      if (!canvas || !scrollInner) {
        console.error('Canvas not found');
        return;
      }
      const existingChart = Chart.getChart(canvas);
      if (existingChart) {
        existingChart.destroy();
      }

      const isMobile = window.innerWidth <= 768;

      if (isMobile) {
        const outerWrap = scrollInner.parentElement as HTMLElement;
        const naturalWidth = outerWrap?.clientWidth || 0;
        const minPxPerDay = 75;
        const neededWidth = labels.length * minPxPerDay;

        if (neededWidth > naturalWidth) {
          scrollInner.style.width = `${neededWidth}px`;
        } else {
          scrollInner.style.removeProperty('width');
        }
      } else {
        scrollInner.style.removeProperty('width');
      }

      new Chart(canvas, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: this.translate.instant('USERS_GROWTH.CHART.NEW_PARTICIPANTS'),
              data,
              backgroundColor: '#518be9',
              borderRadius: 6,
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }, 0);
  }

  createLineChart(labels: string[], data: number[]) {
    setTimeout(() => {
      const canvas = document.getElementById('growthLineChart') as HTMLCanvasElement;
      const scrollInner = document.getElementById('lineScrollInner') as HTMLElement;

      if (!canvas || !scrollInner) {
        return;
      }

      const existingChart = Chart.getChart(canvas);
      if (existingChart) {
        existingChart.destroy();
      }

      const isMobile = window.innerWidth <= 768;

      if (isMobile) {
        const outerWrap = scrollInner.parentElement as HTMLElement;
        const naturalWidth = outerWrap?.clientWidth || 0;
        const minPxPerDay = 75;
        const neededWidth = labels.length * minPxPerDay;

        if (neededWidth > naturalWidth) {
          scrollInner.style.width = `${neededWidth}px`;
        } else {
          scrollInner.style.removeProperty('width');
        }
      } else {
        scrollInner.style.removeProperty('width');
      }

      new Chart(canvas, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: this.translate.instant('USERS_GROWTH.CHART.TOTAL_GROWTH'),
              data,
              fill: false,
              tension: 0.3
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }, 0);
  }

}