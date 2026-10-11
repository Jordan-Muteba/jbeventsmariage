import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {

    return this.http.post<any>(
      `${this.apiUrl}/connexion`,
      {
        email: email,
        password: password
      }
    );
  }

  sauvegarderConnexion(reponse: any): void {

    localStorage.setItem(
      'token',
      reponse.token
    );

    localStorage.setItem(
      'role',
      reponse.role
    );
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  isConnecte(): boolean {
    return !!this.getToken();
  }

  logout(): void {

    localStorage.removeItem('token');
    localStorage.removeItem('role');
  }
}