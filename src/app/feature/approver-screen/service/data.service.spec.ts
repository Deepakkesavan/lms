import { TestBed } from '@angular/core/testing';
import { DataService } from './data.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import {
  IApproverCardDetails,
  ILeaveApprovalDetails,
  ILeaveRequestData,
} from '../models/approver';
import { ENVIRONMENT } from '../../../../environment';

describe('DataService', () => {
  let service: DataService;
  let httpMock: HttpTestingController;

  const mockManagerId = 'M001';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DataService],
    });

    service = TestBed.inject(DataService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch employee leave requests', () => {
    const mockManagerId = 'M001';

    const mockResponse: ILeaveRequestData[] = [
      {
        employeeId: 'E001',
        leaveType: 'Casual Leave',
        startDate: new Date(),
        endDate: new Date(),
        approvalStatus: 'PENDING',
        days: 2,
        employeeName: 'John',
        reason: 'Sick leave',
      },
    ];

    service.getEmployeeLeaveRequests().subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(
      `${ENVIRONMENT.url}/api/Lms/manager/employee-leaves`
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ managerId: mockManagerId });

    req.flush(mockResponse);
  });

  it('should fetch approver card data', () => {
    const mockManagerId = 'M001';

    const mockApproverData: IApproverCardDetails = {
      card: {
        ManagerView: [
          {
            employeeId: 'IND-1001',
            firstName: 'sai',
            lastName: 'siri',
            emailId: 'sai@gmail.com',
            roleId: 'RL-501',
            roleName: 'Developer',
            onLeave: true,
            onWrh: false,
            onAvailable: false,
            onSpecialLeave: false,
          },
          {
            employeeId: 'IND-1001',
            firstName: 'sai',
            lastName: 'siri',
            emailId: 'sai@gmail.com',
            roleId: 'RL-501',
            roleName: 'Developer',
            onLeave: true,
            onWrh: false,
            onAvailable: false,
            onSpecialLeave: false,
          },
        ],
      },
    };

    service.getApproverData(mockManagerId).subscribe((res) => {
      expect(res).toEqual(mockApproverData);
    });

    const req = httpMock.expectOne(
      `${ENVIRONMENT.url}/api/Lms/manager/data-stats`
    );

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ managerId: mockManagerId });

    req.flush(mockApproverData);
  });

  it('should update employee leave request', () => {
    const mockLeaveRequest: ILeaveApprovalDetails = {
      employeeId: 'E001',
      approvalKey: 'APPROVED',
      startDate: new Date(),
      endDate: new Date(),
      leaveKey: 'CL',
    };

    const mockResponse = { message: 'Updated successfully' };

    service.updateEmployeeLeaveRequest(mockLeaveRequest).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(
      `${ENVIRONMENT.url}/api/Lms/manager/employee-leaves`
    );
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(mockLeaveRequest);
    req.flush(mockResponse);
  });
  it('should handle error on leave request update', () => {
    const mockLeaveRequest: ILeaveApprovalDetails = {
      employeeId: '123',
      leaveKey: 'casual',
      startDate: new Date(),
      endDate: new Date(),
      approvalKey: 'approved',
    };
    const errorMsg = 'Update failed';

    service.updateEmployeeLeaveRequest(mockLeaveRequest).subscribe({
      next: () => fail('should have failed'),
      error: (err) => {
        expect(err.status).toBe(500);
      },
    });

    const req = httpMock.expectOne(
      `${ENVIRONMENT.url}/api/Lms/manager/employee-leaves`
    );
    req.flush(
      { message: errorMsg },
      { status: 500, statusText: 'Server Error' }
    );
  });
});
