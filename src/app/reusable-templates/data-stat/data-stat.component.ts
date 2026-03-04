import { Component, TemplateRef, input } from '@angular/core';
import { TAppearance } from '../../shared/literal-types/literal-types';
import { NgceComponentsModule } from '@clarium/ngce-components';
import { NgceIconModule } from '@clarium/ngce-icon';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { IDataStatCardConfig } from '../../shared/models/common';

@Component({
  selector: 'lms-reusable-data-stat',
  standalone: true,
  imports: [NgceComponentsModule, NgceIconModule, CommonModule],
  providers: [TitleCasePipe],
  templateUrl: './data-stat.component.html',
  styleUrl: './data-stat.component.scss',
})
export class ReusableDataStatComponent {
  // Input for card data
  data = input<IDataStatCardConfig>();

  // Card styling
  appearance: TAppearance = 'none';

  cardStyles = {
    padding: '1.5rem',
    'padding-bottom': '.5rem',
    width: 'auto',
    cursor: 'default',
    border: '1px solid #e5e7eb', //rgb(229 231 235 / 31%)
    'background-color': 'white',
    height: 'auto',
    'min-height': '10.4rem',
  };

  cardHeaderStyles = {
    display: 'flex',
    flexFlow: 'row nowrap',
    'justify-content': 'space-between',
    'align-items': 'center',
    gap: '.5rem',
    overflow: 'visible',
  };

  cardContentStyles = {
    display: 'flex',
    flexFlow: 'column nowrap',
    gap: '0rem', // Reduced from .3rem for tighter spacing
  };

  //Method to check whether the given customTemaplte is of type TempalteRef or string(if no content is available to display)
  isTemplateRef(value: any): boolean {
    return value instanceof TemplateRef;
  }
}
