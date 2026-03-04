import {
  Component,
  computed,
  effect,
  inject,
  input,
} from '@angular/core';
import { IChartConfiguration, NgceChartsModule } from '@clarium/ngce-charts';
import {
  DELAY,
  IReusableDictionary,
} from '../../../../shared/literal-types/literal-types';
import { SharedService } from '../../../../shared/shared.service';
import { ILeaveReportConfig } from '../../../../shared/models/common';

@Component({
  selector: 'lms-bar-chart',
  standalone: true,
  imports: [NgceChartsModule],
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.scss',
})
export class BarChartComponent {
  labels = input<string>();
  data = input<IReusableDictionary<string, number>>();

  barChartData!: IChartConfiguration['data'];
  private sharedService = inject(SharedService);
  private dataConfig: ILeaveReportConfig[] =
    this.sharedService.getEmployeeLeaveReportConfig();

  constructor() {
    // update barChartData whenever chart data changes
    effect(() => {
      const data = this.chartData();
      if (data) {
        this.barChartData = data;
      }
    });
  }

  private chartData = computed(() => {
    const data = this.data();
    const label = this.labels() ?? '';
    if (!data) return null;
    const config = this.getConfig(data, label);
    return config;
  });

  getConfig(data: IReusableDictionary<string, number>, label: string) {
    const titles: string[] = [];
    const values: number[] = [];
    const backgColor: string[] = [];
    const hoverBackgColor: string[] = [];
    const dataset: any = [];
    this.dataConfig.forEach((configuration) => {
      if (
        Object.keys(data).includes(configuration.key) &&
        data[configuration.key] !== 0
      ) {
        const obj = {
          label: configuration.label,
          data: [data[configuration.key]],
          backgroundColor: configuration.backgroundColor,
          hoverBackgroundColor: configuration.hoverBackgroundColor,
          borderRadius: 7,
        };
        dataset.push(obj);
      }
    });
    const labels = [label];

    return {
      labels: labels,
      datasets: dataset,
    };
  }

  private getChartData(labelsData: string, values: any) {
    return {
      labels: ['Clarium Project Management'],
      datasets: [
        {
          label: 'Casual Leave',
          data: [2],
          backgroundColor: 'rgb(34, 197, 94,.5)',
          borderRadius: 7,
          hoverBackgroundColor: 'rgb(34,197, 94)',
        },
        {
          label: 'Sick Leave',
          data: [4],
          backgroundColor: 'rgb(59, 130, 246, .5)',
          borderRadius: 7,
          hoverBackgroundColor: 'rgb(59, 130, 246)',
        },
        {
          label: 'WFH',
          data: [6],
          backgroundColor: 'rgb(245, 158, 11, .5)',
          borderRadius: 7,
          hoverBackgroundColor: 'rgb(245, 158, 11)',
        },
        {
          label: 'Paternity',
          data: [3],
          backgroundColor: 'rgb(191, 239, 255, .5)',
          borderRadius: 7,
          hoverBackgroundColor: 'rgb(191, 239, 255)',
        },
        {
          label: 'Maternity',
          data: [3],
          backgroundColor: 'rgb(255, 182, 193, .5)',
          borderRadius: 7,
          hoverBackgroundColor: 'rgb(255, 182, 193)',
        },
      ],
    };
  }

  private delayed!: boolean;
  private hoveredIndex!: number | null;
  readonly barChartOptions: IChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        labels: {
          usePointStyle: true,
          font: {
            size: 14,
            weight: 500,
          },
          padding: 19,
        },
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Leaves',
        font: {
          size: 14,
          weight: 500,
        },
        position: 'left',
      },
      tooltip: {
        mode: 'point', // Ensure all datasets appear in a single tooltip
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

            
            return dataset.hoverBackgroundColor;
          },
        },
      },
    },
    animation: {
      onComplete: () => {
        this.delayed = true;
      },
      delay: (context: DELAY) => {
        let delay = 0;
        if (
          context.type === 'data' &&
          context.mode === 'default' &&
          !this.delayed
        ) {
          delay = context.dataIndex * 300 + context.datasetIndex * 100;
        }
        return delay;
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        suggestedMax: 100, // Set max to 100 for percentage-based representation
        grid: {
          display: false,
          color: 'rgba(0,0,0,0.1)', // Light grid lines
        },
        border: {
          display: true,
        },
      },
      y: {
        ticks: {
          stepSize: 2, // Increments of 25
        },
        grid: {
          display: false, // No grid lines for X-axis
        },
      },
    },
  };
}
