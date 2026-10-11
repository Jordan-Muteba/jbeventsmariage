import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const marieGuard: CanActivateFn = () => {

  const router = inject(Router);

  const role = localStorage.getItem('role');

  if (role === 'MARIE') {
    return true;
  }

  router.navigate(['/login']);

  return false;
};