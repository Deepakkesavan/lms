import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { HrService } from './hr.service';
import { IHrCardDetails, ILeaveReport, IPendingApproval } from '../models/hr';

describe('HrService', () => {
  let service: HrService;
  let httpMock: HttpTestingController;

  const mockENVIRONMENT = {
    url: 'http://localhost:3000',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        HrService,
        { provide: 'ENVIRONMENT', useValue: mockENVIRONMENT },
      ],
    });

    service = TestBed.inject(HrService);
    httpMock = TestBed.inject(HttpTestingController);
    (service as any).dashboardURL = mockENVIRONMENT.url; // manually override private field
  });

  afterEach(() => {
    httpMock.verify(); // Ensure no outstanding requests
  });

  it('should fetch data stats', () => {
    const mockResponse: IHrCardDetails = {
      card: {
        HrView: [
          {
            employeeId: '',
            emailId: '',
            roleId: '',
            roleName: '',
            firstName: 'Alex',
            lastName: 'Brown',
            onLeave: true,
            onWrh: false,
            onAvailable: false,
            onSpecialLeave: false,
          },
        ],
      },
    };

    service.getDataStat().subscribe((data) => {
      expect(data).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(
      `${mockENVIRONMENT.url}/api/Lms/hr/data-stats`
    );
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should fetch leave report', () => {
    const mockReport: ILeaveReport = {
      today: { casual: 5 },
      lastWeek: {},
      lastMonth: {},
      lastYear: {},
    };

    service.getEmployeesLeveReport().subscribe((data) => {
      expect(data.today['casual']).toBe(5);
    });

    const req = httpMock.expectOne(
      `${mockENVIRONMENT.url}/api/Lms/hr/employees-leave-report`
    );
    expect(req.request.method).toBe('POST');
    req.flush(mockReport);
  });

  it('should fetch pending leaves', () => {
    const mockPending: IPendingApproval[] = [
      {
        employeeId: 'EMP123',
        leaveTypeKey: 'casual',
        startDate: new Date().toString(),
        endDate: new Date().toString(),
        employeeName: 'Alex Brown',
      },
    ];

    service.getPendingLeaves().subscribe((data) => {
      expect(data.length).toBe(1);
      expect(data[0].employeeId).toBe('EMP123');
    });

    const req = httpMock.expectOne(
      `${mockENVIRONMENT.url}/api/Lms/hr/pending-employees`
    );
    expect(req.request.method).toBe('POST');
    req.flush(mockPending);
  });
});
