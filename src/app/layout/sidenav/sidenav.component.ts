import { Component, inject } from '@angular/core';
import {
  IAdvanceSidebarNavItems,
  IAdvancedSidebarConfig,
} from '@clarium/ezui-blocks';
import { NgceComponentsModule } from '@clarium/ngce-components';
import { SharedService } from '../../shared/shared.service';

@Component({
  selector: 'lms-sidenav',
  standalone: true,
  imports: [NgceComponentsModule],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
})
export class SidenavComponent {
  readonly sharedService = inject(SharedService);
  menuItems: IAdvanceSidebarNavItems[] = this.sharedService.getNavItems();

  isClosed = false;

  //configuration for sidebar
  sidebarConfig: IAdvancedSidebarConfig = {
    fixed: false,
    sections: [
      {
        navItems: this.menuItems,
      },
    ],
    collapseIcon: {},
    styles: {
      header: {
        fontWeight: 'bold',
        padding: '1.5rem',
      },
      navItem: {
        default: {
          padding: '5rem auto',
          fontWeight: '500',
          // color: 'rgb(77,0,77)',
        },
        // hover: {
        //   'background-color': 'rgb(77,0,77,0.2)',
        // },
        // active: {
        //   'background-color': 'rgba(77,0,77,0.8) !important',
        // },
      },
      sidebar: { height: '100%', width: 'fit-content' },
    },
  };

  onExpansionChange(event: boolean) {
    this.isClosed = event;
  }
}
