import { Injectable, signal } from '@angular/core';
import { IPopupConfig } from '../../modal/employee.modal';

@Injectable({
  providedIn: 'root',
})
export class DialogBridgeService {
  openFormRequest = signal<IPopupConfig | null>(null);

  requestOpenForm({
    selectedDate,
    leaveType,
    data,
    header = 'Apply Leave',
    formType = 'add',
    requestedBy,
  }: IPopupConfig) {
    this.openFormRequest.set({
      selectedDate,
      leaveType,
      data,
      header,
      formType,
      requestedBy,
    });
  }

  closeFormRequest() {
    this.openFormRequest.set(null);
  }
}
