import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

export const adminGuard: CanActivateFn = () => {

  const router = inject(Router);
  const authService = inject(AuthService);

  // const role = localStorage.getItem('role');



  if (
    authService.isConnecte() &&
    authService.getRole() === 'ADMIN'
  ) {
    return true;
  }

  return router.createUrlTree(['/login']);
};
