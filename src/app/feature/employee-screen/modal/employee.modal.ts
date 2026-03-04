export interface ILeaveTypeColor {
  leaveType: string;
  backgroundColor: string;
}

export interface IPopupConfig {
  requestedBy: 'card' | 'request-button' | 'date' | 'existing-leave' | 'edit';
  leaveType?: string;
  selectedDate?: Date;
  data?: any;
  header?: string; //if it is edit u can use that
  formType?: 'add' | 'edit';
  isAlreadyApplied?: boolean;
}
