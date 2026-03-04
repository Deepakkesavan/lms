import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataStatComponent } from './data-stat.component';

import { NgceIconModule } from '@clarium/ngce-icon';
import { NgceComponentsModule } from '@clarium/ngce-components';
import { CommonModule } from '@angular/common';

xdescribe('DataStatComponent', () => {
  let component: DataStatComponent;
  let fixture: ComponentFixture<DataStatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DataStatComponent,
        NgceComponentsModule,
        NgceIconModule,
        CommonModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DataStatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
