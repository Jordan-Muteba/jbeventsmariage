import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

export const marieGuard: CanActivateFn = () => {

  const authService = inject(AuthService);
  const router = inject(Router);

  if (
    authService.isConnecte() &&
    authService.getRole() === 'MARIE'
  ) {
    return true;
  }

  return router.createUrlTree(['/login']);
};