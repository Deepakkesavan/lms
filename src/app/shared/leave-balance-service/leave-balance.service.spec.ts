import { TestBed } from '@angular/core/testing';

import { LeaveBalanceService } from './leave-balance.service';
import { IDashboardCardDetails, ILeaveTypeConfig } from '../models/dashboard';
import { SharedService } from '../shared.service';
import { ICatalog } from '../models/common';
import { ICatalogResponse } from '../models/card';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('LeaveBalanceService', () => {
    let service: LeaveBalanceService;
    let mockSharedService: jasmine.SpyObj<SharedService>;
  
    const mockLeaveTypeConfig: ILeaveTypeConfig[] = [
      {
        type: 'CASUAL',
        iconClassName: 'ngce-fog-sun',
        iconBackgroundColor: 'rgba(239, 246, 255, 1)',
        iconColor: 'rgb(59, 130, 246)'
      }
    ];
  
    const mockCatalogs: ICatalog[] = [
      { key: 'CASUAL', value: 'Casual Leave' },
      { key: 'SICK', value: 'Sick Leave' }
    ];
  
    const mockCatalogResponse: ICatalogResponse= {
      catalogs: {
        Leave: mockCatalogs,
        'Approval Status':[],
        Gender:[]
      }
    };
  
    const mockCardData: IDashboardCardDetails[] = [
      {
        leaveType: 'CASUAL',
        available: 5,
        booked: 3,
        iconClassName: '',
        iconBackgroundColor: '',
        iconColor: ''
      }
    ];
  
    beforeEach(() => {
     
      mockSharedService = jasmine.createSpyObj('SharedService', [
        'getLeaveTypeCardConfig',
        'getCatalogUsingKey',
        'getCatalogs'
      ]);
  
      
      mockSharedService.getLeaveTypeCardConfig.and.returnValue(mockLeaveTypeConfig);
      mockSharedService.getCatalogUsingKey.and.callFake((catalogs, key) => 
        catalogs.find(c => c.key === key) || { key: '', value: '' }
      );
      mockSharedService.getCatalogs.and.returnValue(of(mockCatalogResponse));
  
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          LeaveBalanceService,
          { provide: SharedService, useValue: mockSharedService }
        ]
      });
  
      service = TestBed.inject(LeaveBalanceService);
      service.refreshLeaveBalanceData();
    });
  
    it('should be created', () => {
      expect(service).toBeTruthy();
    });
  
    describe('setConfigData', () => {
        it('should set configuration data for cards and return modified array', () => {
          const inputData: IDashboardCardDetails[] = [{
            leaveType: 'CASUAL',
            available: 5,
            booked: 5,
            iconClassName: '',
            iconBackgroundColor: '',
            iconColor: ''
          }];
    
          const result = service.setConfigData(inputData);
          
          
          expect(result).toBe(inputData); 
          
          expect(result[0].iconClassName).toBe('ngce-fog-sun');
          expect(result[0].leaveType).toBe('Casual Leave');
          
          expect(mockSharedService.getCatalogUsingKey)
            .toHaveBeenCalledWith(mockCatalogs, 'CASUAL');
        });
    
        it('should handle unknown leave types', () => {
          const inputData: IDashboardCardDetails[] = [{
            leaveType: 'UNKNOWN',
            available: 5,
            booked: 5,
            iconClassName: '',
            iconBackgroundColor: '',
            iconColor: ''
          }];
    
          const result = service.setConfigData(inputData);
          
          expect(result).toBe(inputData);
          expect(result[0].iconClassName).toBe('');
          expect(result[0].leaveType).toBe('');
        });
      });
  
    describe('validateKeys', () => {
      it('should return true for matching keys', () => {
        expect(service.validateKeys('CASUAL', 'CASUAL')).toBeTrue();
      });
  
      it('should return false for non-matching keys', () => {
        expect(service.validateKeys('CASUAL', 'SICK')).toBeFalse();
      });
    });
  
    describe('getLeaveBalanceData', () => {
      it('should return current leave balance data', () => {
        service['leaveBalanceSubject'].next(mockCardData);
        const result = service.getLeaveBalanceData();
        expect(result).toEqual(mockCardData);
      });
    });
  
    describe('refreshLeaveBalanceData', () => {
      it('should update leaveTypes from catalogs', () => {
        service.refreshLeaveBalanceData();
        expect(mockSharedService.getCatalogs).toHaveBeenCalled();
        expect(service['leaveTypes']).toEqual(mockCatalogs);
      });
    });
  
    describe('getLeaveBalanceByType', () => {
      beforeEach(() => {
        service['leaveBalanceSubject'].next(mockCardData);
      });
  
      it('should return balance for specified leave type', () => {
        const result = service.getLeaveBalanceByType('CASUAL');
        expect(result).toEqual(mockCardData[0]);
      });
  
      
  
  
    describe('setLeaveBalance', () => {
      it('should update leave balance subject', () => {
        const newData: IDashboardCardDetails[] = [
          { ...mockCardData[0], available: 5 }
        ];
        service.setLeaveBalance(newData);
        expect(service.getLeaveBalanceData()).toEqual(newData);
      });
    });
  });
});
