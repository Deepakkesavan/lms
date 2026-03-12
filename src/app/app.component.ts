import { CommonModule, Location } from '@angular/common';
import { Component, inject, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'lms-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.Emulated, // Explicit encapsulation for style isolation
})
class AppComponent {
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  constructor(
  ) {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => {
        if (e.urlAfterRedirects.startsWith('/lms')) {
          this.location.replaceState('/lms');
        }
      });
  }
}
export default AppComponent;
