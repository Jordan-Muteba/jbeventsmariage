
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth-service';
import { BACKEND_URL } from '../../api-config';

export const jwtInterceptor: HttpInterceptorFn = (requete, suivant) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // Reconnaître les requêtes vers notre backend, local ou hébergé.
  const estBackend =
    requete.url.startsWith(`${BACKEND_URL}/api/`) ||
    requete.url.startsWith('http://localhost:8080/api/');

  if (!token || !estBackend) {
    return suivant(requete);
  }

  const requeteAvecToken = requete.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return suivant(requeteAvecToken);
};