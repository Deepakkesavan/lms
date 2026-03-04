import { CommonModule, DatePipe } from '@angular/common';
import { Component, computed, effect, input, signal } from '@angular/core';
import { NgceComponentsModule } from '@clarium/ngce-components';
import { NgceIconModule } from '@clarium/ngce-icon';
import { IHolidayDetails } from '../../../../shared/models/dashboard';
import { MenuComponent } from "../../../../reusable-templates/menu/menu/menu.component";

@Component({
  selector: 'lms-holidays',
  standalone: true,
  imports: [NgceComponentsModule, NgceIconModule, CommonModule, MenuComponent],
  providers: [DatePipe],
  templateUrl: './holidays.component.html',
  styleUrl: './holidays.component.scss',
})
export class HolidaysComponent {
  readonly holidays = input<IHolidayDetails[]>([]);
  latestHolidays = signal<IHolidayDetails[]>([]);
  option = signal<string>('All');
  readonly title: string = `Holidays Overview`;
  readonly notFoundContent = 'No holidays found';

  readonly menuItems = ["All","Upcoming Holidays"]

  constructor(){
    effect(()=>{
      this.latestHolidays.set([...this.holidays()]);
    })
  }
  filteredHolidays = computed(()=>{
    const allHolidays = this.latestHolidays();
    allHolidays.sort((a,b)=>  new Date(a.date).getTime() - new Date(b.date).getTime());
    const selected = this.option();
    if(selected === 'All') return allHolidays;
    const presentDate = new Date();
    const filtered = allHolidays.filter((holiday) => new Date(holiday.date).getTime() >= presentDate.getTime());
    
    return filtered
  });

  onItemSelected(item: string){
    this.option.set(item);
  }
  // Styles

  readonly menuStyle = {
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    borderRadius: '6px',
    width: '200px',
  };
  readonly cardStyles = {
    display: 'flex',
    width: 'auto',
    'flex-flow': 'column nowrap',
    padding: '0.5rem 1.2rem',
    cursor: 'default',
    border: '0 solid #e5e7eb',
    'box-shadow': ' 0px 0px 2px rgba(0, 0, 0, .35)',
    'background-color': 'var(--light-light) !important',
    marginBottom: '1rem',
  };
}
