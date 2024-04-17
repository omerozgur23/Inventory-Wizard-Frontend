import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { LoginService } from '../../core/service/login.service';
import { ToastrService } from 'ngx-toastr';
import { inject } from '@angular/core';

export function roleControlGuard(...roles: string[]): CanActivateFn {
  return (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
     let loginService = inject(LoginService);
     let toastr = inject(ToastrService);
     let router = inject(Router);
 
     let sonuc = loginService.roles.find(rol => roles.find(rol2 => rol2 === rol)!=undefined) != undefined;
     if (!sonuc) {
      //  toastr.error('Bu sayfaya girmeye yetkiniz bulunmamaktadır');
       router.navigate(["/menu/access-denied"]);
     }
     return sonuc;
  }
};
