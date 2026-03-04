import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, input } from '@angular/core';
import { IChartConfiguration, NgceChartsModule } from '@clarium/ngce-charts';
import { IReusableDictionary } from '../../../../shared/literal-types/literal-types';
import { SharedService } from '../../../../shared/shared.service';
import { ILeaveReportConfig } from '../../../../shared/models/common';

@Component({
  selector: 'lms-doughnut',
  standalone: true,
  imports: [NgceChartsModule, CommonModule],
  templateUrl: './doughnut.component.html',
  styleUrl: './doughnut.component.scss'
})
export class DoughnutComponent  {
  [x: string]: any;

  leaveData = input<IReusableDictionary<string,number> | undefined>(); // Signal-based input
  doughnutData!: IChartConfiguration['data'];
  private sharedService = inject(SharedService);
  private dataConfig:ILeaveReportConfig[] = this.sharedService.getEmployeeLeaveReportConfig();

  
  // Computed property that reacts to input changes
  private chartData = computed(() => {   
    const data = this.leaveData();
    
    if (!data) return null;
    
    const config = this.getConfig(data)

    return config;
  });

  getConfig(data:IReusableDictionary<string,number>){
   
    const titles: string[] = []
    const values: number[] = []
    const backgColor: string[] = []
    const hoverBackgColor: string[] = []
    this.dataConfig.forEach(configuration =>{
      if(Object.keys(data).includes(configuration.key)){
        titles.push(configuration.label)
        values.push(data[configuration.key])
        backgColor.push(configuration.backgroundColor)
        hoverBackgColor.push(configuration.hoverBackgroundColor)
      }
    })
    return {
      labels: titles,
      datasets: [{
        label: 'Total Employees',
        data: values,
        backgroundColor: backgColor,
        hoverBackgroundColor: hoverBackgColor
      }]
    };
  }
  
  constructor() {
    // Update doughnutData whenever chartData changes
    effect(() => {
      const data = this.chartData();
      if (data) {
        this.doughnutData = data;
      }
    });
  }
  

  readonly doughnutOptions: IChartConfiguration['options'] = {
    responsive : true,
    elements: {
      arc: {
          borderWidth: 5,
          hoverBorderWidth: 0,
      }
  },
    plugins:{
      legend:{
        labels:{
          font:{
            size: 13,
          },
          usePointStyle: true,
        },
        position: 'top'
      },
      tooltip:{
        caretSize: 8,
        backgroundColor: 'rgba(10, 30, 60, 0.9)',
        titleColor: 'rgba(255, 255, 255, 0.85)',
        titleFont:{
          size: 15,
          weight: 500
        },
        bodyFont:{
          size: 13,
          weight: 500
        },
        bodyColor: 'rgba(255, 255, 255, 0.85)',
        displayColors: false,
        padding: 15,
        animation: {
          duration: 450, // Tooltip shows up with a smooth fade-in
          easing: 'easeOutBack',
        },
      }
    }
  }
}
