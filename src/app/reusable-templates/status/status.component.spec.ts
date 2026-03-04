import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusComponent } from './status.component';
import { CommonModule } from '@angular/common';
import { CapitalizePipe } from '../../shared/pipes/capitalize.pipe';
import { NgceComponentsModule } from '@clarium/ngce-components';
import { NgceIconModule } from '@clarium/ngce-icon';

describe('StatusComponent', () => {
  let component: StatusComponent;
  let fixture: ComponentFixture<StatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        StatusComponent,
        CommonModule,
        CapitalizePipe,
        NgceComponentsModule,
        NgceIconModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get status-pending class for the pending staus', () => {
    fixture.componentRef.setInput('status', 'pending');
    const result = component.getStatusClassName();
    expect(result).toBe('status-pending');
  });

  it('should get status-rejected class for the rejected staus', () => {
    fixture.componentRef.setInput('status', 'rejected');
    const result = component.getStatusClassName();
    expect(result).toBe('status-rejected');
  });

  it('should get status-approved class for the approved staus', () => {
    fixture.componentRef.setInput('status', 'approved');
    const result = component.getStatusClassName();
    expect(result).toBe('status-completed');
  });

  it('should get status-cancelled class for the cancelled staus', () => {
    fixture.componentRef.setInput('status', 'cancelled');
    const result = component.getStatusClassName();
    expect(result).toBe('status-cancelled');
  });

  it('should get status-drafted class for the drafted staus', () => {
    fixture.componentRef.setInput('status', 'draft');
    const result = component.getStatusClassName();
    expect(result).toBe('status-drafted');
  });

  it('should get status-pending class defaulty', () => {
    fixture.componentRef.setInput('status', 'drafted');
    const result = component.getStatusClassName();
    expect(result).toBe('status-pending');
  });
});
