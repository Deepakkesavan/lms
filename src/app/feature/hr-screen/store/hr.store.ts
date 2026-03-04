import { Injectable, inject } from '@angular/core';
import { HrService } from '../service/hr.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { SharedService } from '../../../shared/shared.service';

@Injectable({
  providedIn: 'root',
})
export class HrStore {
  private readonly _service = inject(HrService);
  private readonly _shared = inject(SharedService);

  cardData = toSignal(this._service.getDataStat(), {
    initialValue: { card: { HrView: [] } },
  });
  leaveReport = toSignal(this._service.getEmployeesLeaveReport(), {
    initialValue: { today: {}, lastWeek: {}, lastMonth: {}, lastYear: {} },
  });
  pendingLeaves = toSignal(this._service.getPendingLeaves(), {
    initialValue: [],
  });
  catalogData = toSignal(this._shared.getCatalogs(), {
    initialValue: {
      catalogs: {
        Leave: [],
        'Approval Status': [],
        Gender: [],
        LeaveDayType: [],
      },
    },
  });
  lopReport = toSignal(this._service.getLopReport(), { initialValue: [] });
  projectReport = toSignal(this._service.getProjectLeaveReport(), {
    initialValue: { today: [], lastWeek: [], lastMonth: [], lastYear: [] },
  });
  projects = toSignal(this._service.getProjects(), { initialValue: [] });
}
