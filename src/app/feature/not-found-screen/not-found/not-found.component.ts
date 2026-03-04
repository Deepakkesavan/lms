import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgceComponentsModule } from '@clarium/ngce-components';

@Component({
  selector: 'lms-not-found',
  imports: [RouterModule, NgceComponentsModule],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
})
export class NotFoundComponent {
  private readonly router = inject(Router);

  goHome() {
    this.router.navigate(['/employee'],{skipLocationChange: false,});
  }
}
