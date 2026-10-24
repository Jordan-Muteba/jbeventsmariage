
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BACKEND_URL } from '../api-config';

export interface Utilisateur {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: 'ADMIN' | 'MARIE' | 'CONTROLEUR' | 'RESTAURATION';
  actif: boolean;
}

export interface Mariage {
  id: number;
  nomMarie: string;
  nomMariee: string;
  description?: string;
  dateMariage?: string;
  heureMariage?: string;
  lieu?: string;
  adresse?: string;
  photoPrincipale?: string;
  video?: string;
  codeInvitation?: string;
  utilisateurMarie?: Utilisateur | null;
  utilisateurMariee?: Utilisateur | null;
}

@Injectable({
  providedIn: 'root'
})
export class MariageService {

  private readonly apiMariages =
  `${BACKEND_URL}/api/mariages`;

private readonly apiUtilisateurs =
  `${BACKEND_URL}/api/utilisateurs`;

  constructor(private http: HttpClient) {}

  // Charger tous les mariages : administrateur uniquement
  getMariages(): Observable<Mariage[]> {
    return this.http.get<Mariage[]>(this.apiMariages);
  }

  // Charger le mariage du compte marié connecté
getMonMariage(): Observable<Mariage> {
  return this.http.get<Mariage>(
    `${this.apiMariages}/mon-mariage`
  );
}

  // Charger les comptes pour les listes de sélection
  getUtilisateurs(): Observable<Utilisateur[]> {
    return this.http.get<Utilisateur[]>(this.apiUtilisateurs);
  }

  // Créer un mariage
  creerMariage(mariage: Partial<Mariage>): Observable<Mariage> {
    return this.http.post<Mariage>(this.apiMariages, mariage);
  }

  // Associer les deux comptes au mariage sélectionné
  associerComptes(
    mariageId: number,
    utilisateurMarieId: number,
    utilisateurMarieeId: number
  ): Observable<Mariage> {
    return this.http.post<Mariage>(
      `${this.apiMariages}/${mariageId}/associer`,
      {
        utilisateurMarieId,
        utilisateurMarieeId
      }
    );
  }

  modifierMariage(id: number, donnees: any) {
  return this.http.put<Mariage>(
    `${this.apiMariages}/${id}`,
    donnees
  );
}

}