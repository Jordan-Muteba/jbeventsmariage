import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BACKEND_URL } from '../api-config';

export interface InvitationPublique {
  codeInvitation: string;
  dateCreation: string;

  nomComplet: string;
  typeInvitation: 'INDIVIDUELLE' | 'COUPLE' | 'FAMILIALE';
  nombreAccompagnants: number;
  heureArriveePrevue: string | null;
  nomTable: string | null;

  nomMarie: string;
  nomMariee: string;
  description: string | null;
  dateMariage: string;
  heureMariage: string;
  lieu: string;
  adresse: string;
  photoPrincipale: string | null;
  video: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class InvitationService {

  private http = inject(HttpClient);
private apiUrl = `${BACKEND_URL}/api/invitations`;

  obtenirInvitationPublique(code: string ): Observable<InvitationPublique> {

    return this.http.get<InvitationPublique>(
      `${this.apiUrl}/public/${encodeURIComponent(code)}`
    );
  }
}