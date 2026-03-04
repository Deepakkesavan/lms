import { NgTemplateOutlet } from '@angular/common';
import { Component, TemplateRef, input } from '@angular/core';

@Component({
  selector: 'lms-user-name-with-icon',
  standalone: true,
  imports: [
    NgTemplateOutlet
  ],
  templateUrl: './user-name-with-icon.component.html',
  styleUrl: './user-name-with-icon.component.scss',
})
export class UserNameWithIconComponent {
  data = input<any>();

  template = input<TemplateRef<any> | null>();

}
