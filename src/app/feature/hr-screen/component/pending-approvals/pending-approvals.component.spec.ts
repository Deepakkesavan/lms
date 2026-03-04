import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PendingApprovalsComponent } from './pending-approvals.component';
import { signal, computed } from '@angular/core';
import { IPendingApproval } from '../../models/hr';

describe('PendingApprovalsComponent', () => {
  let component: PendingApprovalsComponent;
  let fixture: ComponentFixture<PendingApprovalsComponent>;

  const mockData: IPendingApproval = {
    employeeId: 'EMP123',
    employeeName: 'John Doe',
    startDate: '2023-01-01',
    endDate: '2023-01-05',
    firstName: 'John',
    lastName: 'Doe',
    leaveTypeKey: 'casual',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PendingApprovalsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PendingApprovalsComponent);
    component = fixture.componentInstance;

    // Set the input data
    // component.data.set(mockData);
    fixture.componentRef.setInput('data', mockData);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize id signal with employeeId from input data', () => {
    expect(component.id()).toBe(mockData.employeeId);
  });

  describe('getData computed property', () => {
    it('should split employeeName into firstName and lastName', () => {
      const result = component.getData();
      expect(result.firstName).toBe('John');
      expect(result.lastName).toBe('Doe');
    });

    it('should return the complete data object', () => {
      const result = component.getData();
      expect(result.employeeId).toBe(mockData.employeeId);
      expect(result.startDate).toBe(mockData.startDate);
      expect(result.endDate).toBe(mockData.endDate);
    });
  });

  describe('getIdStyling computed property', () => {
    it('should return the correct styling object', () => {
      const expectedStyle = {
        color: 'rgb(100 ,116, 139, 1)',
        'font-size': '.87rem',
        'font-weight': '500',
        'line-height': '1.25rem',
      };
      expect(component.getIdStyling()).toEqual(expectedStyle);
    });
  });

  describe('getDays computed property', () => {
    it('should calculate correct number of days between start and end date', () => {
      // Test case 1: 5 days inclusive
      // component.data.set();
      fixture.componentRef.setInput('data', {
        ...mockData,
        startDate: '2023-01-01',
        endDate: '2023-01-05',
      });
      expect(component.getDays()).toBe(5);

      // Test case 2: Single day
      // component.data.set();
      fixture.componentRef.setInput('data', {
        ...mockData,
        startDate: '2023-01-01',
        endDate: '2023-01-01',
      });
      expect(component.getDays()).toBe(1);

      // Test case 3: Cross-month
      // component.data.set();
      fixture.componentRef.setInput('data', {
        ...mockData,
        startDate: '2023-01-30',
        endDate: '2023-02-02',
      });
      expect(component.getDays()).toBe(4);
    });

    it('should handle invalid dates gracefully', () => {
      // component.data.set();
      fixture.componentRef.setInput('data', {
        ...mockData,
        startDate: 'invalid-date',
        endDate: 'invalid-date',
      });
      expect(component.getDays()).toBeNaN();
    });
  });

  it('should have correct readonly style properties', () => {
    expect(component.cardStyle).toEqual({
      padding: '.8rem',
      width: 'auto',
      cursor: 'default',
      border: '1px solid rgb(226, 232, 240, 1)',
      'background-color': 'white',
      height: 'auto',
      'border-radius': '.5rem',
      'box-shadow': 'rgba(0, 0, 0, 0.2) 0px 0px 1.2px 0px',
    });

    expect(component.cardContentStyle).toEqual({
      display: 'flex',
      'flex-flow': 'column nowrap',
      'justify-content': 'start',
      gap: '.5rem',
    });

    expect(component.leaveNameStyle).toEqual({
      'font-size': '0.9rem',
      'font-weight': '500',
      color: 'grey',
    });

    expect(component.leaveDetailStyle).toEqual({
      display: 'flex',
      'flex-flow': 'row nowrap',
      'justify-content': 'space-between',
    });

    expect(component.calendarStyle).toEqual({
      display: 'flex',
      'flex-flow': 'row nowrap',
      'justify-content': 'start',
      gap: '.2rem',
      'align-items': 'center',
    });

    expect(component.dateRangeStyle).toEqual({
      color: 'grey',
      'font-size': '14px',
    });

    expect(component.dayStyle).toEqual({
      display: 'inline-flex',
      'align-items': 'center',
      gap: '0.4rem',
      'font-size': '0.875rem',
      color: 'rgb(37, 99, 235)',
    });

    expect(component.dotStyle).toEqual({
      height: '0.5rem',
      width: '0.5rem',
      'border-radius': '50%',
      'background-color': 'rgb(37, 99, 235)',
      display: 'inline-block',
    });
  });
});
