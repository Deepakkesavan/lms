import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataStatComponent } from './data-stat.component';

describe('DataStatComponent', () => {
  let component: DataStatComponent;
  let fixture: ComponentFixture<DataStatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataStatComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DataStatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
