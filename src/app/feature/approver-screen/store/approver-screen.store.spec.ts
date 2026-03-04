import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { ApproverScreenStore } from './approver-screen.store';
import { DataService } from '../service/data.service';
import { SharedService } from '../../../shared/shared.service';
import { ILeaveApprovalDetails, ILeaveRequestData } from '../models/approver';

describe('ApproverScreenStore', () => {
  let store: ApproverScreenStore;

  const mockApproverData = {
    card: {
      ManagerView: [
        {
          employeeId: 'IND-1014',
          firstName: 'Arthur',
          lastName: 'Lewin',
          emailId: 'arthurlewin@gmail.com',
          roleId: 'RL-502',
          roleName: 'Developer',
          onLeave: false,
          onWrh: false,
          onAvailable: true,
          onSpecialLeave: false,
          contactNumber: 0,
        },
      ],
    },
  };

  const mockLeaveRequests = [
    {
      employeeId: 'IND-1005',
      employeeName: 'sai sirriisha',
      leaveType: 'casual',
      startDate: new Date('2025-06-04T00:00:00'),
      endDate: new Date('2025-06-04T23:59:59'),
      days: 1,
      reason: 'demo testing',
      approvalStatus: 'pending',
    },
    {
      employeeId: 'IND-1005',
      employeeName: 'sai sirriisha',
      leaveType: 'privilege',
      startDate: new Date('2025-06-04T00:00:00'),
      endDate: new Date('2025-06-04T23:59:59'),
      days: 1,
      reason: 'demo',
      approvalStatus: 'pending',
    },
  ] as ILeaveRequestData[];

  const mockCatalogs = {
    catalogs: {
      Leave: [{ key: 'privilege', value: 'Privilege Leave' }],
      'Approval Status': [{ key: 'approved', value: 'Approved' }],
      Gender: [{ key: 'male', value: 'Male' }],
    },
  };

  beforeEach(() => {
    const dataServiceMock = jasmine.createSpyObj('DataService', [
      'getApproverData',
      'getEmployeeLeaveRequests',
    ]);
    const sharedServiceMock = jasmine.createSpyObj('SharedService', [
      'getCatalogs',
    ]);

    dataServiceMock.getApproverData.and.returnValue(of(mockApproverData));
    dataServiceMock.getEmployeeLeaveRequests.and.returnValue(
      of(mockLeaveRequests)
    );
    sharedServiceMock.getCatalogs.and.returnValue(of(mockCatalogs));

    TestBed.configureTestingModule({
      providers: [
        ApproverScreenStore,
        { provide: DataService, useValue: dataServiceMock },
        { provide: SharedService, useValue: sharedServiceMock },
      ],
    });

    store = TestBed.inject(ApproverScreenStore);
  });

  it('should create the store', () => {
    expect(store).toBeTruthy();
  });

  it('should have cardDetails signal initialized', () => {
    expect(store.cardDetails()).toEqual(mockApproverData);
  });

  it('should have leaveRequests signal initialized', () => {
    expect(store.leaveRequests()).toEqual(mockLeaveRequests);
  });

  it('should have catalogData signal initialized', () => {
    expect(store.catalogData()).toEqual(mockCatalogs);
  });
});
