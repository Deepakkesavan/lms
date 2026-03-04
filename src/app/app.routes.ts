import { Routes } from '@angular/router';
import { roleGuard } from './guards/role-guard/role.guard';
import { HR_SCREEN_DATA } from './screen-access-details/screen-access-details';

export const lmsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'employee' },
      {
        path: 'employee',
        loadComponent: () =>
          import('./feature/employee-screen/page/employee/employee.page').then(
            (m) => m.EmployeeComponent
          ),
      },
      {
        path: 'approver',
        loadComponent: () =>
          import(
            './feature/approver-screen/page/approver-screen.component'
          ).then((m) => m.ApproverScreenComponent),
      },
      {
        path: 'hr',
        loadComponent: () =>
          import('./feature/hr-screen/page/hr.page').then((m) => m.HrPage),
        data: [{ roles: HR_SCREEN_DATA }],
        canActivate: [roleGuard],
      },

      {
        path: '**',
        redirectTo: 'employee',
      },
    ],
  },
];
