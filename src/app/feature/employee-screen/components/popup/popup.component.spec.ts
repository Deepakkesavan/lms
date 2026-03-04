// import {
//   ComponentFixture,
//   TestBed,
//   fakeAsync,
//   inject,
//   tick,
// } from '@angular/core/testing';

// import { PopupComponent } from './popup.component';
// import { CommonModule } from '@angular/common';
// import { DialogService, NgceComponentsModule } from '@clarium/ngce-components';
// import { ReusableGridComponent } from '../../../../reusable-templates/reusable-grid/reusable-grid.component';
// import { SimpleDataStatComponent } from '../../../../reusable-templates/simple-data-stat/simple-data-stat.component';

// import { NgceIconModule } from '@clarium/ngce-icon';
// import { DialogBridgeService } from '../../service/dialog-bridge/dialog-bridge.service';
// import { EmployeeStoreService } from '../../store/employee-store.service';
// import {
//   FormControl,
//   FormGroup,
//   FormsModule,
//   ReactiveFormsModule,
// } from '@angular/forms';
// import { of } from 'rxjs';
// import {
//   TemplateRef,
//   WritableSignal,
//   computed,
//   runInInjectionContext,
//   signal,
// } from '@angular/core';
// import {
//   IDashboardCardDetails,
//   ILeaveDetails,
// } from '../../../../shared/models/dashboard';

// xdescribe('PopupComponent', () => {
//   let component: PopupComponent;
//   let fixture: ComponentFixture<PopupComponent>;
//   let mockDialogService: jasmine.SpyObj<DialogService>;
//   let mockDialogBridgeService: jasmine.SpyObj<DialogBridgeService>;
//   let mockEmployeeStoreService: jasmine.SpyObj<EmployeeStoreService>;
//   let mockOpenFormRequestSignal: WritableSignal<{
//     selectedDate?: Date;
//     leaveType?: string;
//     data?: any;
//     header?: string;
//     formType?: 'add' | 'edit';
//     trigger?: number;
//     leaveBalData?: IDashboardCardDetails[];
//     requestedBy: 'card' | 'request-button' | 'date' | 'existing-leave';
//     leaveTypes?: { key: string; value: string }[];
//     leaveHistory?: ILeaveDetails[];
//   } | null>;

//   const mockLeaveTypes: { key: string; value: string }[] = [
//     { key: 'annual', value: 'Annual Leave' },
//     { key: 'sick', value: 'Sick Leave' },
//   ];

//   const mockApprovalTypes: { key: string; value: string }[] = [
//     { key: 'approved', value: 'Approved' },
//     { key: 'drafted', value: 'Drafted' },
//   ];

//   const mockLeaveHistory: ILeaveDetails[] = [
//     {
//       leaveTypeKey: 'annual',
//       startDate: '2025-07-01T00:00:00Z',
//       endDate: '2025-07-02T23:59:59Z',
//       employeeId: 'IND-1017',
//       reason: 'Vacation',
//       approvalStatusKey: 'approved',
//       requestedDays: 2,
//     },
//     {
//       leaveTypeKey: 'sick',
//       startDate: '2025-07-03T00:00:00Z',
//       endDate: '2025-07-03T23:59:59Z',
//       employeeId: 'IND-1017',
//       reason: 'Medical',
//       approvalStatusKey: 'drafted',
//       requestedDays: 1,
//     },
//   ];

//   const mockLeaveBalances: IDashboardCardDetails[] = [
//     {
//       leaveType: 'annual',
//       available: 10,
//       booked: 2,
//       iconClassName: 'icon-annual',
//     },
//     { leaveType: 'sick', available: 5, booked: 1, iconClassName: 'icon-sick' },
//   ];

//   beforeEach(async () => {
//     // Initialize the mock signal for openFormRequest
//     mockOpenFormRequestSignal = signal(null);

//     // Mock services
//     mockDialogService = jasmine.createSpyObj<DialogService>('DialogService', [
//       'openDialog',
//       'afterOpen',
//       'afterClose',
//     ]);
//     mockDialogBridgeService = jasmine.createSpyObj<DialogBridgeService>(
//       'DialogBridgeService',
//       ['requestOpenForm', 'closeFormRequest'],
//       {
//         openFormRequest: mockOpenFormRequestSignal,
//       }
//     );
//     mockEmployeeStoreService = jasmine.createSpyObj<EmployeeStoreService>(
//       'EmployeeStoreService',
//       [
//         'catalogData',
//         'addLeaveDetails',
//         'saveLeaveDetailsAsDraft',
//         'updateLeaveDetails',
//       ]
//     );

//     // Configure service mocks
//     mockDialogService.afterOpen.and.returnValue(of());
//     mockDialogService.afterClose.and.returnValue(of());
//     mockEmployeeStoreService.catalogData.and.returnValue({
//       catalogs: {
//         Leave: mockLeaveTypes,
//         'Approval Status': mockApprovalTypes,
//       },
//     });

//     await TestBed.configureTestingModule({
//       imports: [PopupComponent],
//       providers: [
//         { provide: DialogService, useValue: mockDialogService },
//         { provide: DialogBridgeService, useValue: mockDialogBridgeService },
//         { provide: EmployeeStoreService, useValue: mockEmployeeStoreService },
//       ],
//     }).compileComponents();

//     fixture = TestBed.createComponent(PopupComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create the component', () => {
//     expect(component).toBeTruthy();
//   });

//   describe('Initialization', () => {
//     it('should initialize form configuration with correct fields', () => {
//       expect(component.formConfig).toBeDefined();
//       expect(component.formConfig.fields.length).toBe(4);
//       expect(component.formConfig.fields[0]).toEqual({
//         type: 'date',
//         label: 'Start Date',
//         name: 'startDate',
//         validators: ['required'],
//       });
//       expect(component.formConfig.buttons).toEqual([
//         { label: 'Save as draft', type: 'submit' },
//         { label: 'Save', type: 'submit' },
//       ]);
//     });

//     it('should initialize tabArray with correct headers', () => {
//       expect(component.tabArray).toEqual([
//         {
//           headerName: 'Apply Leave',
//           headerIconClass: 'ngce-clock-1',
//           content: 'applyLeave',
//         },
//         {
//           headerName: 'Leave History',
//           headerIconClass: 'ngce-clock-1',
//           content: 'fullLeaveHistory',
//         },
//       ]);
//     });

//     it('should initialize computed leaveTypes', () => {
//       expect(component.leaveTypes()).toEqual(mockLeaveTypes);
//     });

//     it('should initialize computed approvalTypes', () => {
//       expect(component.approvalTypes()).toEqual(mockApprovalTypes);
//     });

//     it('should initialize computed leaveTypeOptions', () => {
//       expect(component.leaveTypeOptions()).toEqual([
//         'Annual Leave',
//         'Sick Leave',
//       ]);
//     });
//   });

//   describe('initializeEffects', () => {
//     it('should not process if openFormRequest is null', () => {
//       return inject([], () => {
//         mockDialogBridgeService.requestOpenForm.and.callFake(() => {
//           mockOpenFormRequestSignal.set(null);
//         });

//         runInInjectionContext(fixture.componentRef.injector, () => {
//           component.initializeEffects();
//         });
//         fixture.detectChanges();

//         expect(component.fullLeaveHistory()).toEqual([]);
//         expect(component.allLeaveBalances()).toEqual([]);
//         expect(component.selectedLeaveType()).toBeNull();
//         expect(component.requestedLeaveDays).toBe(0);
//         expect(mockDialogBridgeService.closeFormRequest).not.toHaveBeenCalled();
//       })();
//     });

//     // it('should update filtered leave history and grid on selectedLeaveType change', () => {
//     //   return inject([], () => {
//     //     const getLeaveTypeKeySpy = spyOn(component, 'getLeaveTypeKey').and.callThrough();
//     //     component.fullLeaveHistory.set(mockLeaveHistory);
//     //     component.allLeaveBalances.set(mockLeaveBalances);

//     //     runInInjectionContext(fixture.componentRef.injector, () => {
//     //       component.selectedLeaveType.set('Annual Leave');
//     //       fixture.detectChanges();
//     //       fixture.whenStable().then(() => {
//     //         expect(getLeaveTypeKeySpy).toHaveBeenCalledWith('Annual Leave');
//     //         expect(component.filteredLeaveHistoryByType()).toEqual([mockLeaveHistory[0]]);
//     //         expect(component.leaveHistoryGridConfig()).toBeDefined();
//     //         expect(component.leaveHistoryGridConfig()!.columns.length).toBe(6);
//     //         expect(component.selectedLeaveTypeBalance()).toEqual(mockLeaveBalances[0]);
//     //       });
//     //     });
//     //   })();
//     // });
//   });

//   describe('getLeaveTypeKey', () => {
//     it('should return key for valid leave type value', () => {
//       expect(component.getLeaveTypeKey('Annual Leave')).toBe('annual');
//     });

//     it('should return undefined for invalid leave type value', () => {
//       expect(component.getLeaveTypeKey('Invalid Leave')).toBeUndefined();
//     });
//   });

//   describe('getLeaveTypeValue', () => {
//     it('should return value for valid leave type key', () => {
//       expect(component.getLeaveTypeValue('annual')).toBe('Annual Leave');
//     });

//     it('should return empty string for invalid leave type key', () => {
//       expect(component.getLeaveTypeValue('invalid')).toBe('');
//     });
//   });

//   describe('getApprovalStatusValue', () => {
//     it('should return value for valid approval status key', () => {
//       expect(component.getApprovalStatusValue('approved')).toBe('Approved');
//     });

//     it('should return empty string for invalid approval status key', () => {
//       expect(component.getApprovalStatusValue('invalid')).toBe('');
//     });
//   });

//   describe('openLeaveForm', () => {
//     beforeEach(() => {
//       component.addDialogTemplate = signal<TemplateRef<any>>(
//         {} as TemplateRef<any>
//       );
//       component.editDialogTemplate = signal<TemplateRef<any>>(
//         {} as TemplateRef<any>
//       );
//       component.applyLeaveAndLeaveHistory = signal<TemplateRef<any>>(
//         {} as TemplateRef<any>
//       );
//       component.startDate = signal<TemplateRef<any>>({} as TemplateRef<any>);
//       component.endDate = signal<TemplateRef<any>>({} as TemplateRef<any>);
//       component.leaveType = signal<TemplateRef<any>>({} as TemplateRef<any>);
//       component.approvalStatus = signal<TemplateRef<any>>(
//         {} as TemplateRef<any>
//       );
//       component.requestedDays = signal<TemplateRef<any>>(
//         {} as TemplateRef<any>
//       );
//     });

//     it('should open dialog with add template for formType "add"', () => {
//       component.openLeaveForm(
//         undefined,
//         undefined,
//         undefined,
//         'Apply Leave',
//         'add',
//         'request-button'
//       );
//       expect(mockDialogService.openDialog).toHaveBeenCalledWith(
//         jasmine.objectContaining({
//           header: 'Apply Leave',
//           content: jasmine.any(Object),
//           closeOnBackdropClick: true,
//           accessibility: true,
//           draggable: false,
//           closeButton: true,
//         })
//       );
//     });

//     it('should open dialog with edit template for formType "edit"', () => {
//       component.openLeaveForm(
//         undefined,
//         undefined,
//         undefined,
//         'Edit Leave',
//         'edit',
//         'existing-leave'
//       );
//       expect(mockDialogService.openDialog).toHaveBeenCalledWith(
//         jasmine.objectContaining({
//           header: 'Edit Leave',
//           content: jasmine.any(Object),
//         })
//       );
//     });

//     it('should open dialog with applyLeaveAndLeaveHistory template for requestedBy "card"', () => {
//       component.openLeaveForm(
//         undefined,
//         undefined,
//         undefined,
//         'Apply Leave',
//         'add',
//         'card'
//       );
//       expect(mockDialogService.openDialog).toHaveBeenCalledWith(
//         jasmine.objectContaining({
//           content: jasmine.any(Object),
//         })
//       );
//     });

//     it('should patch form with selectedDate and data', () => {
//       const mockForm = new FormGroup({
//         startDate: new FormControl(''),
//         endDate: new FormControl(''),
//         leaveType: new FormControl(''),
//         reason: new FormControl(''),
//       });
//       component.addSideDrawer = signal({ form: mockForm });
//       const selectedDate = new Date('2025-07-01');
//       const data = { leaveType: 'Annual Leave', reason: 'Test' };

//       // component.openLeaveForm(selectedDate, undefined, data);
//       mockDialogService.afterOpen().subscribe(() => {
//         expect(mockForm.value).toEqual({
//           startDate: selectedDate.toString(),
//           endDate: selectedDate.toString(),
//           leaveType: 'Annual Leave',
//           reason: 'Test',
//         });
//       });
//     });

//     it('should reset form and signals after dialog close', () => {
//       const mockForm = new FormGroup({
//         startDate: new FormControl(''),
//         endDate: new FormControl(''),
//         leaveType: new FormControl(''),
//         reason: new FormControl(''),
//       });
//       component.addSideDrawer = signal({ form: mockForm });
//       component.editSideDrawer = signal({ form: mockForm });
//       component.selectedLeaveType.set('Annual Leave');
//       component.requestedLeaveDays = 2;
//       component.selectedLeaveTypeBalance.set(mockLeaveBalances[0]);

//       component.openLeaveForm();
//       mockDialogService.afterClose().subscribe(() => {
//         expect(mockForm.pristine).toBeTrue();
//         expect(component.selectedLeaveType()).toBe('');
//         expect(component.requestedLeaveDays).toBe(0);
//         expect(component.selectedLeaveTypeBalance()).toBeNull();
//       });
//     });
//   });

//   describe('onFormValueChange', () => {
//     it('should handle undefined leave type', () => {
//       return inject([], () => {
//         component.fullLeaveHistory.set(mockLeaveHistory);
//         // component.allLeaveBalances.set(mockLeaveBalances);
//         const mockForm = new FormGroup({
//           leaveType: new FormControl(''),
//         });

//         runInInjectionContext(fixture.componentRef.injector, () => {
//           component.onFormValueChange(mockForm);
//         });
//         fixture.detectChanges();

//         expect(component.selectedLeaveType()).toBe('');
//         expect(component.selectedLeaveTypeBalance()).toBeNull();
//         expect(component.filteredLeaveHistoryByType()).toEqual([]);
//       })();
//     });
//   });

//   // describe('filterLeaveHistoryDataBYLeaveType', () => {
//   //   it('should filter leave history by leaveTypeKey', () => {
//   //     component.fullLeaveHistory.set(mockLeaveHistory);
//   //     const result = component.filterLeaveHistoryDataBYLeaveType('annual');
//   //     expect(result).toEqual([mockLeaveHistory[0]]);
//   //   });

//   //   it('should return empty array for unmatched leaveTypeKey', () => {
//   //     component.fullLeaveHistory.set(mockLeaveHistory);
//   //     const result = component.filterLeaveHistoryDataBYLeaveType('invalid');
//   //     expect(result).toEqual([]);
//   //   });
//   // });

//   // describe('updateLeaveBalBasedOnLeaveType', () => {
//   //   it('should return matching leave balance', () => {
//   //     component.allLeaveBalances.set(mockLeaveBalances);
//   //     const result = component.updateLeaveBalBasedOnLeaveType('annual');
//   //     expect(result).toEqual(mockLeaveBalances[0]);
//   //   });

//   //   it('should return undefined for unmatched leave type', () => {
//   //     component.allLeaveBalances.set(mockLeaveBalances);
//   //     const result = component.updateLeaveBalBasedOnLeaveType('invalid');
//   //     expect(result).toBeUndefined();
//   //   });
//   // });

//   // describe('updateLeaveTypeKey', () => {
//   //   it('should return key for valid leave type value', () => {
//   //     expect(component.updateLeaveTypeKey('Annual Leave')).toBe('annual');
//   //   });

//   //   it('should return undefined for invalid leave type value', () => {
//   //     expect(component.updateLeaveTypeKey('Invalid Leave')).toBeUndefined();
//   //   });
//   // });

//   describe('toUTCZeroTimeISOString', () => {
//     it('should convert date to UTC ISO string with zero time', () => {
//       const date = new Date('2025-07-01T12:00:00Z');
//       const result = component.toUTCZeroTimeISOString(date);
//       expect(result).toBe('2025-07-01T00:00:00.000Z');
//     });
//   });

//   describe('convertToISOString', () => {
//     it('should convert date to ISO string for start date', () => {
//       const date = new Date('2025-07-01T12:00:00Z');
//       const result = component.convertToISOString(date);
//       expect(result).toContain('2025-07-01');
//     });

//     it('should convert date to ISO string for end date with max time', () => {
//       const date = new Date('2025-07-01T12:00:00Z');
//       const result = component.convertToISOString(date, true);
//       expect(result).toContain('23:59:59.000Z');
//     });

//     it('should return null for invalid date', () => {
//       const result = component.convertToISOString('invalid');
//       expect(result).toBeNull();
//     });
//   });

//   describe('onFormSubmit', () => {
//     const mockForm = new FormGroup({
//       startDate: new FormControl(new Date('2025-07-01')),
//       endDate: new FormControl(new Date('2025-07-02')),
//       leaveType: new FormControl('Annual Leave'),
//       reason: new FormControl('Vacation'),
//     });

//     // it('should submit new leave details for non-drafted status', () => {
//     //   const updateLeaveTypeKeySpy = spyOn(component, 'updateLeaveTypeKey').and.returnValue('annual');
//     //   spyOn(component, 'toUTCZeroTimeISOString').and.callFake((date: Date) => date.toISOString());

//     //   component.onFormSubmit(mockForm);
//     //   expect(mockEmployeeStoreService.addLeaveDetails).toHaveBeenCalledWith({
//     //     startDate: jasmine.any(String),
//     //     endDate: jasmine.any(String),
//     //     employeeId: 'IND-1017',
//     //     leaveTypeKey: 'annual',
//     //     reason: 'Vacation',
//     //   });
//     //   expect(updateLeaveTypeKeySpy).toHaveBeenCalledWith('Annual Leave');
//     // });
//   });
// });
