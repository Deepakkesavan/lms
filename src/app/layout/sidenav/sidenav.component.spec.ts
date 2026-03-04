import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidenavComponent } from './sidenav.component';

import { NgceComponentsModule } from '@clarium/ngce-components';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('SidenavComponent', () => {
  let component: SidenavComponent;
  let fixture: ComponentFixture<SidenavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidenavComponent, NgceComponentsModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}), // or any mock valuessnapshot: {},
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
