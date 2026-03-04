import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyLeaveFormComponent } from './apply-leave-form.component';

describe('ApplyLeaveFormComponent', () => {
  let component: ApplyLeaveFormComponent;
  let fixture: ComponentFixture<ApplyLeaveFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplyLeaveFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplyLeaveFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
