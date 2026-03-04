import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HolidaysComponent } from './holidays.component';
import { IHolidayDetails } from '../../../../shared/models/dashboard';

describe('', () => {
  let component: HolidaysComponent;
  let fixture: ComponentFixture<HolidaysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HolidaysComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HolidaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should take the correct input signal', ()=>{
    const holidays: IHolidayDetails[] = [
      {
        name: 'Independance Day',
        date: new Date('15/08/2025'),
        description: 'INdependance Day'
      },
      {
        name: 'Deepavali',
        date: new Date('20/10/2025'),
        description: 'Deepavali'
      }
    ]
    fixture.componentRef.setInput('holidays', holidays)

    expect(component.holidays()?.length).toBe(2);
  })

  it('should have correct readonly style properties', ()=>{
    expect(component.title).toEqual('Holidays Overview');
    expect(component.cardStyles).toEqual({
      display: 'flex',
      width: 'auto',
      'flex-flow': 'column nowrap',
      padding: '0.5rem 1.2rem',
      cursor: 'default',
      border: '0 solid #e5e7eb',
      'box-shadow': ' 0px 0px 2px rgba(0, 0, 0, .35)',
      'background-color': 'white',
      marginBottom: '1rem'
    })
  });
});
