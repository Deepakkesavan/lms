import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproverScreenComponent } from './approver-screen.component';
import { SharedService } from '../../../shared/shared.service';
import { ApproverScreenStore } from '../store/approver-screen.store';
import { signal } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { ICatalog } from 'app/shared/models/common';

describe('ApproverScreenComponent', () => {
  let component: ApproverScreenComponent;
  let fixture: ComponentFixture<ApproverScreenComponent>;
  let sharedServiceMock: jasmine.SpyObj<SharedService>;
  let approverScreenStoreMock: jasmine.SpyObj<ApproverScreenStore>;

  const mockCardData = {
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

  const mockCatalogResponse = {
    catalogs: {
      Leave: [
        { key: 'casual', value: 'Casual Leave' },
        { key: 'WFH', value: 'Work From Home' },
        { key: 'privilege', value: 'Privilege Leave' },
        { key: 'sick', value: 'Sick Leave' },
        { key: 'LOP', value: 'Leave Without Pay' },
      ],
      Gender: [
        { key: 'male', value: 'Male' },
        { key: 'female', value: 'Female' },
      ],
      'Approval Status': [
        { key: 'approved', value: 'Approved' },
        { key: 'rejected', value: 'Rejected' },
      ],
    },
  };

  const mockLeaveRequests = [
    {
      employeeId: 'IND-1005',
      employeeName: 'sai sirriisha',
      leaveType: 'privilege',
      startDate: '2025-06-11T00:00:00',
      endDate: '2025-06-11T23:59:59',
      days: 1,
      reason: 'demo',
      approvalStatus: 'pending',
    },
    {
      employeeId: 'IND-1006',
      employeeName: 'john doe',
      leaveType: 'casual',
      startDate: '2025-06-12T00:00:00',
      endDate: '2025-06-13T23:59:59',
      days: 2,
      reason: 'vacation',
      approvalStatus: 'approved',
    },
  ];

  beforeEach(async () => {
    sharedServiceMock = jasmine.createSpyObj('SharedService', [
      'getCatalogUsingKey',
      'getApproverCardDesigns',
      'getLeaveTypeCardConfig',
    ]);

    sharedServiceMock.getCatalogUsingKey.and.callFake(
      (catalogs: ICatalog[], key: string) => catalogs.find((c: ICatalog) => (c.key == key))!
    );

    sharedServiceMock.getApproverCardDesigns.and.returnValue([
      {
        title: 'Total',
        iconClassName: 'ngce-calendar-8',
        iconColor: 'rgb(59, 130, 246)',
        iconBackgroundColor: 'rgba(239, 246, 255, 1)',
      },
      {
        title: 'Available',
        iconClassName: 'ngce-check',
        iconColor: 'rgb(34, 197, 94)',
        iconBackgroundColor: 'rgb(220, 252, 231)',
      },
    ]);

    sharedServiceMock.getLeaveTypeCardConfig.and.returnValue([
      {
        type: 'privilege',
        iconClassName: 'ngce-award-2',
        iconBackgroundColor: 'rgba(232, 241, 250, 1)',
        iconColor: 'rgb(30, 64, 175)',
      },
      {
        type: 'casual',
        iconClassName: 'ngce-fog-sun',
        iconBackgroundColor: 'rgba(239, 246, 255, 1)',
        iconColor: 'rgb(59, 130, 246)',
      },
      {
        type: 'compoff',
        iconClassName: 'ngce-creative-commons',
        iconBackgroundColor: 'rgba(255, 243, 205, 1)',
        iconColor: 'rgb(245, 158, 11)',
      },
      {
        type: 'wfh',
        iconClassName: 'ngce-laptop',
        iconBackgroundColor: 'rgba(219, 234, 254, 1)',
        iconColor: 'rgb(37, 99, 235)',
      },

      {
        type: 'sick',
        iconClassName: 'ngce-stethoscope',
        iconBackgroundColor: 'rgba(254, 226, 226, 1)',
        iconColor: 'rgb(239, 68, 68)',
      },
    ]);

    approverScreenStoreMock = {
      cardDetails: signal(mockCardData),
      leaveRequests: signal(mockLeaveRequests),
      catalogData: signal(mockCatalogResponse),
    } as any;

    await TestBed.configureTestingModule({
      imports: [ApproverScreenComponent],
      providers: [
        { provide: SharedService, useValue: sharedServiceMock },
        { provide: ApproverScreenStore, useValue: approverScreenStoreMock },
        provideHttpClient(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ApproverScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return correct leave types for updatedLeaveRequests', () => {
    const result = component.updatedLeaveRequests();
    expect(result[0].leaveType).toBe('Casual Leave');
  });

  it('should return employess on leave correctly', () => {
    const result = component.employeesOnLeave();
    expect(result.length).toBe(0);
  });

  it('should return employess on wrh correctly', () => {
    const result = component.employeesOnWorkFromHome();
    expect(result.length).toBe(0);
  });

  it('should return available employees correctly', () => {
    const result = component.availableEmployees();
    expect(result.length).toBe(1);
  });

  it('should update index signal', () => {
    component.getTabIndexNumber(3);
    expect(component.index()).toBe(3);
  });
});
