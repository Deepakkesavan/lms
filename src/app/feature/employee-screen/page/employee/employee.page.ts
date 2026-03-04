import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  OnInit,
  signal,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { NgceComponentsModule } from '@clarium/ngce-components';
import { NgceIconModule } from '@clarium/ngce-icon';
import { ICatalog } from '../../../../shared/models/common';
import {
  IDashboardCardDetails,
  ILeaveTypeConfig,
} from '../../../../shared/models/dashboard';
import { SharedService } from '../../../../shared/shared.service';
import { DataStatComponent } from '../../components/data-stat/data-stat.component';
import { HolidaysComponent } from '../../components/holidays/holidays.component';
import { LatestLeavesComponent } from '../../components/latest-leaves/latest-leaves.component';
import { LeaveRequestComponent } from '../../components/leave-request/leave-request.component';
import { PopupComponent } from '../../components/popup/popup.component';
import { DialogBridgeService } from '../../service/dialog-bridge/dialog-bridge.service';
import { EmployeeStoreService } from '../../../../store/employee-store.service';

@Component({
  selector: 'lms-employee',
  standalone: true,
  imports: [
    NgceComponentsModule,
    DataStatComponent,
    LeaveRequestComponent,
    LatestLeavesComponent,
    HolidaysComponent,
    NgceIconModule,
    CommonModule,
    PopupComponent,
  ],
  templateUrl: './employee.page.html',
  styleUrl: './employee.page.scss',
})
export class EmployeeComponent implements OnInit {
  // Services
  private readonly employeeStore = inject(EmployeeStoreService);
  private readonly sharedService = inject(SharedService);
  private readonly dialogBridge = inject(DialogBridgeService);

  // DOM references
  cardComponentContainer = viewChild<ElementRef<any>>('cardComponentContainer');
  cardsScrollWrapper = viewChild<ElementRef<any>>('cardsScrollWrapper');

  // Scroll
  enableLeftScroll = signal(false);
  enableRightScroll = signal(true);
  scrollStep = 320;

  // Styles
  cardStyles: any;

  // Computed signals with guards
  holidayDetails = computed(() => {
    const holidays = this.employeeStore.holidayDetails();
    return Array.isArray(holidays) ? holidays : [];
  });

  leaveDetails = computed(() => {
    const details = this.employeeStore.employeeLeaveDetails();
    return Array.isArray(details) ? details : [];
  });

  leaveTypes = computed(() => {
    const types = this.employeeStore.catalogData()?.catalogs?.Leave;
    return Array.isArray(types) ? types : [];
  });

  leaveDayTypes = computed(() => {
    const types = this.employeeStore.catalogData()?.catalogs?.LeaveDayType;
    return Array.isArray(types) ? types : [];
  });

  leaveTypeColors = computed(() => this.employeeStore.leaveTypeAndColors || {});

  approvalTypes = computed<ICatalog[]>(() => {
    const data =
      this.employeeStore.catalogData()?.catalogs?.['Approval Status'];
    return Array.isArray(data) ? data : [];
  });

  configData = computed(() => {
    const config = this.employeeStore.getLeaveTypeCardConfig;
    return Array.isArray(config) ? config : [];
  });

  latestLeaves = computed(() => {
    const details = this.leaveDetails();
    if (!Array.isArray(details)) return [];
    return [...details].sort(
      (a, b) =>
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    );
  });

  leaveBalanceCardData = signal<IDashboardCardDetails[]>([]);

  constructor() {
    effect(() => {
      const balanceData = this.employeeStore.leaveBalanceData();

      const rawCardData = Array.isArray(balanceData?.card?.LeaveTypeCard)
        ? balanceData.card.LeaveTypeCard
        : [];

      const config = this.configData();

      const types = this.leaveTypes();

      if (config && types) {
        const baseData =
          rawCardData.length > 0
            ? rawCardData
            : this.loadInitialDashboardCardData();

        const transformed = this.setConfigData([...baseData], config, types);

        this.leaveBalanceCardData.set(transformed);
      }
    });

    effect(() => {});
  }

  ngOnInit() {
    console.log('[LMS] Employee initialized');
    this.cardStyles = this.sharedService.getCardStyles();
  }

  loadInitialDashboardCardData(): IDashboardCardDetails[] {
    return this.leaveTypes().map((l: ICatalog) => ({
      leaveType: l.key,
      available: 0,
      booked: 0,
    }));
  }

  setConfigData(
    cardData: IDashboardCardDetails[],
    configData: ILeaveTypeConfig[],
    leaveTypes: ICatalog[]
  ): IDashboardCardDetails[] {
    return cardData.map((data) => {
      const originalLeaveType = (data.leaveType ?? '').toLowerCase();
      const matchedConfig = configData.find(
        (config) => (config.type ?? '').toLowerCase() === originalLeaveType
      );

      if (matchedConfig) {
        data.iconClassName = matchedConfig.iconClassName;
        data.iconBackgroundColor = matchedConfig.iconBackgroundColor;
        data.iconColor = matchedConfig.iconColor;
      }

      const catalogItem = leaveTypes.find(
        (item) => (item.key ?? '').toLowerCase() === originalLeaveType
      );
      if (catalogItem) {
        data.leaveType = catalogItem.value;
      }

      return data;
    });
  }

  onCardClick(leaveType: string) {
    this.dialogBridge.requestOpenForm({
      selectedDate: new Date(),
      leaveType,
      header: `Apply Leave`,
      formType: 'add',
      requestedBy: 'card',
    });
  }

  private getWrapper(): HTMLElement | null {
    return this.cardsScrollWrapper()?.nativeElement ?? null;
  }

  scrollLeft() {
    const el = this.getWrapper();
    if (!el) return;
    this.animateScroll(el, el.scrollLeft - this.scrollStep, 600);
  }

  scrollRight() {
    const el = this.getWrapper();
    if (!el) return;
    this.animateScroll(el, el.scrollLeft + this.scrollStep, 600);
  }

  updateScrollState() {
    const el = this.getWrapper();
    if (!el) return;

    const canScrollLeft = el.scrollLeft > 0;
    const canScrollRight = el.scrollLeft + el.clientWidth < el.scrollWidth - 1;

    this.enableLeftScroll.set(canScrollLeft);
    this.enableRightScroll.set(canScrollRight);
  }

  private animateScroll(
    element: HTMLElement,
    target: number,
    duration: number
  ) {
    const start = element.scrollLeft;
    const change = target - start;
    const startTime = performance.now();

    const easeInOutQuad = (t: number) =>
      t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      element.scrollLeft = start + change * easeInOutQuad(progress);

      if (progress < 1) requestAnimationFrame(step);
      else this.updateScrollState();
    };

    requestAnimationFrame(step);
  }
}
