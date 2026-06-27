import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { ParticipantService } from '../core/services/participant.service';

@Component({
  selector: 'app-users-growth',
  templateUrl: './users-growth.component.html',
  styleUrls: ['./users-growth.component.css']
})
export class UsersGrowthComponent implements OnInit {

  participants: any[] = [];

  ageData: number[] = [0, 0, 0, 0];
  genderData: number[] = [0, 0];

  chartType: any = 'pie';

  chartOptions = {
    responsive: true
  };

  ageChartData = {
    labels: ['18-25', '26-35', '36-45', '46+'],
    datasets: [
      {
        label: 'Age Distribution',
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

  genderChartData = {
    labels: ['Male', 'Female'],
    datasets: [
      {
        label: 'Gender Distribution',
        data: this.genderData,
        backgroundColor: [
          'rgb(52, 141, 201)',
          'rgb(255, 165, 0)'
        ],
        hoverOffset: 4
      }
    ]
  };

  lineChart!: Chart;
  activeInactiveData: number[] = [0, 0];

  isLoading = false;
  errorMessage = '';

  constructor(private participantService: ParticipantService) {}

  ngOnInit(): void {
    this.loadParticipantsGrowth();
    this.loadParticipants();
    this.loadActiveInactiveStats();
  }

  loadParticipantsGrowth(): void {
    this.isLoading = true;

    this.participantService.getParticipantsGrowth().subscribe({
      next: (response: any) => {

        this.isLoading = false;

        const labels = response.data.map((item: any) => item._id);
        const dailyData  = response.data.map((item: any) => item.count);

        this.createChart(labels, dailyData);

        const cumulativeData: number[] = [];

        let total = 0;

        dailyData.forEach((value: number) => {
          total += value;
          cumulativeData.push(total);
        });

        this.createLineChart(labels, cumulativeData);

      },

      error: (error) => {
        this.isLoading = false;
        this.errorMessage =
          error.error?.message ||
          'Erreur lors de la récupération des données.';
      }
    });
  }

  loadParticipants(): void {

    this.participantService.getParticipants().subscribe({

      next: (participants) => {

        this.participants = participants;

        this.calculateAgeDistribution();
        this.calculateGenderDistribution();

      },

      error: (err) => {
        console.error(err);
      }

    });

  }

  calculateAgeDistribution(): void {

    this.ageData = [0,0,0,0];

    this.participants.forEach(participant => {

      const age = participant.age;

      if(age == null) return;

      if(age >=18 && age<=25)
        this.ageData[0]++;

      else if(age>=26 && age<=35)
        this.ageData[1]++;

      else if(age>=36 && age<=45)
        this.ageData[2]++;

      else if(age>=46)
        this.ageData[3]++;

    });

    this.ageChartData = {

      ...this.ageChartData,

      datasets: [

        {

          label:'Age Distribution',

          data:this.ageData,

          backgroundColor:[
            'rgb(52, 141, 201)',
            'rgb(138, 43, 226)',
            'rgb(255, 165, 0)',
            'rgb(99, 188, 104)'
          ],

          hoverOffset:4

        }

      ]

    };

  }

  calculateGenderDistribution(): void {

    this.genderData = [0,0];

    this.participants.forEach(participant => {

      if(participant.gender === 'Male')
        this.genderData[0]++;

      else if(participant.gender === 'Female')
        this.genderData[1]++;

    });

    this.genderChartData = {

      ...this.genderChartData,

      datasets:[

        {

          label:'Gender Distribution',

          data:this.genderData,

          backgroundColor:[
            'rgb(52, 141, 201)',
            'rgb(255, 165, 0)'
          ],

          hoverOffset:4

        }

      ]

    };
    console.log(this.genderData);
    console.log(this.participants);

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

  createLineChart(labels: string[], data: number[]) {

    setTimeout(() => {

      const canvas = document.getElementById('growthLineChart') as HTMLCanvasElement;

      if (!canvas) {
        return;
      }

      const existingChart = Chart.getChart(canvas);

      if (existingChart) {
        existingChart.destroy();
      }

      new Chart(canvas, {

        type: 'line',

        data: {

          labels,

          datasets: [

            {

              label: 'Total Users Growth',

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

    loadActiveInactiveStats(): void {

  this.participantService.getActiveInactiveStats().subscribe({
    next: (res) => {

      this.activeInactiveData = [res.active, res.inactive];

      this.doughnutChartData = {
        ...this.doughnutChartData,
        datasets: [
          {
            label: 'Users Status',
            data: this.activeInactiveData,
            backgroundColor: [
              'rgb(52, 141, 201)',
              'rgb(255, 165, 0)'
            ],
            hoverOffset: 4
          }
        ]
      };

    },
    error: (err) => {
      console.error(err);
    }
  });

}

    doughnutChartData = {
  labels: ['Active', 'Inactive'],
  datasets: [
    {
      label: 'Users Status',
      data: this.activeInactiveData,
      backgroundColor: [
        'rgb(52, 141, 201)',
        'rgb(255, 165, 0)'
      ],
      hoverOffset: 4
    }
  ]
};

doughnutChartType: any = 'doughnut';

};
