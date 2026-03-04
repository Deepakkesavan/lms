import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SimpleDataStatComponent } from './simple-data-stat.component';
import { IDashboardCardDetails } from '../../shared/models/dashboard';
import { CommonModule } from '@angular/common';

describe('SimpleDataStatComponent', () => {
  let component: SimpleDataStatComponent;
  let fixture: ComponentFixture<SimpleDataStatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, SimpleDataStatComponent], // if needed
    }).compileComponents();

    fixture = TestBed.createComponent(SimpleDataStatComponent);
    component = fixture.componentInstance;
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.cardStylesColor()).toBe('pink');
    expect(component.content()).toEqual([]);
  });

  it('should update content and cardStylesColor when inputs are set', async () => {
    const mockDate = new Date('2024-07-01');
    const mockData: IDashboardCardDetails = {
      available: 10,
      iconColor: 'blue',
    } as IDashboardCardDetails;

    fixture.componentRef.setInput('data', mockData);
    fixture.componentRef.setInput('leaveReqDays', 3);
    fixture.componentInstance.currentDate.set(mockDate);

    fixture.detectChanges(); // triggers lifecycle and reactive updates

    const updatedContent = component.content();

    expect(updatedContent.length).toBe(4);
    expect(updatedContent[0].content).toContain('As on');
    expect(updatedContent[1].data).toBe(10);
    expect(updatedContent[2].data).toBe(3);
    expect(updatedContent[3].data).toBe(7); // 10 - 3
    expect(component.cardStylesColor()).toBe('blue');
  });

  it('should return correctly formatted date', () => {
    const result = component.formatDate(new Date('2024-12-25'));
    expect(result).toBe('25-Dec-2024');
  });

  it('should return empty string for undefined date in formatDate()', () => {
    const result = component.formatDate(undefined);
    expect(result).toBe('');
  });

  it('should fallback to defaults for undefined input values', () => {
    fixture.componentRef.setInput('leaveReqDays', undefined);
    fixture.componentRef.setInput('data', {
      available: undefined,
      iconColor: 'red',
    });

    fixture.detectChanges();

    const updated = component.content();
    expect(updated[1].data).toBe(0); // default for available
    expect(updated[2].data).toBe(0); // default for leaveReqDays
    expect(updated[3].data).toBe(0); // 0 - 0
    expect(component.cardStylesColor()).toBe('red');
  });
});
