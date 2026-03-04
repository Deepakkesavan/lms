import { TestBed } from '@angular/core/testing';

import { SharedService } from './shared.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ENVIRONMENT } from '../../environment/environment';
import { DialogService } from '@clarium/ngce-components';
import { ILeaveReport } from '../feature/hr-screen/models/hr';
import { leaveTypeKeys } from './literal-types/literal-types';
import { signal } from '@angular/core';
import { ILeaveTypeConfig } from './models/dashboard';
import { of } from 'rxjs';
import { ICatalog } from './models/common';

describe('SharedService', () => {
  let service: SharedService;
  // let component: SharedService;
  // let fixture: ComponentFixture<>;
  let httpMock: HttpTestingController;

  let dialogService: jasmine.SpyObj<DialogService>;

  beforeEach(() => {
    dialogService = jasmine.createSpyObj<DialogService>('DialogService', [
      'closeDialog',
    ]);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: DialogService, useValue: dialogService }],
    });
    service = TestBed.inject(SharedService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('isLeaveReportKey', () => {
    const mockData: ILeaveReport = {
      today: { someKey: 1 },
      lastWeek: { someKey: 2 },
      lastMonth: { someKey: 3 },
      lastYear: { someKey: 4 },
    };
  
    it('should return true for valid keys of ILeaveReport', () => {
      expect(service.isLeaveReportKey('today', mockData)).toBeTrue();
      expect(service.isLeaveReportKey('lastWeek', mockData)).toBeTrue();
      expect(service.isLeaveReportKey('lastMonth', mockData)).toBeTrue();
      expect(service.isLeaveReportKey('lastYear', mockData)).toBeTrue();
    });
  
    it('should return false for invalid keys', () => {
      expect(service.isLeaveReportKey('invalidKey', mockData)).toBeFalse();
      expect(service.isLeaveReportKey('Today', mockData)).toBeFalse(); // case sensitive
      expect(service.isLeaveReportKey('', mockData)).toBeFalse();
    });
  });

  describe('getLeaveTypeCardConfig', ()=>{
    const leaveTypeCardConfig = signal<ILeaveTypeConfig[]>([
      {
        type: leaveTypeKeys.CASUAL,
        iconClassName: 'ngce-fog-sun',
        iconBackgroundColor: 'rgba(239, 246, 255, 1)',
        iconColor: 'rgb(59, 130, 246)',
      },
      {
        type: leaveTypeKeys.COMOFF,
        iconClassName: 'ngce-creative-commons',
        iconBackgroundColor: 'rgba(255, 243, 205, 1)',
        iconColor: 'rgb(245, 158, 11)',
      },
      {
        type: leaveTypeKeys.WFH,
        iconClassName: 'ngce-laptop',
        iconBackgroundColor: 'rgba(219, 234, 254, 1)',
        iconColor: 'rgb(37, 99, 235)',
      },
      {
        type: leaveTypeKeys.PRIVILEGE,
        iconClassName: 'ngce-award-2',
        iconBackgroundColor: 'rgba(232, 241, 250, 1)',
        iconColor: 'rgb(30, 64, 175)',
      },
      {
        type: leaveTypeKeys.SICK,
        iconClassName: 'ngce-stethoscope',
        iconBackgroundColor: 'rgba(254, 226, 226, 1)',
        iconColor: 'rgb(239, 68, 68)',
      },
      {
        type: leaveTypeKeys.PATERNITY,
        iconClassName: 'ngce-child',
        iconBackgroundColor: 'rgba(254, 249, 195, 1)',
        iconColor: 'rgb(202, 138, 4)',
      },
      {
        type: leaveTypeKeys.MATERNITY,
        iconClassName: 'ngce-child',
        iconBackgroundColor: 'rgba(254, 249, 195, 1)',
        iconColor: 'rgb(202, 138, 4)',
      },
      {
        type: leaveTypeKeys.LOP,
        iconClassName: 'ngce-warning-empty',
        iconBackgroundColor: 'rgba(243, 244, 246, 1)',
        iconColor: 'rgb(107, 114, 128)',
      },
    ]);

    
  beforeEach(() => {
    // Spy on getCatalogs if needed to prevent side effects
    spyOn(service, 'getCatalogs').and.callFake(()=>{
      return of({
        catalogs: {
          Leave: [],
          'Approval Status': [],
          Gender: [],
        }
      });
    });

    // If leaveTypeCardConfig is a signal or method, mock it too
    spyOn(service, 'leaveTypeCardConfig' as never).and.returnValue(leaveTypeCardConfig as never);
  });

  it('should return leave type config matching expected config', () => {
    const result = service.getLeaveTypeCardConfig();
    expect(result.length).toBe(leaveTypeCardConfig.length);
  });

  });


  describe('getHrCardDesign', ()=>{
    it('Should return hr card data', ()=>{
      expect(service.getHrCardDesigns().length).toBe(3);
    })
  })

  describe('getCatalogUsingKey', ()=>{
    const mockCatalogData:ICatalog[] = [
      {
        key: 'casual',
        value: 'Casual Leave'
      },
      {
        key: 'sick',
        value: 'Sick Leave'
      }
    ]

    it('should return the related catalog record when provided key', ()=>{
      expect(service.getCatalogUsingKey(mockCatalogData, 'casual').value).toBe('Casual Leave')
    })

    it('should return empty ICatalog response when key not found', ()=>{
      expect(service.getCatalogUsingKey(mockCatalogData, 'privilege').value).toBe('');
    })
  })

  describe('getCatalogUsingValue', ()=>{
    const mockCatalogData:ICatalog[] = [
      {
        key: 'casual',
        value: 'Casual Leave'
      },
      {
        key: 'sick',
        value: 'Sick Leave'
      }
    ]

    it('should return the related catalog record when provided key', ()=>{
      expect(service.getCatalogUsingValue(mockCatalogData, 'Casual Leave').key).toBe('casual')
    })

    it('should return empty ICatalog response when key not found', ()=>{
      expect(service.getCatalogUsingValue(mockCatalogData, 'Privilege').value).toBe('');
    })
  })

  it('should return card styles', ()=>{
    expect(service.getCardStyles()['background-color']).toBe('white');
  })

  it('should return dashboard card styles', ()=>{
    expect(service.getDashboardCardStyles()['background-color']).toBe('white');
  })

  it('should return leave report config', () => {
    const config = service.getEmployeeLeaveReportConfig();
    expect(config.length).toBeGreaterThan(0);
  });

  it('should return doughnut label config ', () => {
    expect(service.getDoughnutLabelConfig()).toEqual({
      casual: 'Casual',
      sick: 'Sick',
      privilege: 'Privilege',
      WFH: 'WFH',
      paternity: 'Paternity',
      maternity: 'Maternity',
      compoff: 'Compensatory off',
      LOP: 'LOP',
    });
  });

  it('should return dropdown config', () => {
    expect(service.getDropdownConfig()).toEqual({
      today: 'Today',
      lastWeek: 'Last Week',
      lastMonth: 'Last Month',
      lastYear: 'Last Year',
    });
  });

  it('should return dropdown config', () => {
    expect(service.getDropdownConfig()).toEqual({
      today: 'Today',
      lastWeek: 'Last Week',
      lastMonth: 'Last Month',
      lastYear: 'Last Year',
    });
  });

  it('should return approver card designs', () => {
    expect(service.getApproverCardDesigns().length).toBe(4);
  });

  it('should return dropdown config', () => {
    expect(service.getDropdownConfig()).toEqual({
      today: 'Today',
      lastWeek: 'Last Week',
      lastMonth: 'Last Month',
      lastYear: 'Last Year',
    });
  });

  it('should return dropdown label from key', () => {
    expect(service.getDropdownValue('today')).toBe('Today');
  });

  it('should return dropdown key from label', () => {
    expect(service.getDropdownKey('Today')).toBe('today');
  });

  it('should return correct color for leave type', () => {
    expect(service.getColor('holiday')).toBe('#FFECB3');
  });

  it('should return default catalog if not found by key', () => {
    const result = service.getCatalogUsingKey([], 'unknown');
    expect(result).toEqual({ key: '', value: '' });
  });

  it('should return default catalog if not found by value', () => {
    const result = service.getCatalogUsingValue([], 'unknown');
    expect(result).toEqual({ key: '', value: '' });
  });

  it('should call the catalog API', () => {
    service.getCatalogs().subscribe((response) => {
      expect(response).toBeTruthy();
    });
    const req = httpMock.expectOne(`${ENVIRONMENT.url}/api/Lms/catalogs`);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should close dialog', () => {
    service.closeTheDialog();
    expect((service as any).dialogService.closeDialog).toHaveBeenCalled();
  });

  describe('convertUtcToLocalDate', () => {
    it('should return null if utcString is falsy', () => {
      expect(service.convertUtcToLocalDate('')).toBeNull();
      expect(service.convertUtcToLocalDate(null as any)).toBeNull();
      expect(service.convertUtcToLocalDate(undefined as any)).toBeNull();
    });
  
    it('should return a valid Date for a valid UTC string', () => {
      const utcString = '2023-01-01T00:00:00Z';
      const result = service.convertUtcToLocalDate(utcString);
      expect(result).toBeInstanceOf(Date);
      expect(result?.toISOString()).toBe('2023-01-01T00:00:00.000Z');
    });
  
    it('should return null for invalid date string', () => {
      const invalidString = 'invalid-date';
      expect(service.convertUtcToLocalDate(invalidString)).toBeNull();
    });
  });
  

  describe('convertLeaveDates', () => {
    it('should convert valid ISO string dates to Date with 05:30 time', () => {
      const data = {
        startDate: '2025-01-01T00:00:00Z',
        endDate: '2025-01-02T00:00:00Z',
      };
      const result = service.convertLeaveDates(data);
  
      expect(result.startDate).toBeInstanceOf(Date);
      expect(result.endDate).toBeInstanceOf(Date);
  
      // Check the time is set to 05:30 local time
      expect(result.startDate.getHours()).toBe(5);
      expect(result.startDate.getMinutes()).toBe(30);
      expect(result.endDate.getHours()).toBe(5);
      expect(result.endDate.getMinutes()).toBe(30);
  
      // Check the date part matches input date
      expect(result.startDate.getFullYear()).toBe(2025);
      expect(result.startDate.getMonth()).toBe(0); // January is 0
      expect(result.startDate.getDate()).toBe(1);
    });
  
    it('should convert Date objects and set time to 05:30', () => {
      const data = {
        startDate: new Date(2025, 0, 1, 10, 0, 0), // Jan 1, 2025, 10:00am
        endDate: new Date(2025, 0, 2, 15, 0, 0),   // Jan 2, 2025, 3:00pm
      };
      const result = service.convertLeaveDates(data);
  
      expect(result.startDate).toBeInstanceOf(Date);
      expect(result.endDate).toBeInstanceOf(Date);
  
      expect(result.startDate.getHours()).toBe(5);
      expect(result.startDate.getMinutes()).toBe(30);
      expect(result.endDate.getHours()).toBe(5);
      expect(result.endDate.getMinutes()).toBe(30);
  
      expect(result.startDate.getDate()).toBe(1);
      expect(result.endDate.getDate()).toBe(2);
    });
  
    it('should return null for null or undefined dates', () => {
      const data = {
        startDate: null,
        endDate: undefined,
      };
      const result = service.convertLeaveDates(data);
  
      expect(result.startDate).toBeNull();
      expect(result.endDate).toBeNull();
    });
  
    it('should return null if year, month, or day is missing or zero', () => {
      // Missing year (empty string for year)
      const data1 = { startDate: '-01-01T00:00:00Z' };
      const result1 = service.convertLeaveDates(data1);
      expect(result1.startDate).toBeNull();
  
      // Missing month (empty string for month)
      const data2 = { startDate: '2025--01T00:00:00Z' };
      const result2 = service.convertLeaveDates(data2);
      expect(result2.startDate).toBeNull();
  
      // Missing day (empty string for day)
      const data3 = { startDate: '2025-01-T00:00:00Z' };
      const result3 = service.convertLeaveDates(data3);
      expect(result3.startDate).toBeNull();
  
      // Zero values for year/month/day (falsy)
      const data4 = { startDate: '0-0-0T00:00:00Z' };
      const result4 = service.convertLeaveDates(data4);
      expect(result4.startDate).toBeNull();
    });
  
    it('should return null if dateStr is neither string nor Date', () => {
      const data = { startDate: 12345 }; // number type, invalid
      const result = service.convertLeaveDates(data);
      expect(result.startDate).toBeNull();
    });
  
    it('should handle missing date fields gracefully', () => {
      const data = {};
      const result = service.convertLeaveDates(data);
  
      expect(result.startDate).toBeNull();
      expect(result.endDate).toBeNull();
    });
  });

  describe('convertLeaveDates - convertItem branches', () => {
    const validDateStr = '2025-01-01T00:00:00Z';
    const nextDayDateStr = '2025-01-02T00:00:00Z';
  
    // Mock parseToLocal530 to convert ISO string to Date at 05:30 local time
    // You can spy on the actual method if it's accessible, or mock it here if it's private
    // For demonstration, assume parseToLocal530 works correctly
  
    it('should convert a single object with same start and end date', () => {
      const input = {
        startDate: validDateStr,
        endDate: validDateStr,
        someOtherProp: 'test',
      };
  
      const result = service.convertLeaveDates(input);
  
      expect(result).toBeDefined();
      expect(result.startDate).toBeInstanceOf(Date);
      expect(result.endDate).toBeInstanceOf(Date);
      expect(result.someOtherProp).toBe('test');
  
      // start and end dates should be different objects but same time
      expect(result.startDate.getTime()).toBe(result.endDate.getTime());
      expect(result.startDate).not.toBe(result.endDate); // different Date instances
    });
  
    it('should convert a single object with different start and end dates', () => {
      const input = {
        startDate: validDateStr,
        endDate: nextDayDateStr,
        someOtherProp: 'test',
      };
  
      const result = service.convertLeaveDates(input);
  
      expect(result).toBeDefined();
      expect(result.startDate).toBeInstanceOf(Date);
      expect(result.endDate).toBeInstanceOf(Date);
      expect(result.someOtherProp).toBe('test');
  
      expect(result.startDate.getTime()).not.toBe(result.endDate.getTime());
    });
  
    it('should convert an array of items', () => {
      const input = [
        { startDate: validDateStr, endDate: validDateStr, id: 1 },
        { startDate: validDateStr, endDate: nextDayDateStr, id: 2 },
      ];
  
      const result = service.convertLeaveDates(input);
  
      expect(Array.isArray(result)).toBeTrue();
      expect(result.length).toBe(2);
  
      // Check first item same start/end date branch
      expect(result[0].startDate.getTime()).toBe(result[0].endDate.getTime());
      expect(result[0].startDate).not.toBe(result[0].endDate);
  
      // Check second item different dates branch
      expect(result[1].startDate.getTime()).not.toBe(result[1].endDate.getTime());
    });
  });
  
  
});
