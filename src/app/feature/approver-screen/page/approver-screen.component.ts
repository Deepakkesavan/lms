import { CommonModule } from '@angular/common';
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
import { NgceIconModule } from '@clarium/ngce-icon';

import { ReusableDataStatComponent } from '../../../reusable-templates/data-stat/data-stat.component';
import { MoreTeamMembersComponent } from '../../../reusable-templates/more-team-members/more-team-members.component';

import {
  ApproverTitles,
  approvalStatusKeys,
} from '../../../shared/literal-types/literal-types';

import { ICatalogResponse } from '../../../shared/models/card';
import { ICatalog, IDataStatCardConfig } from '../../../shared/models/common';

import { SharedService } from '../../../shared/shared.service';
import { GridComponent } from '../components/grid/grid.component';
import { IApproverCardDetails, ILeaveRequestData } from '../models/approver';
import { ApproverScreenStore } from '../store/approver-screen.store';

@Component({
  selector: 'lms-approver-screen',
  standalone: true,
  imports: [
    CommonModule,
    NgceComponentsModule,
    NgceIconModule,
    ReusableDataStatComponent,
    MoreTeamMembersComponent,
    GridComponent,
  ],
  templateUrl: './approver-screen.component.html',
  styleUrl: './approver-screen.component.scss',
  // encapsulation: ViewEncapsulation.ShadowDom,
})
export class ApproverScreenComponent {
  index = signal<number>(0);

  tagGroupStyles = {
    'font-weight': 'bold',
    color: 'var(--neutral-dark)'
  };

  tabArray = [
    {
      headerName: 'Pending Requests',
      headerIconClass: 'ngce-clock-1',
      content: 'employeeLeaveRequests',
    },
  ];

  // Injected services
  private readonly sharedService = inject(SharedService);
  private readonly _store = inject(ApproverScreenStore);

  // Signals
  employeeLeaveRequests = signal<ILeaveRequestData[]>([]);
  catalogData = signal<ICatalogResponse>({
    catalogs: {
      Leave: [],
      Gender: [],
      'Approval Status': [],
      LeaveDayType: [],
    },
  });
  leaveCatalog = signal<ICatalog[]>([]);
  pendingStatus = signal<string>('');
  approverCardData = signal<IApproverCardDetails>({
    card: { ManagerView: [] },
  });

  // Computed values
  updatedLeaveCatalog = computed(
    () => this._store.catalogData().catalogs.Leave
  );

  updatedLeaveRequests = computed(() => {
    const requests = this._store.leaveRequests() ?? [];
    const catalogs = this._store.catalogData()?.catalogs.Leave ?? [];

    return requests.map((emp) => {
      const catalog = this.sharedService.getCatalogUsingKey(
        catalogs,
        emp.leaveType
      );
      return {
        ...emp,
        leaveType: catalog?.value ?? emp.leaveType,
      };
    });
  });

  employeesOnLeave = computed(() =>
    this.approverCardData().card.ManagerView.filter(
      (e) => e.onLeave || e.onSpecialLeave
    )
  );

  employeesOnWorkFromHome = computed(() =>
    this.approverCardData().card.ManagerView.filter((e) => e.onWrh)
  );

  availableEmployees = computed(() =>
    this.approverCardData().card.ManagerView.filter(
      (e) => !e.onLeave && !e.onWrh
    )
  );

  totalEmployees = computed(() => this.approverCardData().card.ManagerView);

  approverCardTypes = computed(() =>
    this.sharedService.getApproverCardDesigns().map((data) => {
      const card: IDataStatCardConfig = {
        ...data,
        count: 0,
        details: [],
        customTemplate: '',
      };

      const mapConfig = {
        [ApproverTitles.leave]: {
          list: this.employeesOnLeave(),
          template: this.employeeOnLeave,
          fallback: 'No employees are currently on leave.',
        },
        [ApproverTitles.wfh]: {
          list: this.employeesOnWorkFromHome(),
          template: this.employeesOnWRH,
          fallback: 'No employees are currently working from home.',
        },
        [ApproverTitles.available]: {
          list: this.availableEmployees(),
          template: this.availableEmployee,
          fallback: 'No employees are currently available.',
        },
        [ApproverTitles.total]: {
          list: this.totalEmployees(),
          template: this.totalEmployee,
          fallback: 'No employees found.',
        },
      };

      const config = mapConfig[data.title];
      if (config) {
        return {
          ...card,
          count: config.list.length,
          details: config.list,
          customTemplate: config.list.length
            ? config.template()
            : config.fallback,
        };
      }

      return card;
    })
  );

  // Template references
  totalEmployee =
    viewChild<TemplateRef<MoreTeamMembersComponent>>('totalEmployee');
  availableEmployee =
    viewChild<TemplateRef<MoreTeamMembersComponent>>('availableEmployee');
  employeeOnLeave =
    viewChild<TemplateRef<MoreTeamMembersComponent>>('employeeOnLeave');
  employeesOnWRH =
    viewChild<TemplateRef<MoreTeamMembersComponent>>('employeesOnWRH');

  constructor() {
    effect(() => {
      const cardData = this._store.cardDetails();
      if (!cardData) return;

      this.approverCardData.set(cardData);

      const pending = this.sharedService.getCatalogUsingKey(
        this.catalogData().catalogs['Approval Status'],
        approvalStatusKeys.PENDING
      );

      this.pendingStatus.set(pending?.value ?? '');
    });
  }

  // Updates the current selected tab index
  getTabIndexNumber(indexNumber: number) {
    this.index.set(indexNumber);
  }
}
