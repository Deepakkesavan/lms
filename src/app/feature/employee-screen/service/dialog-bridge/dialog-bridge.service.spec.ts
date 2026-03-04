import { TestBed } from '@angular/core/testing';

import { DialogBridgeService } from './dialog-bridge.service';
import {
  IDashboardCardDetails,
  ILeaveDetails,
} from '../../../../shared/models/dashboard';
import { ICatalog } from '../../../../shared/models/common';

describe('DialogBridgeService', () => {
  let service: DialogBridgeService;

  beforeEach(() => {
    service = new DialogBridgeService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('requestOpenForm', () => {
    it('should set openFormRequest signal with provided data and default values', () => {
      const selectedDate = new Date('2025-01-01');
      const leaveType = 'casual';
      const data = { some: 'data' };
      const header = 'Custom Header';
      const formType: 'add' | 'edit' = 'edit';
      const requestedBy = 'card';

      service.requestOpenForm({
        selectedDate,
        leaveType,
        data,
        header,
        formType,
        requestedBy,
      });

      const signalValue = service.openFormRequest();

      expect(signalValue).toBeTruthy();
      expect(signalValue?.selectedDate).toEqual(selectedDate);
      expect(signalValue?.leaveType).toBe(leaveType);
      expect(signalValue?.data).toBe(data);
      expect(signalValue?.header).toBe(header);
      expect(signalValue?.formType).toBe(formType);
      expect(signalValue?.requestedBy).toBe(requestedBy);
    });

    it('should use default values for header and formType if not provided', () => {
      const requestedBy = 'date';

      service.requestOpenForm({ requestedBy });

      const signalValue = service.openFormRequest();

      expect(signalValue).toBeTruthy();
      expect(signalValue?.header).toBe('Apply Leave');
      expect(signalValue?.formType).toBe('add');
      expect(signalValue?.requestedBy).toBe(requestedBy);
    });
  });

  describe('closeFormRequest', () => {
    it('should set openFormRequest signal to null', () => {
      // Set some initial value
      service.requestOpenForm({ requestedBy: 'card' });
      expect(service.openFormRequest()).not.toBeNull();

      service.closeFormRequest();
      expect(service.openFormRequest()).toBeNull();
    });
  });
});
