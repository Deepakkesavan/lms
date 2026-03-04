import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarChartComponent } from './bar-chart.component';
import { ChartTypeRegistry, TooltipModel } from 'chart.js';
import { TooltipItem } from 'chart.js';

describe('BarChartComponent', () => {
  let component: BarChartComponent;
  let fixture: ComponentFixture<BarChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BarChartComponent],
    });

    fixture = TestBed.createComponent(BarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct default chart data', () => {
    const chartData = component.barChartData;

    expect(chartData.labels).toEqual(['Clarium Project Management']);
    expect(chartData.datasets.length).toBe(5);

    const labels = chartData.datasets.map((d) => d.label);
    expect(labels).toContain('Casual Leave');
    expect(labels).toContain('Sick Leave');
    expect(labels).toContain('WFH');
    expect(labels).toContain('Paternity');
    expect(labels).toContain('Maternity');
  });

  it('should return correct tooltip label color', () => {
    const tooltip = component.barChartOptions!.plugins?.tooltip;

    const mockCallback: any = {
      dataset: { label: 'WFH' },
    };

    const tooltipCallbacks = tooltip?.callbacks;
    const color = tooltipCallbacks?.labelTextColor?.call(
      {} as TooltipModel<keyof ChartTypeRegistry>,
      mockCallback
    );
    expect(color).toBe('rgb(245, 158, 11)');
  });

  const labelCases = [
    { label: 'Casual Leave', expected: 'rgb(34, 197, 94)' },
    { label: 'Sick Leave', expected: 'rgb(59, 130, 246)' },
    { label: 'WFH', expected: 'rgb(245, 158, 11)' },
    { label: 'Paternity', expected: 'rgb(191, 239, 255)' },
    { label: 'Maternity', expected: 'rgb(255, 182, 193)' },
    { label: 'Unknown', expected: '#fff' },
  ];

  labelCases.forEach(({ label, expected }) => {
    it(`should return correct tooltip color for "${label}"`, () => {
      const mockTooltipItem = {
        chart: {} as any,
        label: 'Some label',
        parsed: '',
        raw: '',
        dataset: { label },
        dataIndex: 0,
        datasetIndex: 0,
        element: {} as any,
        formattedValue: '',
      } as unknown as TooltipItem<'bar'>;

      const labelTextColorFn =
        component.barChartOptions!.plugins?.tooltip?.callbacks?.labelTextColor;

      const color = labelTextColorFn?.call({} as any, mockTooltipItem);

      expect(color).toBe(expected);
    });
  });

  it('should apply delay correctly in animation callback', () => {
    component['delayed'] = false;

    const context: any = {
      type: 'data',
      mode: 'default',
      dataIndex: 1,
      datasetIndex: 2,
    };

    const delayFn = (component.barChartOptions!.animation as any)?.delay;
    const delay = delayFn(context);
    expect(delay).toBe(1 * 300 + 2 * 100);
  });

  it('should return 0 delay when animation is already delayed', () => {
    component['delayed'] = true;

    const context: any = {
      type: 'data',
      mode: 'default',
      dataIndex: 1,
      datasetIndex: 2,
    };

    const delayFn = (component.barChartOptions!.animation as any)?.delay;
    const delay = delayFn(context);
    expect(delay).toBe(0);
  });

  it('should return default color when tooltip item is undefined', () => {
    const fn =
      component.barChartOptions!.plugins?.tooltip?.callbacks?.labelTextColor!;
    const color = fn.call({} as TooltipModel<any>, undefined as any);
    expect(color).toBe('rgba(255, 255, 255, 0.85)');
  });
});
