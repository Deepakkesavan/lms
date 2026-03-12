import { Component, HostListener, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { Router, RouterOutlet } from '@angular/router';
import { SharedService } from '../../shared/shared.service';
import { Location } from '@angular/common';
import { filter } from 'rxjs';

@Component({
  selector: 'lms-main-layout',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class MainLayoutComponent implements OnInit {
  private readonly sharedService = inject(SharedService);
  isLoading = true;
  private readonly router = inject(Router);
  private readonly location = inject(Location);

  ngOnInit() {
    console.log('[LMS] MainLayout initialized');
    this.isLoading = this.sharedService.getIsDatalOadingStatus();
  }

}

export default MainLayoutComponent;
