import {
  CanActivateFn,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../shared/auth.service';
import { SharedService } from '../../shared/shared.service';
import { HR_NAV_ITEMS } from '../../screen-access-details/screen-access-details';
import { map } from 'rxjs/operators';

export const roleGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const sharedService = inject(SharedService);

  // getAllDesignations() returns Observable<string[]>
  return authService.getAllDesignations().pipe(
    map((designations: string[]) => {
      const requiredRoles = route.data[0].roles; //string[]

      const hasAccess = requiredRoles.some((role: string) =>
        designations.includes(role)
      );

      if (hasAccess) {
        sharedService.setNavItems(HR_NAV_ITEMS);
      }

      return hasAccess;
    })
  );
};
