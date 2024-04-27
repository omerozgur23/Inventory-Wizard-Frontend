import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { LoginService } from '../../core/service/login.service';
import { inject } from '@angular/core';

export function roleControlGuard(...roles: string[]): CanActivateFn {
  return (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
     let loginService = inject(LoginService);
     let router = inject(Router);
 
     let sonuc = loginService.roles.find(rol => roles.find(rol2 => rol2 === rol)!=undefined) != undefined;
     if (!sonuc) {
       router.navigate(["/home/access-denied"]);
     }
     return sonuc;
  }
};
