
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BACKEND_URL } from '../../api-config';

export interface ReponseConnexion {
  token: string;
  type: string;
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: 'ADMIN' | 'MARIE' | 'CONTROLEUR' | 'RESTAURATION';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

private apiUrl = `${BACKEND_URL}/api/auth`;

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<ReponseConnexion> {
    return this.http.post<ReponseConnexion>(
      `${this.apiUrl}/login`,
      { email, password }
    );
  }


  sauvegarderConnexion(reponse: ReponseConnexion): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    localStorage.setItem('token', reponse.token);
    localStorage.setItem('role', reponse.role);
    localStorage.setItem('utilisateur', JSON.stringify({
      id: reponse.id,
      nom: reponse.nom,
      prenom: reponse.prenom,
      email: reponse.email,
      role: reponse.role
    }));
  }

  getToken(): string | null {
    return typeof localStorage !== 'undefined'
      ? localStorage.getItem('token')
      : null;
  }

  getRole(): string | null {
    return typeof localStorage !== 'undefined'
      ? localStorage.getItem('role')
      : null;
  }

  isConnecte(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('utilisateur');
  }

}