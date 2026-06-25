import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { ParticipantService } from '../core/services/participant.service';

@Component({
  selector: 'app-users-growth',
  templateUrl: './users-growth.component.html',
  styleUrls: ['./users-growth.component.css']
})
export class UsersGrowthComponent implements OnInit {

  isLoading = false;
  errorMessage = '';

  constructor(private participantService: ParticipantService) {}

  ngOnInit(): void {
    this.loadParticipantsGrowth();
  }

  loadParticipantsGrowth(): void {
    this.isLoading = true;

    this.participantService.getParticipantsGrowth().subscribe({
      next: (response: any) => {

        this.isLoading = false;

        const labels = response.data.map((item: any) => item._id);
        const data = response.data.map((item: any) => item.count);

        this.createChart(labels, data);
      },

      error: (error) => {
        this.isLoading = false;
        this.errorMessage =
          error.error?.message ||
          'Erreur lors de la récupération des données.';
      }
    });
  }

  createChart(labels: string[], data: number[]) {

  setTimeout(() => {

    const canvas = document.getElementById('growthChart') as HTMLCanvasElement;

    if (!canvas) {
      console.error('Canvas not found');
      return;
    }

    const existingChart = Chart.getChart(canvas);
    if (existingChart) {
      existingChart.destroy();
    }

    new Chart(canvas, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Nouveaux participants',
            data,
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