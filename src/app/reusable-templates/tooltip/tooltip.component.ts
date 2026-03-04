import { CommonModule } from '@angular/common';
import { Component, TemplateRef, input } from '@angular/core';

@Component({
  selector: 'lms-tooltip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tooltip.component.html',
  styleUrl: './tooltip.component.scss',
})
export class TooltipComponent {
  customTemplate = input<TemplateRef<any> | null>(null);
  toolTipText = input<string>();
}
