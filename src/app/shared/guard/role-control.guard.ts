import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { LoginService } from '../../core/service/login.service';
import { inject } from '@angular/core';

export function roleControlGuard(...roles: string[]): CanActivateFn {
  return (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
     let loginService = inject(LoginService);
     let router = inject(Router);
 
     let result = loginService.roles.find(role => roles.find(role2 => role2 === role)!=undefined) != undefined;
     if (!result) {
       router.navigate(["/home/access-denied"]);
     }
     return result;
  }
};
