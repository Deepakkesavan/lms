import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GridComponent } from './grid.component';
import { DialogService, SnackbarService } from '@clarium/ngce-components';
import { DataService } from '../../service/data.service';
import { SharedService } from '../../../../shared/shared.service';
import { of, throwError } from 'rxjs';
import { ILeaveRequestData } from '../../models/approver';

describe('GridComponent', () => {
  let component: GridComponent;
  let fixture: ComponentFixture<GridComponent>;
  let dataServiceSpy: jasmine.SpyObj<DataService>;
  let dialogServiceSpy: jasmine.SpyObj<DialogService>;
  let snackbarServiceSpy: jasmine.SpyObj<SnackbarService>;
  let sharedServiceSpy: jasmine.SpyObj<SharedService>;

  const mockRequest: ILeaveRequestData = {
    employeeId: '1',
    leaveType: 'Casual Leave',
    startDate: new Date('2024-07-10'),
    endDate: new Date('2024-07-12'),
    approvalStatus: 'PENDING',
    days: 3,
    employeeName: 'John Doe',
    reason: 'Vacation',
  };

  beforeEach(async () => {
    dataServiceSpy = jasmine.createSpyObj('DataService', [
      'updateEmployeeLeaveRequest',
    ]);
    dialogServiceSpy = jasmine.createSpyObj('DialogService', [
      'openDialog',
      'closeDialog',
    ]);
    snackbarServiceSpy = jasmine.createSpyObj('SnackbarService', ['show']);
    sharedServiceSpy = jasmine.createSpyObj('SharedService', [
      'getCatalogUsingValue',
    ]);

    await TestBed.configureTestingModule({
      imports: [GridComponent],
      providers: [
        { provide: DataService, useValue: dataServiceSpy },
        { provide: DialogService, useValue: dialogServiceSpy },
        { provide: SnackbarService, useValue: snackbarServiceSpy },
        { provide: SharedService, useValue: sharedServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GridComponent);
    component = fixture.componentInstance;
    // component.employeeLeaveRequestsData.set([mockRequest]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set approvalStatus and open dialog onStatusClick', () => {
    component.onStatusClick('Approve', mockRequest);

    expect(component.approvalStatus).toBe('Approve');
    expect(component.employeeDetails()).toEqual(mockRequest);
    expect(dialogServiceSpy.openDialog).toHaveBeenCalled();
  });

  it('should approve leave request and show success snackbar', () => {
    // Arrange
    component.employeeDetails.set(mockRequest);
    component.approvalStatus = component.approve;
    const successMessage = 'Leave Approved';

    dataServiceSpy.updateEmployeeLeaveRequest.and.returnValue(
      of({ message: successMessage })
    );
    sharedServiceSpy.getCatalogUsingValue.and.returnValue({
      key: 'sick',
      value: 'SICK LEAVE',
    });

    // Act
    component.onActionClick(component.approve);

    // Assert
    expect(dialogServiceSpy.closeDialog).toHaveBeenCalled();
    expect(dataServiceSpy.updateEmployeeLeaveRequest).toHaveBeenCalled();
    expect(snackbarServiceSpy.show).toHaveBeenCalledWith(
      successMessage,
      'success',
      jasmine.any(Object),
      3000,
      '❌',
      'rotateFade'
    );
  });

  it('should reject leave request and show success snackbar', () => {
    component.employeeDetails.set(mockRequest);
    component.approvalStatus = component.reject;
    const rejectMessage = 'Leave Rejected';

    dataServiceSpy.updateEmployeeLeaveRequest.and.returnValue(
      of({ message: rejectMessage })
    );
    sharedServiceSpy.getCatalogUsingValue.and.returnValue({
      key: 'sick',
      value: 'SICK LEAVE',
    });

    component.onActionClick(component.reject);

    expect(dialogServiceSpy.closeDialog).toHaveBeenCalled();
    expect(dataServiceSpy.updateEmployeeLeaveRequest).toHaveBeenCalled();
    expect(snackbarServiceSpy.show).toHaveBeenCalledWith(
      rejectMessage,
      'success',
      jasmine.any(Object),
      3000,
      '❌',
      'rotateFade'
    );
  });

  it('should show error snackbar on API failure', () => {
    component.employeeDetails.set(mockRequest);
    component.approvalStatus = component.approve;

    dataServiceSpy.updateEmployeeLeaveRequest.and.returnValue(
      throwError(() => new Error('Something went wrong'))
    );
    sharedServiceSpy.getCatalogUsingValue.and.returnValue({
      key: 'sick',
      value: 'SICK LEAVE',
    });

    component.onActionClick(component.approve);

    expect(snackbarServiceSpy.show).toHaveBeenCalledWith(
      'Something went wrong',
      'danger',
      jasmine.any(Object),
      3000,
      '❌',
      'rotateFade'
    );
  });

  it('should remove the approved/rejected row from localLeaveRequest', () => {
    component.localLeaveRequest.set([mockRequest]);
    component.employeeDetails.set(mockRequest);
    expect(component.localLeaveRequest().length).toBe(0);
  });

  it('should return ILeaveApprovalDetails from returnLeaveApproval', () => {
    sharedServiceSpy.getCatalogUsingValue.and.returnValue({
      key: 'sick',
      value: 'SICK LEAVE',
    });

    const result = component['returnLeaveApproval']('APPROVED', mockRequest);

    expect(result).toEqual({
      employeeId: '1',
      approvalKey: 'APPROVED',
      startDate: mockRequest.startDate,
      endDate: mockRequest.endDate,
      leaveKey: 'sick',
    });
  });
});
