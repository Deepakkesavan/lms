import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrPage } from './hr.page';
import { SharedService } from '../../../shared/shared.service';
import { AssigneeResponse, ICardConfig, IPendingApproval } from '../models/hr';
import { ICatalog } from '../../../shared/models/common';
import { HrStore } from '../store/hr.store';
import { Inject, signal } from '@angular/core';
import { HrTitles } from '../../../shared/literal-types/literal-types';
import { CommonModule } from '@angular/common';

describe('HrPage', () => {
  let component: HrPage;
  let fixture: ComponentFixture<HrPage>;
  let mockSharedService: jasmine.SpyObj<SharedService>;
  let mockHrStore: jasmine.SpyObj<HrStore>;

  beforeEach(async () => {
    mockSharedService = jasmine.createSpyObj('SharedService', [
      'getHrCardDesigns',
      'getDropdownConfig',
      'getDropdownKey',
      'getDropdownValue',
      'getCatalogUsingKey',
      'isLeaveReportKey',
    ]);

    mockHrStore = jasmine.createSpyObj('HrStore', [
      'pendingLeaves',
      'catalogData',
      'leaveReport',
      'cardData',
    ]);
    mockHrStore.pendingLeaves.and.returnValue(signal([])());
    mockHrStore.catalogData.and.returnValue(
      signal({ catalogs: { Leave: [], 'Approval Status': [], Gender: [] } })()
    );
    mockHrStore.leaveReport.and.returnValue(
      signal({ today: {}, lastWeek: {}, lastMonth: {}, lastYear: {} })()
    );
    mockHrStore.cardData.and.returnValue(
      signal({
        card: {
          HrView: [],
        },
      })()
    );

    mockSharedService.getHrCardDesigns.and.returnValue([
      {
        title: 'Leave',
        iconClassName: '',
        iconColor: '',
        iconBackgroundColor: '',
      },
      {
        title: 'Work From Home',
        iconClassName: '',
        iconColor: '',
        iconBackgroundColor: '',
      },
      {
        title: 'Special Leaves',
        iconClassName: '',
        iconColor: '',
        iconBackgroundColor: '',
      },
    ]);
    mockSharedService.getDropdownConfig.and.returnValue({ org: 'Org Name' });
    mockSharedService.getDropdownValue.and.returnValue('Today');
    mockSharedService.getCatalogUsingKey.and.returnValue({
      key: 'casual',
      value: 'Casual Leave',
    });
    mockSharedService.getDropdownKey.and.returnValue('key');
    mockSharedService.isLeaveReportKey.and.returnValue(true);

    await TestBed.configureTestingModule({
      imports: [CommonModule, HrPage],
      providers: [
        { provide: SharedService, useValue: mockSharedService },
        { provide: HrStore, useValue: mockHrStore },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HrPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load dropdown data correctly', () => {
    expect(component.dropdownData.length).toBeGreaterThan(0);
    expect(component.lopData.length).toBeGreaterThan(0);
  });

  it('should update labels on clicking next', () => {
    const initial = [...component.labels];
    component.onClickNextMonths();
    expect(component.labels).not.toEqual(initial);
  });

  it('should update doughnut key when value changes', () => {
    component.onSelectOrgaisationValueChange({ value: 'new-key' });
    expect(component.doughnutKey()).toBe('new-key');
  });

  it('should return true for empty leave data', () => {
    const result = component.checkDataEmpty({
      Casual: 0,
      Sick: 0,
      WFH: 0,
    });
    expect(result).toBeTrue();
  });

  it('should return false for non-empty leave data', () => {
    const result = component.checkDataEmpty({
      Casual: 1,
      Sick: 0,
      WFH: 0,
    });
    expect(result).toBeFalse();
  });

  it('should update project data on project period change', () => {
    component.onSelectProjectPeriodChange({ value: 'last Week' });
    expect(component.projectData.length).toBeGreaterThan(0);
  });

  it('should update project data on project value change', () => {
    component.onSelectProjectValueChange({ value: 'Leave Management' });
    expect(component.projectData.length).toBeGreaterThan(0);
  });

  it('should return transformed and sorted pending leaves', () => {
    const pendingLeavesMock = [
      {
        employeeId: 'IND-1001',
        employeeName: 'Alice',
        startDate: '2024-01-10',
        endDate: '2024-01-12',
        leaveTypeKey: 'casual',
      },
      {
        employeeId: 'IND-1002',
        employeeName: 'Bob',
        startDate: '2024-02-01',
        endDate: '2024-02-03',
        leaveTypeKey: 'sick',
      },
    ];

    const catalogsMock = [
      { key: 'casual', value: 'Casual Leave' },
      { key: 'sick', value: 'Sick Leave' },
    ];

    // Arrange mock return values
    mockHrStore.pendingLeaves.and.returnValue(signal(pendingLeavesMock)());
    mockHrStore.catalogData.and.returnValue(
      signal({
        catalogs: { Leave: catalogsMock, 'Approval Status': [], Gender: [] },
      })()
    );

    mockSharedService.getCatalogUsingKey
      .withArgs(catalogsMock, 'casual')
      .and.returnValue({ key: 'casual', value: 'Casual Leave' });
    mockSharedService.getCatalogUsingKey
      .withArgs(catalogsMock, 'sick')
      .and.returnValue({ key: 'sick', value: 'Sick Leave' });

    // Re-create component to apply new mock signals
    fixture = TestBed.createComponent(HrPage);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const result = component.getPendingLeaves();

    expect(result.length).toBe(2);
    expect(result[0].employeeName).toBe('Bob'); // Bob has later startDate
    expect(result[0].leaveTypeKey).toBe('Sick Leave');
    expect(result[1].leaveTypeKey).toBe('Casual Leave');
  });

  it('should return empty transformed list when empty list is passed', () => {
    mockHrStore.pendingLeaves.and.returnValue(signal(undefined as any)());
    mockHrStore.catalogData.and.returnValue(
      signal({ catalogs: { Leave: undefined } } as any)()
    );

    fixture = TestBed.createComponent(HrPage);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const result = component.getPendingLeaves();

    expect(result.length).toBe(0);
  });

  it('should return filtered employees list who are on leave', () => {
    mockHrStore.cardData.and.returnValue(
      signal({
        card: {
          HrView: [
            {
              employeeId: 'IND-1000',
              firstName: 'Alex',
              lastName: 'Brown',
              emailId: 'alex123@gmail.com',
              roleId: 'RL-500',
              roleName: 'Developer',
              onLeave: true,
              onWrh: false,
              onAvailable: false,
              onSpecialLeave: false,
            },
            {
              employeeId: 'IND-1000',
              firstName: 'Jhon',
              lastName: 'Whick',
              emailId: 'jhon123@gmail.com',
              roleId: 'RL-500',
              roleName: 'Developer',
              onLeave: false,
              onWrh: false,
              onAvailable: false,
              onSpecialLeave: false,
            },
          ],
        },
      })()
    );

    fixture = TestBed.createComponent(HrPage);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const result = component.employeesOnLeave();

    expect(result.length).toBe(1);
  });

  it('should return filtered employees list who are available', () => {
    mockHrStore.cardData.and.returnValue(
      signal({
        card: {
          HrView: [
            {
              employeeId: 'IND-1000',
              firstName: 'Alex',
              lastName: 'Brown',
              emailId: 'alex123@gmail.com',
              roleId: 'RL-500',
              roleName: 'Developer',
              onLeave: false,
              onWrh: false,
              onAvailable: true,
              onSpecialLeave: false,
            },
            {
              employeeId: 'IND-1000',
              firstName: 'Jhon',
              lastName: 'Whick',
              emailId: 'jhon123@gmail.com',
              roleId: 'RL-500',
              roleName: 'Developer',
              onLeave: false,
              onWrh: false,
              onAvailable: true,
              onSpecialLeave: false,
            },
          ],
        },
      })()
    );

    fixture = TestBed.createComponent(HrPage);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const result = component.availableEmployees();

    expect(result.length).toBe(2);
  });

  it('should return total employees count', () => {
    mockHrStore.cardData.and.returnValue(
      signal({
        card: {
          HrView: [
            {
              employeeId: 'IND-1000',
              firstName: 'Alex',
              lastName: 'Brown',
              emailId: 'alex123@gmail.com',
              roleId: 'RL-500',
              roleName: 'Developer',
              onLeave: true,
              onWrh: false,
              onAvailable: false,
              onSpecialLeave: false,
            },
            {
              employeeId: 'IND-1000',
              firstName: 'Jhon',
              lastName: 'Whick',
              emailId: 'jhon123@gmail.com',
              roleId: 'RL-500',
              roleName: 'Developer',
              onLeave: false,
              onWrh: false,
              onAvailable: false,
              onSpecialLeave: false,
            },
          ],
        },
      })()
    );

    fixture = TestBed.createComponent(HrPage);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const result = component.totalEmployees();

    expect(result.length).toBe(2);
  });

  it('should reset index to 0 when index >= 8', () => {
    // Set index to a value >= 8 to trigger reset
    component.index = 8;
    component.end = 12;
    component.labels = component.getMonths(component.index, component.end);

    component.onClickNextMonths(); // should reset index to 0

    expect(component.index).toBe(0);
    expect(component.end).toBe(4);
    expect(component.labels).toEqual(component.getMonths(0, 4));
  });

  it('should return work from home card with employees and use wfhTemplate', () => {
    const wfhEmployee: AssigneeResponse = {
      employeeId: '',
      emailId: '',
      firstName: '',
      lastName: '',
      onAvailable: false,
      onLeave: false,
      onSpecialLeave: false,
      roleId: '',
      roleName: '',
      onWrh: true,
    };
    mockHrStore.cardData.and.returnValue(
      signal({ card: { HrView: [wfhEmployee] } })()
    );

    mockSharedService.getHrCardDesigns.and.returnValue([
      {
        title: HrTitles.wfh,
        iconClassName: '',
        iconColor: '',
        iconBackgroundColor: '',
      },
    ]);

    fixture = TestBed.createComponent(HrPage);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const cards = component.hrCardTypes();

    expect(cards.length).toBe(1);
    expect(cards[0].count).toBe(1);
    expect(cards[0].details.length).toBe(1);
    expect(typeof cards[0].customTemplate).not.toBe('string');
  });

  it('should return special leaves card with employees and use specialLeavesTemplate', () => {
    const specialLeaveEmployee = {
      employeeId: '',
      emailId: '',
      firstName: '',
      lastName: '',
      onAvailable: false,
      onLeave: false,
      onSpecialLeave: true,
      roleId: '',
      roleName: '',
      onWrh: false,
    };
    mockHrStore.cardData.and.returnValue(
      signal({ card: { HrView: [specialLeaveEmployee] } })()
    );

    mockSharedService.getHrCardDesigns.and.returnValue([
      {
        title: HrTitles.specialLeaves,
        iconClassName: '',
        iconColor: '',
        iconBackgroundColor: '',
      },
    ]);

    fixture = TestBed.createComponent(HrPage);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const cards = component.hrCardTypes();

    expect(cards.length).toBe(1);
    expect(cards[0].count).toBe(1);
    expect(cards[0].details.length).toBe(1);
    expect(typeof cards[0].customTemplate).not.toBe('string');
  });

  it('should return default card config for unknown title', () => {
    mockSharedService.getHrCardDesigns.and.returnValue([
      {
        title: 'Unmapped Card',
        iconClassName: '',
        iconColor: '',
        iconBackgroundColor: '',
      },
    ]);

    fixture = TestBed.createComponent(HrPage);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const cards = component.hrCardTypes();
    expect(cards.length).toBe(1);
    expect(cards[0].count).toBe(0);
    expect(cards[0].customTemplate).toBe('');
  });
});
