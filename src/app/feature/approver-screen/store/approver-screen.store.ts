import { Injectable, inject } from '@angular/core';
import { DataService } from '../service/data.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { SharedService } from '../../../shared/shared.service';

@Injectable({
  providedIn: 'root',
})
export class ApproverScreenStore {
  private readonly _service = inject(DataService);
  private readonly _sharedService = inject(SharedService);

  cardDetails = toSignal(
    this._service.getApproverData(
      this._sharedService.getSessionDetails().employeeId
    ),
    {
      initialValue: { card: { ManagerView: [] } },
    }
  );
  leaveRequests = toSignal(
    this._service.getEmployeeLeaveRequests(
    ),
    {
      initialValue: [],
    }
  );
  catalogData = toSignal(this._sharedService.getCatalogs(), {
    initialValue: {
      catalogs: {
        Leave: [],
        'Approval Status': [],
        Gender: [],
        LeaveDayType: [],
      },
    },
  });
}
