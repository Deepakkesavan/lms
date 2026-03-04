import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveRequestComponent } from './leave-request.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('LeaveRequestComponent', () => {
  let component: LeaveRequestComponent;
  let fixture: ComponentFixture<LeaveRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveRequestComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}), // or any mock valuessnapshot: {},
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LeaveRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
