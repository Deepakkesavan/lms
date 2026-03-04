import {
  Component,
  TemplateRef,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { NgceComponentsModule } from '@clarium/ngce-components';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { DoughnutComponent } from '../component/doughnut/doughnut.component';
import { BarChartComponent } from '../component/bar-chart/bar-chart.component';
import { ReusableDataStatComponent } from '../../../reusable-templates/data-stat/data-stat.component';
import { MoreTeamMembersComponent } from '../../../reusable-templates/more-team-members/more-team-members.component';
import { LineChartComponent } from '../component/line-chart/line-chart.component';
import {
  IHrCardDetails,
  ILeaveReport,
} from '../models/hr';

import {
  HrTitles,
  IReusableDictionary,
  TAppearance,
} from '../../../shared/literal-types/literal-types';
import { SharedService } from '../../../shared/shared.service';
import { IDataStatCardConfig } from '../../../shared/models/common';
import { NgceIconModule } from '@clarium/ngce-icon';
import { PendingApprovalsComponent } from '../component/pending-approvals/pending-approvals.component';
import { HrStore } from '../store/hr.store';

@Component({
  selector: 'lms-hr',
  standalone: true,
  imports: [
    CommonModule,
    DoughnutComponent,
    BarChartComponent,
    NgceComponentsModule,
    FormsModule,
    ReusableDataStatComponent,
    MoreTeamMembersComponent,
    LineChartComponent,
    NgceIconModule,
    PendingApprovalsComponent,
    NgTemplateOutlet,
  ],
  templateUrl: './hr.page.html',
  styleUrl: './hr.page.scss',
  // encapsulation: ViewEncapsulation.ShadowDom,
})
export class HrPage {
  //Injecting required services
  private sharedService = inject(SharedService);
  private readonly _store = inject(HrStore);

  // Templates to display team members on each card
  leaveTemplate =
    viewChild<TemplateRef<MoreTeamMembersComponent>>('leaveTemplate');
  wfhTemplate = viewChild<TemplateRef<MoreTeamMembersComponent>>('wfhTemplate');
  specialLeavesTemplate = viewChild<TemplateRef<MoreTeamMembersComponent>>(
    'specialLeavesTemplate'
  );
  readonly empLeaveReportTitle: string = 'Employee Leave Summary';
  readonly projectReportTitle: string = 'Project Report';
  readonly lopTitle: string = 'LOP Report';
  readonly pendingTitle: string = 'Pending Leaves';
  readonly noDataTitle: string = 'No leave records found';

  //Cards required for HR
  hrData: IDataStatCardConfig[] = [];
  appearance: TAppearance = 'none';
  pendingLeaves = computed(() => this._store.pendingLeaves());
  catalogData = computed(() => this._store.catalogData().catalogs.Leave);

  projects = computed(() => this._store.projects());
  projectLeaveReport = computed(() => this._store.projectReport());

  constructor() {
    effect(() => {
      const projects = this.projects() ?? [];
      const dropdown = projects.map((p) => ({ value: p }));

      this.projectDropDownData.set(dropdown);

      // set default only if empty and we have options
      if (!this.project() && dropdown.length > 0) {
        this.project.set(dropdown[0].value);
      }
    });
  }

  getPendingLeaves = computed(() => {
    const leaves = this.pendingLeaves() ?? [];
    const catalogs = this.catalogData() ?? [];

    const transformed = leaves.map((src) => {
      const label = this.sharedService.getCatalogUsingKey(
        catalogs,
        src.leaveTypeKey
      ).value;
      return {
        ...src,
        leaveTypeKey: label,
      };
    });

    transformed.sort(
      (a, b) =>
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    );

    return transformed;
  });

  cardStyles = {
    cursor: 'default',
    //rgb(229 231 235 / 31%)
    'background-color': 'white',
    border: '1px solid rgb(229, 231, 235)', //border: '1px solid e5e7eb'
    height: '20.58rem',
    width: 'auto',
    'padding-top': '.5rem',
  };

  doughnutCardStyles = {
    cursor: 'default',
    'background-color': 'white',
    border: '1px solid rgb(229, 231, 235)', //border: '1px solid e5e7eb'
    height: '41.8rem',
    width: 'auto',
    'padding-top': '.5rem',
  };

  pendingCardStyles = {
    cursor: 'default',
    'background-color': 'white',
    border: '1px solid rgb(229, 231, 235)', //border: '1px solid e5e7eb'
    height: '41.8rem',
    width: 'auto',
    'padding-top': '.5rem',
    'padding-left': '1rem',
    'padding-right': '1rem',
  };

  hrDataStat!: IHrCardDetails;
  index = 0;
  startMonth = signal<number>(0);
  endMonth = signal<number>(this.startMonth() + 4);
  months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  labels: string[] = this.getMonths(this.startMonth(), this.endMonth());

  hrCardData = computed(() => {
    return this._store.cardData();
  });

  //Filtering employees who are on leave(including maternity/paternity) based on hrCardData
  employeesOnLeave = computed(() =>
    this.hrCardData().card.HrView.filter((e) => e.onLeave)
  );

  employeesOnSpecialLeave = computed(() =>
    this.hrCardData().card.HrView.filter((e) => e.onSpecialLeave)
  );

  //Filtering employees who are on doing work from home based on hrCardData
  employeesOnWorkFromHome = computed(() =>
    this.hrCardData().card.HrView.filter((e) => e.onWrh)
  );

  //Filtering employees who are available in offcie based on hrCardData
  availableEmployees = computed(() =>
    this.hrCardData().card.HrView.filter(
      (e) => !e.onLeave && !e.onWrh && !e.onSpecialLeave
    )
  );

  //Total Employees who are assigned under him/her
  totalEmployees = computed(() => this.hrCardData().card.HrView);

  // Generates card configurations with dynamic counts and templates based on employee status.
  hrCardTypes = computed(() =>
    this.sharedService.getHrCardDesigns().map((data) => {
      const card: IDataStatCardConfig = {
        ...data,
        customTemplate: '',
        details: [],
        count: 0,
      };

      switch (data.title) {
        case HrTitles.leave:
          return {
            ...card,
            count: this.employeesOnLeave().length,
            details: this.employeesOnLeave(),
            customTemplate: this.employeesOnLeave().length
              ? this.leaveTemplate()
              : 'No employees are currently on leave.',
          };
        case HrTitles.wfh:
          return {
            ...card,
            count: this.employeesOnWorkFromHome().length,
            details: this.employeesOnWorkFromHome(),
            customTemplate:
              this.employeesOnWorkFromHome().length > 0
                ? this.wfhTemplate()
                : 'No employees are currently working from home.',
          };
        case HrTitles.specialLeaves:
          return {
            ...card,
            count: this.employeesOnSpecialLeave().length,
            details: this.employeesOnSpecialLeave(),
            customTemplate:
              this.employeesOnSpecialLeave().length > 0
                ? this.specialLeavesTemplate()
                : 'No employees are currently available.',
          };

        default:
          return card;
      }
    })
  );

  leaveReportData = computed(() => this._store.leaveReport());

  //chart data
  lopLeaveData = computed(() => {
    const lopData = this._store.lopReport();
    return lopData.slice(this.startMonth(), this.endMonth());
  });

  getMonths(start: number, end: number) {
    return this.months.slice(start, end);
  }

  onClickNextMonths() {
    this.startMonth.set(this.startMonth() >= 8 ? 0 : this.startMonth() + 4);
    this.endMonth.set(this.startMonth() + 4);
    this.labels = this.getMonths(this.startMonth(), this.endMonth());
  }

  private getDropdownData() {
    const array: { value: string }[] = [];
    Object.keys(this.sharedService.getDropdownConfig()).forEach((dropdown) => {
      array.push({ value: this.sharedService.getDropdownValue(dropdown) });
    });
    return array;
  }

  dropdownData = this.getDropdownData();

  doughnutKey = signal<string>(this.dropdownData[0].value);

  doughnutData = computed(() => {
    const key = this.sharedService.getDropdownKey(this.doughnutKey());
    const data: ILeaveReport = this.leaveReportData();
    let response!: IReusableDictionary<string, number>;
    if (this.sharedService.isLeaveReportKey(key, data)) {
      response = data[key];
    }
    return response;
  });

  checkDataEmpty(data: IReusableDictionary<string, number>): boolean {
    let isEmpty = true;
    for (const item in data) {
      if (data[item] !== 0) {
        isEmpty = false;
        break;
      }
    }
    return isEmpty;
  }

  onSelectOrgaisationValueChange(data: any) {
    this.doughnutKey.set(data.value);
  }

  projectDropDownData = signal<{ value: string }[]>([]);

  projectPeriodKey = signal<string>(this.dropdownData[0]?.value);

  project = signal<string>('');

  datasetDetails = {
    Casual: {
      backgroundColor: 'rgb(34, 197, 94,.5)',
      borderRadius: 7,
      hoverBackgroundColor: 'rgb(34,197, 94)',
    },
    Sick: {
      backgroundColor: 'rgb(59, 130, 246, .5)',
      borderRadius: 7,
      hoverBackgroundColor: 'rgb(59, 130, 246)',
    },
    WFH: {
      backgroundColor: 'rgb(245, 158, 11, .5)',
      borderRadius: 7,
      hoverBackgroundColor: 'rgb(245, 158, 11)',
    },
    Paternity: {
      backgroundColor: 'rgb(191, 239, 255, .5)',
      borderRadius: 7,
      hoverBackgroundColor: 'rgb(191, 239, 255)',
    },
    Maternity: {
      backgroundColor: 'rgb(255, 182, 193, .5)',
      borderRadius: 7,
      hoverBackgroundColor: 'rgb(255, 182, 193)',
    },
  };

  projectData = computed(() => {
    const key = this.sharedService.getDropdownKey(this.projectPeriodKey());
    const data = this.projectLeaveReport();
    let response!: IReusableDictionary<string, number>;

    if (this.sharedService.isReportKey(key, data)) {
      const array = data[key];

      array.forEach((item) => {
        if (item.projectName === this.project()) {
          response = item.leaveTypes;
        }
      });
    }
    return response;
  });

  onSelectProjectPeriodChange(data: any) {
    this.projectPeriodKey.set(data.value);
  }

  onSelectProjectValueChange(data: any) {
    this.project.set(data.value);
  }

  dropdownStyles = {
    width: 'auto',
    'font-size': '.9rem',
  };

  buttonStyles = {
    height: '2.2rem',
    'font-size': '.9rem',
    'margin-top': '.4rem',
    width: 'fit-content',
    'border-color': '#ccc',
  };

  cardHeadingStyles = {
    margin: '.315rem 1rem',
    display: 'flex',
    'justify-content': 'space-between',
    'align-items': 'center',
  };

  titleStyles = {
    margin: '.315rem 1rem',
    display: 'flex',
    'justify-content': 'flex-start',
    'align-items': 'center',
    gap: '.5rem',
  };

  dropdownLayoutStyles = {
    display: 'flex',
    'justify-content': 'center',
    'align-items': 'center',
    gap: '10px',
  };

  pendingCardContentStyle = {
    'max-height': '36.5rem',
    'min-height': 'auto',
    'overflow-y': 'auto',
    'scrollbar-width': 'thin',
    'scrollbar-color': 'rgba(156, 163, 175, 0.5) transparent',
    padding: '.8rem',
    display: 'flex',
    'flex-flow': 'column nowrap',
    gap: '.8rem',
  };
}
