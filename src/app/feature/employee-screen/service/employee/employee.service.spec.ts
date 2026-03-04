import { TestBed } from '@angular/core/testing';

import { EmployeeService } from './employee.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import {
  IHolidayDetails,
  ILeaveDetails,
  ILeaveTypeCard,
} from '../../../../shared/models/dashboard';
import { UpdateLeavePayload } from '../../../../shared/models/common';

describe('EmployeeService', () => {
  let service: EmployeeService;
  let httpMock: HttpTestingController;

  const EMPLOYEEID = 'EMP-001'; // Mock employee id for tests

  const mockENVIRONMENT = {
    url: 'http://localhost:5006',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        EmployeeService,
        { provide: 'ENVIRONMENT', useValue: mockENVIRONMENT },
      ],
    });

    service = TestBed.inject(EmployeeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verify no outstanding requests
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#getHolidayDetails', () => {
    it('should return an Observable<IHolidayDetails[]>', () => {
      const mockHolidays: IHolidayDetails[] = [
        {
          name: 'New Year',
          description: 'New Year Holiday',
          date: new Date('2023-01-01'),
        },
      ];

      service.getHolidayDetails().subscribe((res) => {
        expect(res).toEqual(mockHolidays);
      });

      const req = httpMock.expectOne(`${mockENVIRONMENT.url}/api/Lms/holidays`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body.year).toBe(new Date().getFullYear());

      req.flush(mockHolidays);
    });
  });

  describe('#getLeaveDetails', () => {
    it('should return an Observable<ILeaveDetails[]>', () => {
      const mockLeaves: ILeaveDetails[] = [
        {
          leaveTypeKey: 'casual',
          startDate: '2023-01-01',
          endDate: '2023-01-01',
          employeeId: EMPLOYEEID,
          reason: 'Family event',
          requestedDays: 1,
        },
      ];

      service.getLeaveDetails().subscribe((res) => {
        expect(res).toEqual(mockLeaves);
      });

      const req = httpMock.expectOne(
        `${mockENVIRONMENT.url}/api/Lms/employee-leave`
      );
      expect(req.request.method).toBe('POST');

      req.flush(mockLeaves);
    });
  });

  describe('#addLeaveDetails', () => {
    it('should post leave details and return the added leave', () => {
      const newLeave: ILeaveDetails = {
        leaveTypeKey: 'sick',
        startDate: '2023-01-02',
        endDate: '2023-01-02',
        employeeId: EMPLOYEEID,
        reason: 'Not feeling well',
      };

      service.addLeaveDetails(newLeave).subscribe((res) => {
        expect(res).toEqual(newLeave);
      });

      const req = httpMock.expectOne(
        `${mockENVIRONMENT.url}/api/Lms/employee-leave/add`
      );
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newLeave);

      req.flush(newLeave);
    });
  });

  describe('#updateLeaveDetails', () => {
    it('should patch leave details and return the updated leave', () => {
      const updatedLeavePayload: UpdateLeavePayload = {
        oldLeave: {
          leaveTypeKey: 'casual',
          startDate: '2023-01-01',
          endDate: '2023-01-01',
          employeeId: EMPLOYEEID,
          reason: 'Family event',
        },
        newLeave: {
          leaveTypeKey: 'casual',
          startDate: '2023-01-01',
          endDate: '2023-01-01',
          employeeId: EMPLOYEEID,
          reason: 'Updated reason',
        },
      };

      service.updateLeaveDetails(updatedLeavePayload).subscribe((res) => {
        expect(res).toEqual(updatedLeavePayload.newLeave);
      });

      const req = httpMock.expectOne(
        `${mockENVIRONMENT.url}/api/Lms/employee-leave/update`
      );
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(updatedLeavePayload);

      req.flush(updatedLeavePayload.newLeave);
    });
  });

  describe('#saveLeaveDetailsAsDraft', () => {
    it('should post leave details as draft and return the drafted leave', () => {
      const draftLeave: ILeaveDetails = {
        leaveTypeKey: 'draft',
        startDate: '2023-01-03',
        endDate: '2023-01-03',
        employeeId: EMPLOYEEID,
        reason: 'Tentative leave',
      };

      service.saveLeaveDetailsAsDraft(draftLeave).subscribe((res) => {
        expect(res).toEqual(draftLeave);
      });

      const req = httpMock.expectOne(
        `${mockENVIRONMENT.url}/api/Lms/employee-leave/save-as-draft`
      );
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(draftLeave);

      req.flush(draftLeave);
    });
  });

  describe('#cancelLeaveDetails', () => {
    it('should delete leave details and return deleted leave', () => {
      const leaveToDelete: ILeaveDetails = {
        leaveTypeKey: 'casual',
        startDate: '2023-01-01',
        endDate: '2023-01-01',
        employeeId: EMPLOYEEID,
        reason: 'Family event',
      };

      service.cancelLeaveDetails(leaveToDelete).subscribe((res) => {
        expect(res).toEqual(leaveToDelete);
      });

      const req = httpMock.expectOne(
        `${mockENVIRONMENT.url}/api/Lms/employee-leave/delete`
      );
      expect(req.request.method).toBe('DELETE');
      expect(req.request.body).toEqual(leaveToDelete);

      req.flush(leaveToDelete);
    });
  });

  describe('#getDashboardCardData', () => {
    it('should post and return leave type card data', () => {
      const mockLeaveTypeCard: ILeaveTypeCard = {
        card: {
          LeaveTypeCard: [
            {
              leaveType: 'casual',
              available: 10,
              booked: 2,
              iconClassName: 'icon-casual',
              iconBackgroundColor: '#fff',
              iconColor: '#000',
            },
          ],
        },
      };

      service.getDashboardCardData().subscribe((res) => {
        expect(res).toEqual(mockLeaveTypeCard);
      });

      const req = httpMock.expectOne(
        `${mockENVIRONMENT.url}/api/Lms/leave-type-details`
      );
      expect(req.request.method).toBe('POST');
      // expect(req.request.body.employeeId).toBe(EMPLOYEEID);

      req.flush(mockLeaveTypeCard);
    });
  });
});
