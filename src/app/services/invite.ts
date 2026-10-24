import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BACKEND_URL } from '../api-config';

export type TypeInvitation =
  | 'INDIVIDUELLE'
  | 'COUPLE'
  | 'FAMILIALE';

export interface Invite {
  id?: number;
  nomComplet: string;
  telephone: string;
  nombreAccompagnants: number;
  heureArriveePrevue?: string | null;
  remarque?: string | null;
  typeInvitation: TypeInvitation;
  tableMariage?: TableMariage | null;
}

export interface TableMariage {
  id: number;
  nom?: string;
  numero?: number;
  capacite?: number;
}

export interface InvitationCreee {
  id: number;
  nomComplet: string;
  nombreAccompagnants: number;
  telephone: string;
  typeInvitation: TypeInvitation;
  codeInvitation: string;
  lienInvitation: string;
}

@Injectable({
  providedIn: 'root'
})
export class InviteService {
  private readonly http = inject(HttpClient);
private readonly apiInvites =
  `${BACKEND_URL}/api/invites`;

private readonly apiTables =
  `${BACKEND_URL}/api/tables`;

private readonly apiInvitations =
  `${BACKEND_URL}/api/invitations`;

  lister(
    codeMariage: string,
    recherche = '',
    tableId?: number
  ): Observable<Invite[]> {
    let params = new HttpParams();

    if (recherche.trim()) {
      params = params.set('recherche', recherche.trim());
    }

    if (tableId !== undefined) {
      params = params.set('tableId', tableId);
    }

    return this.http.get<Invite[]>(
      `${this.apiInvites}/mariage/${encodeURIComponent(codeMariage)}`,
      { params }
    );
  }

  creer(
    codeMariage: string,
    donnees: Invite
  ): Observable<InvitationCreee> {
    return this.http.post<InvitationCreee>(
      `${this.apiInvites}/mariage/${encodeURIComponent(codeMariage)}`,
      donnees
    );
  }

  modifier(id: number, donnees: Invite): Observable<Invite> {
    return this.http.put<Invite>(
      `${this.apiInvites}/${id}`,
      donnees
    );
  }

  supprimer(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiInvites}/${id}`
    );
  }

  listerTables(codeMariage: string): Observable<TableMariage[]> {
    return this.http.get<TableMariage[]>(
      `${this.apiTables}/${encodeURIComponent(codeMariage)}`
    );
  }

  affecterTable(
    inviteId: number,
    tableId: number
  ): Observable<Invite> {
    return this.http.put<Invite>(
      `${this.apiInvitations}/invite/${inviteId}/table/${tableId}`,
      {}
    );
  }



  obtenirLien(
  id: number
): Observable<{ codeInvitation: string; lienInvitation: string }> {
  return this.http.get<{
    codeInvitation: string;
    lienInvitation: string;
  }>(`${this.apiInvites}/${id}/lien`);
}
}
