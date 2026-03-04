import {
  Component,
  TemplateRef,
  ViewChild,
  effect,
  inject,
  input, OnInit,
} from '@angular/core';
import { NgceIconModule } from '@clarium/ngce-icon';
import {
  IDetailedTeamMemberDataConfig,
  ITeamIconsConfig,
} from '../../shared/models/common';
import {
  DialogConfig,
  DialogService,
  IGridConfig,
  NgceComponentsModule,
} from '@clarium/ngce-components';
import { UserInfoComponent } from '../user-info/user-info.component';
import { CommonModule } from '@angular/common';
import { UserNameWithIconComponent } from '../user-name-with-icon/user-name-with-icon.component';
import { AssigneeResponse } from '../../feature/hr-screen/models/hr';

@Component({
  selector: 'lms-more-team-members',
  standalone: true,
  imports: [
    NgceIconModule,
    UserInfoComponent,
    NgceComponentsModule,
    CommonModule,
    UserNameWithIconComponent,
  ],
  templateUrl: './more-team-members.component.html',
  styleUrls: ['./more-team-members.component.scss'],
})
export class MoreTeamMembersComponent implements OnInit {
  @ViewChild('teamMemberDetails', { static: true })
  teamMemberDetails!: TemplateRef<unknown>;

  @ViewChild('employeeFullName', { static: true })
  employeeFullName!: TemplateRef<any>;

  teamMemberIconsToDisplay = input<number>(2);

  data: any = input<AssigneeResponse[]>();

  memberDataGridConfig!: IGridConfig;

  teamMembersDataConfig!: ITeamIconsConfig;

  detailedTeamMemberDataConfig!: IDetailedTeamMemberDataConfig;

  private dialogService = inject(DialogService);

  constructor() {
    effect(() => {
      const currentData = this.data();
      if (currentData) {
        this.teamMembersDataConfig = {
          data: currentData,
        };
        this.detailedTeamMemberDataConfig = {
          data: currentData,
        };
      }
    });
  }
  // State
  selectedUser!: AssigneeResponse | null;

  updateConfigForTeamMembers() {
    this.teamMembersDataConfig = {
      data: this.data,
      // icon:,
      // iconBackgroundColor:,
      // iconColor:,
      // arrowColor:,
    };
    this.detailedTeamMemberDataConfig = {
      data: this.data,
    };
  }
  ngOnInit() {
    this.updateConfigForTeamMembers();
    this.initializeMemberDataGrid();
  }

  /**
   * Get initials for team members to display
   * @returns Array of initials strings
   */

  getTeamMemberInitials(): string[] {
    return this.teamMembersDataConfig.data
      .slice(0, this.teamMemberIconsToDisplay())
      .map((user: AssigneeResponse) => {
        const first = user.firstName?.charAt(0)?.toUpperCase() || '';
        const second =
          user.lastName?.charAt(0)?.toUpperCase() ||
          user.firstName?.charAt(1)?.toUpperCase() ||
          '';
        return `${first}${second}`;
      });
  }

  /**
   * TrackBy function for initials loop
   * @param initials The initials string
   * @returns Unique identifier
   */
  trackByInitials(initials: string): string {
    return initials;
  }

  /**
   * TrackBy function for user loop
   * @param user The team member data
   * @returns Unique identifier
   */
  trackByUser(user: AssigneeResponse): string {
    return user.employeeId;
  }

  /**
   * Update selected user for details view
   * @param user The user to show details for
   */
  showDetails(user: AssigneeResponse): void {
    this.selectedUser = user;
  }

  hideDetails() {
    this.selectedUser = null;
  }

  /**
   * Open dialog with team members details
   */
  openAllTeamMembers(): void {
    const config: DialogConfig = {
      content: this.teamMemberDetails,
      header: 'Team Members',
      dialogType: 'classic',
      width: '65vw',
      height: '75vh',
      closeOnBackdropClick: false,
      accessibility: true,
      draggable: true,
      closeButton: true,
      styles: {
        dialog: { padding: '0' },
        header: {
          backgroundColor: 'var(--neutral-light)',
          padding: '10px',
        },
        body: {
          padding: '20px',
          backgroundColor: 'var(--bg-surface)',
        },
      },
    };

    this.dialogService.openDialog(config);
  }

  /**
   * Handle view toggle between grid and list
   * @param event Toggle event data
   */
  onViewToggle(event: any): void {
    const config = this.detailedTeamMemberDataConfig;
    config.enableListView = event.label === 'Grid View';
    config.enableGridView = event.label === 'List View';
  }

  initializeMemberDataGrid() {
    this.memberDataGridConfig = {
      columns: [
        {
          field: 'employeeId',
          header: 'Employee Id',
          sortable: true,
          headerAlign: 'left',
          editable: false,
          type: 'text',
          filterable: true,
        },
        {
          field: 'employeeName',
          header: 'Name',
          sortable: true,
          headerAlign: 'left',
          editable: false,
          type: 'text',
          filterable: true,
          customTemplate: this.employeeFullName,
        },
        {
          field: 'emailId',
          header: 'EmailId',
          sortable: true,
          headerAlign: 'left',
          editable: false,
          type: 'text',
          filterable: true,
        },
        {
          field: 'roleName',
          header: 'Role',
          sortable: true,
          headerAlign: 'left',
          editable: false,
          type: 'text',
          filterable: true,
        },
        {
          field: 'contactNumber',
          header: 'Contact Number',
          sortable: true,
          headerAlign: 'left',
          editable: false,
          type: 'date',
          filterable: true,
        },
      ],
      data: this.data(),
      sorting: {
        enabled: true,
      },
      pagination: {
        enabled: true,
        defaultVariant: true,
        pageDetails: true,
        pageSize: 5,
      },
      draggable: true,
      filtering: {
        enabled: true,
        globalFilter: true,
        rowFilter: false,
      },
      export: {
        enabled: false,
        formats: ['csv', 'excel', 'pdf'],
      },
      theme: {
        darkMode: false,
        customStyles: {},
      },
      dataAlign: 'left',
    };
  }
}
