import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation, input } from '@angular/core';
import { NgceIconModule } from '@clarium/ngce-icon';
import { NgceComponentsModule } from '@clarium/ngce-components';
import { IDashboardCardDetails } from '../../../../shared/models/dashboard';
import { CARDSTYLES } from '../../../../shared/common-styles';

@Component({
  selector: 'lms-data-stat',
  standalone: true,
  imports: [NgceComponentsModule, NgceIconModule, CommonModule],
  templateUrl: './data-stat.component.html',
  styleUrl: './data-stat.component.scss',
  encapsulation: ViewEncapsulation.Emulated,
})
export class DataStatComponent {
  readonly cardData = input<IDashboardCardDetails>();

  cardStyles = CARDSTYLES;

  available = 'Available';
  booked = 'Booked';

  // styles
  cardHeaderStyle = {
    display: 'flex',
    'justify-content': 'space-between',
    'align-items': 'center',
    'margin-bottom': '.125rem',
    overflow: 'visible',
  };

  contentDividerStyle = {
    color: '#e5e7eb',
    'margin-top': '.125rem',
    opacity: '.5',
  };
}
