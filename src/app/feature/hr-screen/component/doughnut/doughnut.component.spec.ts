import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoughnutComponent } from './doughnut.component';
import { SharedService } from '../../../../shared/shared.service';
import { ILeaveReportConfig } from '../../../../shared/models/common';
import { IReusableDictionary } from '../../../../shared/literal-types/literal-types';

describe('DoughnutComponent', () => {
  let component: DoughnutComponent;
  let fixture: ComponentFixture<DoughnutComponent>;
  let mockSharedService: jasmine.SpyObj<SharedService>;

  const mockConfig: ILeaveReportConfig[] = [
    {
      key: 'casual',
      label: 'Casual Leave',
      backgroundColor: 'green',
      hoverBackgroundColor: 'darkgreen',
    },
    {
      key: 'sick',
      label: 'Sick Leave',
      backgroundColor: 'blue',
      hoverBackgroundColor: 'darkblue',
    },
  ];

  beforeEach(() => {
    mockSharedService = jasmine.createSpyObj('SharedService', [
      'getEmployeeLeaveReportConfig',
    ]);
    mockSharedService.getEmployeeLeaveReportConfig.and.returnValue(mockConfig);

    TestBed.configureTestingModule({
      imports: [DoughnutComponent],
      providers: [{ provide: SharedService, useValue: mockSharedService }],
    });

    fixture = TestBed.createComponent(DoughnutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should return correct config from getConfig()', () => {
    const mockData: IReusableDictionary<string, number> = {
      casual: 2,
      sick: 3,
    };

    const config = component.getConfig(mockData);

    expect(config.labels).toEqual(['Casual Leave', 'Sick Leave']);
    expect(config.datasets[0].data).toEqual([2, 3]);
    expect(config.datasets[0].backgroundColor).toEqual(['green', 'blue']);
    expect(config.datasets[0].hoverBackgroundColor).toEqual([
      'darkgreen',
      'darkblue',
    ]);
  });

  it('should initialize doughnutData when leaveData signal is passed', () => {
    const mockLeaveData: IReusableDictionary<string, number> = {
      casual: 4,
      sick: 1,
    };

    // Simulate input value
    fixture.componentRef.setInput('leaveData', mockLeaveData);
    fixture.detectChanges();

    const expected = component.getConfig(mockLeaveData);
    expect(component.doughnutData).toEqual(expected);
  });

  it('should return fallback value in getLabelValues if key is missing', () => {
    const result = component['getLabelValues'](['casual', 'wfh'], {
      casual: 2,
    });
    expect(result).toEqual([2, 0]); // 'wfh' not present, defaults to 0
  });

  it('should have doughnut options configured correctly', () => {
    const options = component.doughnutOptions!;
    expect(options.responsive).toBeTrue();
    expect(options.plugins?.legend?.position).toBe('top');
    const animation = component.doughnutOptions!.plugins?.tooltip?.animation;

    expect(
      animation && typeof animation !== 'boolean'
        ? animation.duration
        : undefined
    ).toBe(450);
  });
});
