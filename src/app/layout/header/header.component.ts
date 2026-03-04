import { Component, ElementRef, HostListener, inject } from '@angular/core';
import { NgceIconModule } from '@clarium/ngce-icon';
import { NgceComponentsModule } from '@clarium/ngce-components';
import { Router } from '@angular/router';
import { EmployeeStoreService } from '../../store/employee-store.service';
import { AuthService } from '../../shared/auth.service';

@Component({
  selector: 'lms-header',
  standalone: true,
  imports: [NgceComponentsModule, NgceIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  menuOpen = false;
  private _employeeScreenStore = inject(EmployeeStoreService);
  private readonly authService = inject(AuthService);
  constructor(private router: Router, private elementRef: ElementRef) {}

  toggleMenu() {
    this.menuOpen = !this.menuOpen; // Toggle dropdown visibility
  }

  logout() {
    this.authService.logout().subscribe({
      next: (res) => {
        window.location.href = 'http://localhost:5050/login';
        // additional post-logout logic here, like redirecting to login page
      },
      error: (err) => {
        // handle logout failure if needed
      },
    });

    sessionStorage.removeItem('user'); // Remove user data
    this._employeeScreenStore.reset();
  }
  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.menuOpen = false; // Close the menu if clicked outside
    }
  }
}
