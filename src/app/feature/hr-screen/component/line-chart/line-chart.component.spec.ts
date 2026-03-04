import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChartTypeRegistry, TooltipModel } from 'chart.js';
import { LineChartComponent } from './line-chart.component';
import { signal } from '@angular/core';

describe('LineChartComponent', () => {
  let component: LineChartComponent;
  let fixture: ComponentFixture<LineChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LineChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LineChartComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with undefined data and labels', () => {
    expect(component.data).toBeUndefined();
    expect(component.labels()).toBeUndefined();
  });

  it('should update data when labels input changes', () => {
    // Provide a signal input for labels
    const testLabels = signal(['Jan', 'Feb', 'Mar', 'Apr']);
    fixture.componentRef.setInput('labels', testLabels);
    fixture.detectChanges();
    expect(component.data).toBeDefined();
    expect(component.data.datasets.length).toBe(2);
    expect(component.data.datasets[0].label).toBe('Employees');
    expect(component.data.datasets[0].type).toBe('bar');
    expect(component.data.datasets[1].label).toBe('LOP');
  });

  it('should return correct colors based on dataset label', () => {
    const callback =
      component.options!.plugins?.tooltip?.callbacks?.labelTextColor!;
    const testCases = [
      { label: 'Employees', expected: 'rgb(59, 130, 246)' },
      { label: 'LOP', expected: 'rgb(245, 158, 11)' },
      { label: 'Other', expected: '#fff' },
    ];

    testCases.forEach(({ label, expected }) => {
      const tooltipItem = { dataset: { label } } as any;
      const fakeThis = {} as TooltipModel<keyof ChartTypeRegistry>;
      const color = callback.call(fakeThis, tooltipItem);

      expect(color).toBe(expected);
    });
  });

  it('should return default color if tooltipItem is null or dataset is missing', () => {
    const callback =
      component.options!.plugins?.tooltip?.callbacks?.labelTextColor!;
    const fakeThis = {} as TooltipModel<keyof ChartTypeRegistry>;

    // Case 1: tooltipItem is null
    const result1 = callback.call(fakeThis, null as any);
    expect(result1).toBe('rgba(255, 255, 255, 0.85)');

    // Case 2: tooltipItem is empty object (no dataset)
    const result2 = callback.call(fakeThis, {} as any);
    expect(result2).toBe('rgba(255, 255, 255, 0.85)');
  });
});
