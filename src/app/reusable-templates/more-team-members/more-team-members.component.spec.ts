import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoreTeamMembersComponent } from './more-team-members.component';
import { DialogConfig, DialogService } from '@clarium/ngce-components';
import { TemplateRef, signal } from '@angular/core';
import { AssigneeResponse } from '../../feature/hr-screen/models/hr';

describe('MoreTeamMembersComponent', () => {
  let component: MoreTeamMembersComponent;
  let fixture: ComponentFixture<MoreTeamMembersComponent>;
  let mockDialogService: jasmine.SpyObj<DialogService>;

  // Mock TemplateRefs for ViewChild
  const mockTeamMemberDetailsTemplate = {} as TemplateRef<any>;
  const mockEmployeeFullNameTemplate = {} as TemplateRef<any>;

  beforeEach(async () => {
    mockDialogService = jasmine.createSpyObj('DialogService', ['openDialog']);

    await TestBed.configureTestingModule({
      imports: [MoreTeamMembersComponent],
      providers: [{ provide: DialogService, useValue: mockDialogService }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MoreTeamMembersComponent);
    component = fixture.componentInstance;

    // Mock @ViewChild templates
    component.teamMemberDetails = mockTeamMemberDetailsTemplate;
    component.employeeFullName = mockEmployeeFullNameTemplate;

    // Mock input signals
    fixture.componentRef.setInput('teamMemberIconsToDisplay', 2);
    component.data = signal([
      {
        employeeId: 'EMP001',
        firstName: 'John',
        lastName: 'Doe',
        emailId: 'john.doe@example.com',
        roleName: 'Developer',
        contactNumber: 1234567890,
        onAvailable: true,
        onLeave: false,
        onSpecialLeave: false,
        onWrh: false,
        roleId: 'RL-500',
      },
      {
        employeeId: 'EMP002',
        firstName: 'Jane',
        lastName: 'Smith',
        emailId: 'jane.smith@example.com',
        roleName: 'Manager',
        contactNumber: 1987654321,
        onAvailable: true,
        onLeave: false,
        onSpecialLeave: false,
        onWrh: false,
        roleId: 'RL-500',
      },
    ] as AssigneeResponse[]);

    fixture.detectChanges(); // Trigger ngOnInit and effects
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize teamMembersDataConfig and detailedTeamMemberDataConfig from data signal', () => {
    expect(component.teamMembersDataConfig).toBeDefined();
    expect(component.detailedTeamMemberDataConfig).toBeDefined();
    expect(component.teamMembersDataConfig.data.length).toBe(2);
    expect(component.detailedTeamMemberDataConfig.data.length).toBe(2);
  });

  it('should return correct initials from getTeamMemberInitials', () => {
    const initials = component.getTeamMemberInitials();
    expect(initials.length).toBe(2);
    expect(initials).toContain('JD'); // John Doe
    expect(initials).toContain('JS'); // Jane Smith
  });

  it('should track by initials', () => {
    expect(component.trackByInitials('JD')).toBe('JD');
  });

  it('should track by user employeeId', () => {
    const user = component.data()[0];
    expect(component.trackByUser(user)).toBe(user.employeeId);
  });

  it('should set selectedUser on showDetails and clear on hideDetails', () => {
    const user = component.data()[0];
    component.showDetails(user);
    expect(component.selectedUser).toBe(user);

    component.hideDetails();
    expect(component.selectedUser).toBeNull();
  });

  it('should open dialog with correct config on openAllTeamMembers', () => {
    component.openAllTeamMembers();

    expect(mockDialogService.openDialog).toHaveBeenCalledTimes(1);
    const config: DialogConfig = mockDialogService.openDialog.calls.mostRecent().args[0];

    expect(config.content).toBe(component.teamMemberDetails);
    expect(config.header).toBe('Team Members');
    expect(config.dialogType).toBe('classic');
    expect(config.width).toBe('65vw');
    expect(config.height).toBe('75vh');
    expect(config.closeOnBackdropClick).toBeFalse();
    expect(config.draggable).toBeTrue();
    expect(config.closeButton).toBeTrue();
    expect(config.styles).toBeDefined();
    expect(config.styles?.dialog).toEqual({ padding: '0' });
  });

  it('should toggle view correctly in onViewToggle', () => {
    // Initially enableListView and enableGridView undefined
    component.detailedTeamMemberDataConfig.enableListView = false;
    component.detailedTeamMemberDataConfig.enableGridView = true;

    // Toggle to 'Grid View' => enableListView = true, enableGridView = false
    component.onViewToggle({ label: 'Grid View' });
    expect(component.detailedTeamMemberDataConfig.enableListView).toBeTrue();
    expect(component.detailedTeamMemberDataConfig.enableGridView).toBeFalse();

    // Toggle to 'List View' => enableListView = false, enableGridView = true
    component.onViewToggle({ label: 'List View' });
    expect(component.detailedTeamMemberDataConfig.enableListView).toBeFalse();
    expect(component.detailedTeamMemberDataConfig.enableGridView).toBeTrue();
  });

  it('should initialize memberDataGridConfig with correct columns and data', () => {
    component.initializeMemberDataGrid();

    expect(component.memberDataGridConfig).toBeDefined();
    expect(component.memberDataGridConfig.columns.length).toBeGreaterThan(0);

    const nameColumn = component.memberDataGridConfig.columns.find(c => c.field === 'employeeName');
    expect(nameColumn).toBeDefined();
    expect(nameColumn?.customTemplate).toBe(component.employeeFullName);

    expect(component.memberDataGridConfig.data).toEqual(component.data());
    expect(component.memberDataGridConfig.sorting?.enabled).toBeTrue();
    expect(component.memberDataGridConfig.pagination?.pageSize).toBe(5);
  });
});
