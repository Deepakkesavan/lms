import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeComponent } from './employee.page';
import { signal } from '@angular/core';
import { SharedService } from '../../../../shared/shared.service';
import { DialogBridgeService } from '../../service/dialog-bridge/dialog-bridge.service';
import { EmployeeStoreService } from '../../../../store/employee-store.service';
import {
  IDashboardCardDetails,
  ILeaveTypeConfig,
} from '../../../../shared/models/dashboard';
import { ICatalog } from '../../../../shared/models/common';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NgceComponentsModule } from '@clarium/ngce-components';

import { NgceIconModule } from '@clarium/ngce-icon';
import { DataStatComponent } from '../../components/data-stat/data-stat.component';
import { HolidaysComponent } from '../../components/holidays/holidays.component';
import { LatestLeavesComponent } from '../../components/latest-leaves/latest-leaves.component';
import { LeaveRequestComponent } from '../../components/leave-request/leave-request.component';
import { PopupComponent } from '../../components/popup/popup.component';

describe('EmployeeComponent', () => {
  let component: EmployeeComponent;
  let fixture: ComponentFixture<EmployeeComponent>;
  let mockSharedService: jasmine.SpyObj<SharedService>;
  let mockDialogBridge: jasmine.SpyObj<DialogBridgeService>;
  let mockEmployeeStore: jasmine.SpyObj<EmployeeStoreService>;

  // Mock data for testing
  const mockCardData: IDashboardCardDetails[] = [
    {
      leaveType: 'ANNUAL',
      available: 10,
      booked: 2,
      iconClassName: '',
      iconBackgroundColor: '',
      iconColor: '',
    },
    {
      leaveType: 'SICK',
      available: 5,
      booked: 1,
      iconClassName: '',
      iconBackgroundColor: '',
      iconColor: '',
    },
  ];
  const mockConfigData: ILeaveTypeConfig[] = [
    {
      type: 'annual',
      iconClassName: 'fa-vacation',
      iconBackgroundColor: '#fff',
      iconColor: '#000',
    },
    {
      type: 'sick',
      iconClassName: 'fa-hospital',
      iconBackgroundColor: '#eee',
      iconColor: '#333',
    },
  ];

  const mockLeaveTypes: ICatalog[] = [
    { key: 'annual', value: 'Annual Leave' },
    { key: 'sick', value: 'Sick Leave' },
  ];

  beforeEach(async () => {
    mockSharedService = jasmine.createSpyObj('SharedService', [
      'getCardStyles',
    ]);
    mockDialogBridge = jasmine.createSpyObj('DialogBridgeService', [
      'requestOpenForm',
      'openFormRequest',
    ]);
    mockEmployeeStore = jasmine.createSpyObj(
      'EmployeeStoreService',
      ['loadLeaveBalance'],
      {
        holidayDetails: () => [],
        employeeLeaveDetails: signal([]),
        leaveTypeAndColors: () => ({ annual: '#fff', sick: '#eee' }),
        catalogData: () => ({
          catalogs: {
            Leave: mockLeaveTypes,
            'Approval Status': [],
            Gender: [],
          },
        }),
        getLeaveTypeCardConfig: mockConfigData,
        leaveBalanceData: () => ({
          card: { LeaveTypeCard: mockCardData },
        }),
      }
    );

    await TestBed.configureTestingModule({
      imports: [
        EmployeeComponent,
        NgceComponentsModule,
        DataStatComponent,
        LeaveRequestComponent,
        LatestLeavesComponent,
        HolidaysComponent,
        NgceIconModule,
        CommonModule,
        PopupComponent,
      ],
      providers: [
        { provide: SharedService, useValue: mockSharedService },
        { provide: DialogBridgeService, useValue: mockDialogBridge },
        { provide: EmployeeStoreService, useValue: mockEmployeeStore },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and should set card styles', () => {
    expect(component).toBeTruthy();
    const mockStyles = {
      width: '100px',
      cursor: 'pointer',
      border: '1px solid grey',
      'background-color': 'white',
      height: '200px',
    };
    mockSharedService.getCardStyles.and.returnValue(mockStyles);

    component.ngOnInit();
    expect(mockSharedService.getCardStyles).toHaveBeenCalled();
    expect(component.cardStyles).toEqual(mockStyles);
  });
});
