import { ComponentFixture, TestBed } from '@angular/core/testing';

import { signal } from '@angular/core';
import { DialogService } from '@clarium/ngce-components';
import { ICatalog } from '../../../../shared/models/common';
import { SharedService } from '../../../../shared/shared.service';
import { DialogBridgeService } from '../../service/dialog-bridge/dialog-bridge.service';
import { LatestLeavesComponent } from './latest-leaves.component';

describe('LatestLeavesComponent', () => {
  let component: LatestLeavesComponent;
  let fixture: ComponentFixture<LatestLeavesComponent>;

  // Mocks
  let mockSharedService: jasmine.SpyObj<SharedService>;
  let mockDialogService: jasmine.SpyObj<DialogService>;
  let mockDialogBridge: jasmine.SpyObj<DialogBridgeService>;

  beforeEach(async () => {
    mockSharedService = jasmine.createSpyObj('SharedService', [
      'getCatalogUsingKey',
      'getLeaveTypeCardConfig',
      'getLeaveTypes',
      'getCatalogs',
    ]);
    mockDialogService = jasmine.createSpyObj('DialogService', [
      'openDialog',
      'closeDialog',
    ]);
    mockDialogBridge = jasmine.createSpyObj('DialogBridgeService', [
      'requestOpenForm',
    ]);

    await TestBed.configureTestingModule({
      imports: [LatestLeavesComponent],
      providers: [
        { provide: SharedService, useValue: mockSharedService },
        { provide: DialogService, useValue: mockDialogService },
        { provide: DialogBridgeService, useValue: mockDialogBridge },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LatestLeavesComponent);
    component = fixture.componentInstance;

    // Set inputs (signals)
    fixture.componentRef.setInput('leaveTypes', [
      { key: 'casual', value: 'Casual Leave' },
      { key: 'sick', value: 'Sick Leave' },
    ]);
    fixture.componentRef.setInput('latestLeaves', [
      {
        leaveTypeKey: 'casual',
        approvalStatusKey: 'approved',
        startDate: '2025-01-01',
        endDate: '2025-01-02',
        employeeId: 'EMP001',
        reason: 'Vacation',
      },
      {
        leaveTypeKey: 'sick',
        approvalStatusKey: 'pending',
        startDate: '2025-02-01',
        endDate: '2025-02-01',
        employeeId: 'EMP002',
        reason: 'Medical',
      },
    ]);
    fixture.componentRef.setInput('approvalStatues', [
      { key: 'approved', value: 'Approved' },
      { key: 'pending', value: 'Pending' },
      { key: 'rejected', value: 'Rejected' },
    ]);

    fixture.detectChanges(); // run constructor effect and bindings
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize latestLeavesData signal from latestLeaves input', () => {
    expect(component.latestLeavesData()).toEqual(component.latestLeaves());
  });

  it('stripTime should return date with time stripped', () => {
    const dateStr = '2025-03-15T10:20:30Z';
    const result = component.stripTime(dateStr);
    expect(result.getFullYear()).toBe(2025);
    expect(result.getMonth()).toBe(2); // March is 2 (0-based)
    expect(result.getDate()).toBe(15);
    expect(result.getHours()).toBe(0);
    expect(result.getMinutes()).toBe(0);
    expect(result.getSeconds()).toBe(0);
  });

  it('getDays should calculate inclusive days between two dates', () => {
    const days = component.getDays('2025-01-01', '2025-01-03');
    expect(days).toBe(3);

    const sameDay = component.getDays('2025-01-01', '2025-01-01');
    expect(sameDay).toBe(1);
  });

  it('getLeaveType should call sharedService.getCatalogUsingKey and return value', () => {
    mockSharedService.getCatalogUsingKey.and.callFake(
      (catalogs: ICatalog[], key: string) => {
        // Find matching catalog or return a default
        const found = catalogs.find((c) => c.key === key);
        return found ?? { key, value: 'Unknown Leave Type' };
      }
    );

    const leaveType = component.getLeaveType('casual');
    expect(leaveType).toBe('Casual Leave');
    expect(mockSharedService.getCatalogUsingKey).toHaveBeenCalledWith(
      component.leaveTypes(),
      'casual'
    );
  });

  it('getDialogConfig should return a DialogConfig object', () => {
    // Provide a dummy TemplateRef for dialogContent
    component.dialogContent = signal({} as any);

    const config = component.getDialogConfig();
    expect(config).toBeDefined();
    expect(config.header).toBe('Confirmation');
    expect(config.dialogType).toBe('classic');
    expect(config.width).toBe('650px');
    expect(config.closeOnBackdropClick).toBeFalse();
    expect(config.styles).toBeDefined();
  });

  describe('onActionClick', () => {
    it('should close dialog on keepRequest', () => {
      component.onActionClick(component.keepRequest);
      expect(mockDialogService.closeDialog).toHaveBeenCalled();
    });

    it('should handle confirm case (currently no API call)', () => {
      spyOn(console, 'log'); // To suppress console errors if any

      component.latestLeavesData.set([
        {
          leaveTypeKey: 'casual',
          approvalStatusKey: 'approved',
          startDate: '2025-01-01',
          endDate: '2025-01-02',
          employeeId: 'EMP001',
          reason: 'Vacation',
        },
      ]);
      component.index = 0;

      component.onActionClick(component.confirm);

      // No API call yet, so just no errors expected
      expect(true).toBeTrue();
    });
  });

  describe('onLeaveItemSelected', () => {
    it('should open cancel dialog on "Cancel Request"', () => {
      component.onLeaveItemSelected('Cancel Request', 0);
      expect(mockDialogService.openDialog).toHaveBeenCalled();
    });

    it('should call dialogBridge.requestOpenForm on "Edit"', () => {
      const leaveData = component.latestLeavesData()[0];
      component.onLeaveItemSelected('Edit', 0, leaveData);
      expect(component.leaveDataForSpecificDate()).toEqual(leaveData);
      expect(mockDialogBridge.requestOpenForm).toHaveBeenCalledWith(
        jasmine.objectContaining({
          header: 'Apply Leave',
          data: leaveData,
          formType: 'edit',
          requestedBy: 'date',
        })
      );
    });
  });

  it('should update option signal on onItemSelected', () => {
    component.onItemSelected('Approved');
    expect(component.option()).toBe('Approved');
  });

  describe('filteredLeaves computed', () => {
    it('should return all leaves when option is "All"', () => {
      component.option.set('All');
      expect(component.filteredLeaves()).toEqual(component.latestLeavesData());
    });

    it('should filter leaves by approval status', () => {
      component.option.set('Approved');
      const filtered = component.filteredLeaves();
      expect(filtered.length).toBe(1);
      expect(filtered[0].approvalStatusKey).toBe('approved');
    });

    it('should return all leaves if no matching status found', () => {
      component.option.set('NonExistentStatus');
      expect(component.filteredLeaves()).toEqual(component.latestLeavesData());
    });
  });

  it('getLeavesOnStatus should filter leaves by approvalStatusKey', () => {
    const leaves = component.getLeavesOnStatus('approved');
    expect(leaves.length).toBe(1);
    expect(leaves[0].approvalStatusKey).toBe('approved');
  });
});
