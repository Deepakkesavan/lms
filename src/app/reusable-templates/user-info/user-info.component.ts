import { Component, input } from '@angular/core';
import { NgceIconModule } from '@clarium/ngce-icon';
import { NgceComponentsModule } from '@clarium/ngce-components';
import { AssigneeResponse } from '../../feature/hr-screen/models/hr';

@Component({
  selector: 'lms-user-info',
  standalone: true,
  imports: [NgceComponentsModule, NgceIconModule],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.scss',
})
export class UserInfoComponent {
  data = input<AssigneeResponse>();
}
