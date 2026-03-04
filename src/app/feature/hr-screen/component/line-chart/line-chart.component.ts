import { Component, computed, effect, input } from '@angular/core';
import { IChartConfiguration, NgceChartsModule } from '@clarium/ngce-charts';
import { ILOPReport } from '../../models/hr';

@Component({
  selector: 'lms-line-chart',
  standalone: true,
  imports: [NgceChartsModule],
  templateUrl: './line-chart.component.html',
  styleUrl: './line-chart.component.scss',
})
export class LineChartComponent {
  [x: string]: any;
  readonly type = 'line';
  barChartData!: IChartConfiguration['data'];
  labels = input<string[]>();
  data = input<ILOPReport[]>();

  private chartData = computed(() => {
    const data = this.getChartData();
    return data;
  });

  constructor() {
    effect(() => {
      this.barChartData = this.chartData();
    });
  }

  private getChartData() {
    return {
      labels: this.labels(),
      datasets: [
        {
          label: 'LOP',
          data: this.getCounts(),
          backgroundColor: 'rgb(59, 130, 246, .5)',
          borderRadius: 7,
          hoverBackgroundColor: 'rgb(59, 130, 246)',
          type: 'bar' as const,
        },
      ],
    };
  }

  private getCounts() {
    const array: number[] = [];
    const org = this.data();
    org?.forEach((item) => {
      array.push(item.lop);
    });
    return array;
  }

  readonly options: IChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        labels: {
          usePointStyle: true,
        },
      },
      title: {
        display: true,
        text: 'LOP count',
        position: 'left',
        font: {
          size: 14,
          weight: 500,
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        caretSize: 8,
        backgroundColor: 'rgba(20, 20, 60, 0.9)', // rgba(20, 20, 60, 0.9)
        titleColor: 'rgba(255, 255, 255, 0.85)',
        titleFont: {
          size: 14,
          weight: 500,
        },
        bodyFont: {
          size: 14,
          weight: 500,
        },
        displayColors: false,
        padding: 15,
        animation: {
          duration: 450, // Tooltip shows up with a smooth fade-in
          easing: 'easeOutQuad',
        },
        callbacks: {
          // For changing the color of the tooltip label text.
          labelTextColor: (tooltipItem: any) => {
            // If tooltipItem is undefined or empty dataset
            if (!tooltipItem?.dataset) {
              return 'rgba(255, 255, 255, 0.85)'; // Default color if tooltip is invalid
            }

            const dataset = tooltipItem.dataset; // Get dataset reference

            switch (dataset.label) {
              case 'Employees':
                return 'rgb(59, 130, 246)';
              case 'LOP':
                return 'rgb(245, 158, 11)';
              default:
                return '#fff';
            }
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          display: false,
        },
      },
      y: {
        stacked: true,
        ticks: {
          stepSize: 4,
        },
        grid: {
          display: false,
        },
      },
    },
  };
}
