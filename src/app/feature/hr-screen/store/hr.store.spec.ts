import { TestBed } from '@angular/core/testing';

import { HrStore } from './hr.store';
import { HrService } from '../service/hr.service';
import { of } from 'rxjs';
import { SharedService } from '../../../shared/shared.service';

describe('HrStore', () => {
  let store: HrStore;
  let mockHrService: jasmine.SpyObj<HrService>;
  let mockSharedService: jasmine.SpyObj<SharedService>;

  beforeEach(() => {
    mockHrService = jasmine.createSpyObj('HrService', [
      'getDataStat',
      'getEmployeesLeveReport',
      'getPendingLeaves',
    ]);
    mockSharedService = jasmine.createSpyObj('SharedService', ['getCatalogs']);

    TestBed.configureTestingModule({
      providers: [
        { provide: HrService, useValue: mockHrService },
        { provide: SharedService, useValue: mockSharedService },
      ],
    });

    // Setup mock return values
    mockHrService.getDataStat.and.returnValue(
      of({
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
      })
    );
    mockHrService.getEmployeesLeveReport.and.returnValue(
      of({
        today: { casual: 2 },
        lastWeek: {},
        lastMonth: {},
        lastYear: {},
      })
    );
    mockHrService.getPendingLeaves.and.returnValue(
      of([
        {
          employeeId: 'EMP1',
          leaveTypeKey: 'casual',
          startDate: new Date().toString(),
          endDate: new Date().toString(),
          employeeName: '',
        },
      ])
    );
    mockSharedService.getCatalogs.and.returnValue(
      of({
        catalogs: {
          Leave: [{ key: 'casual', value: 'Casual Leave' }],
          'Approval Status': [],
          Gender: [],
        },
      })
    );

    store = TestBed.inject(HrStore);
  });

  it('should initialize cardData signal with mocked data', () => {
    const result = store.cardData();
    expect(result.card.HrView.length).toBe(1);
    expect(result.card.HrView[0].firstName).toBe('Alex');
  });

  it('should initialize leaveReport signal with mocked data', () => {
    const result = store.leaveReport();
    const today = result.today as Record<string, number>;
    expect(today['casual']).toBe(2);
  });

  it('should initialize pendingLeaves signal with mocked data', () => {
    const result = store.pendingLeaves();
    expect(result.length).toBe(1);
    expect(result[0].employeeId).toBe('EMP1');
  });

  it('should initialize catalogData signal with mocked data', () => {
    const result = store.catalogData();
    expect(result.catalogs.Leave.length).toBe(1);
    expect(result.catalogs.Leave[0].key).toBe('casual');
  });
});
