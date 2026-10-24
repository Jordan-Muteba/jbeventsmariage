
import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { BACKEND_URL } from '../../../api-config';

interface Utilisateur {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: 'ADMIN' | 'MARIE' | 'CONTROLEUR' | 'RESTAURATION';
  actif: boolean;
  dateCreation?: string;
  dateModification?: string;
}

interface FormulaireUtilisateur {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  role: Utilisateur['role'];
  actif: boolean;
}

@Component({
  selector: 'app-utilisateurs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './utilisateurs.html'
})
export class UtilisateursComponent implements OnInit {

  private readonly apiUrl = `${BACKEND_URL}/api/utilisateurs`;

  utilisateurs: Utilisateur[] = [];
  recherche = '';
  filtreRole = '';
  filtreStatut = '';

  chargement = false;
  enregistrement = false;
  modalOuverte = false;
  modeModification = false;

  utilisateurSelectionne: Utilisateur | null = null;
  message = '';
  typeMessage: 'succes' | 'erreur' = 'succes';
  messageModalErreur = '';
  messageModalSucces = '';

  formulaire: FormulaireUtilisateur = this.nouveauFormulaire();

  constructor(private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    console.log('Initialisation du composant utilisateurs');
    this.chargerUtilisateurs();

    // this.chargerUtilisateurs();
  }

  nouveauFormulaire(): FormulaireUtilisateur {
    return {
      nom: '',
      prenom: '',
      email: '',
      password: '',
      role: 'MARIE',
      actif: true
    };
  }

  // chargerUtilisateurs(): void {
  //   this.chargement = true;

  //   // this.http.get<Utilisateur[]>(this.apiUrl).subscribe({
  //   this.http.get<Utilisateur[]>(this.apiUrl).subscribe({
  //     next: (donnees) => {
  //       this.utilisateurs = donnees;
  //       this.chargement = false;
  //     },
  //     error: (erreur) => {
  //       console.error('Erreur de chargement :', erreur);
  //       this.afficherMessage(
  //         'Impossible de charger les utilisateurs. Vérifie le JWT et les droits ADMIN.',
  //         'erreur'
  //       );
  //       this.chargement = false;
  //     }
  //   });
  // }
  chargerUtilisateurs(): void {
    this.chargement = true;

    this.http.get<Utilisateur[]>(this.apiUrl).subscribe({
      next: (donnees) => {
        this.utilisateurs = [...donnees];
        this.chargement = false;

        console.log('Utilisateurs chargés :', this.utilisateurs);
        // Demander à Angular de mettre à jour le HTML
        this.cdr.detectChanges();
      },
      error: (erreur) => {
        console.error('Erreur de chargement :', erreur);
        this.chargement = false;

        this.afficherMessage(
          'Impossible de charger les utilisateurs. Vérifie le JWT et les droits ADMIN.',
          'erreur'
        );
      }
    });
  }



  get utilisateursFiltres(): Utilisateur[] {
    const terme = this.recherche.trim().toLowerCase();

    return this.utilisateurs.filter((u) => {
      const correspondRecherche =
        !terme ||
        `${u.nom} ${u.prenom}`.toLowerCase().includes(terme) ||
        u.email.toLowerCase().includes(terme);

      const correspondRole =
        !this.filtreRole || u.role === this.filtreRole;

      const correspondStatut =
        !this.filtreStatut ||
        (this.filtreStatut === 'actif' && u.actif) ||
        (this.filtreStatut === 'inactif' && !u.actif);

      return correspondRecherche && correspondRole && correspondStatut;
    });
  }

  get nombreActifs(): number {
    return this.utilisateurs.filter(u => u.actif).length;
  }

  get nombreInactifs(): number {
    return this.utilisateurs.filter(u => !u.actif).length;
  }

  get nombreAdmins(): number {
    return this.utilisateurs.filter(u => u.role === 'ADMIN').length;
  }

  ouvrirCreation(): void {
    this.modeModification = false;
    this.utilisateurSelectionne = null;
    this.formulaire = this.nouveauFormulaire();
    this.modalOuverte = true;
  }

  ouvrirModification(u: Utilisateur): void {
    this.modeModification = true;
    this.utilisateurSelectionne = u;

    this.formulaire = {
      nom: u.nom,
      prenom: u.prenom,
      email: u.email,
      password: '',
      role: u.role,
      actif: u.actif
    };

    this.modalOuverte = true;
  }

  fermerModal(): void {
    this.modalOuverte = false;
    this.utilisateurSelectionne = null;
    this.formulaire = this.nouveauFormulaire();
  }

  enregistrerUtilisateur(): void {

    if (
      !this.formulaire.nom.trim() ||
      !this.formulaire.prenom.trim() ||
      !this.formulaire.email.trim()
    ) {
      this.afficherMessage(
        'Le nom, le prénom et l’email sont obligatoires.',
        'erreur'
      );
      return;
    }

    if (!this.modeModification && this.formulaire.password.length < 6) {
      this.afficherMessage(
        'Le mot de passe doit contenir au moins 6 caractères.',
        'erreur'
      );
      return;
    }

    this.enregistrement = true;

    const donnees: Record<string, unknown> = {
      nom: this.formulaire.nom.trim(),
      prenom: this.formulaire.prenom.trim(),
      email: this.formulaire.email.trim(),
      role: this.formulaire.role,
      actif: this.formulaire.actif
    };

    if (this.formulaire.password.trim()) {
      donnees['password'] = this.formulaire.password;
    }

    const requete = this.modeModification && this.utilisateurSelectionne
      ? this.http.put(
        `${this.apiUrl}/${this.utilisateurSelectionne.id}`,
        donnees
      )
      : this.http.post(this.apiUrl, donnees);

    requete.subscribe({
      next: () => {
        this.enregistrement = false;
        this.fermerModal();
        this.afficherMessage(
          this.modeModification
            ? 'Utilisateur modifié avec succès.'
            : 'Utilisateur créé avec succès.',
          'succes'
        );
        this.modeModification ? alert(
          'Utilisateur modifié avec succès.')
          : ('Utilisateur créé avec succès.' +
            'succes'
          )
        this.fermerModal();
        this.chargerUtilisateurs();
      },
      error: (erreur) => {
        console.error('Erreur d’enregistrement :', erreur);
        this.enregistrement = false;

        this.afficherMessage(
          erreur.error?.message ||
          'Échec de l’enregistrement. Vérifie les données et les droits ADMIN.',
          'erreur'
        );
      }
    });
  }

  changerStatut(u: Utilisateur): void {
    const nouvelEtat = !u.actif;

    this.http.patch(
      `${this.apiUrl}/${u.id}/actif`,
      { actif: nouvelEtat }
    ).subscribe({
      next: () => {
        this.afficherMessage(
          nouvelEtat ? 'Compte activé.' : 'Compte désactivé.',
          'succes'
        );
        this.chargerUtilisateurs();
      },
      error: (erreur) => {
        console.error('Erreur de changement de statut :', erreur);
        this.afficherMessage(
          'Impossible de modifier le statut du compte.',
          'erreur'
        );
      }
    });
  }

  supprimerUtilisateur(u: Utilisateur): void {
    const confirmation = window.confirm(
      `Veux-tu vraiment supprimer ${u.prenom} ${u.nom} ?`
    );

    if (!confirmation) {
      return;
    }

    this.http.delete(`${this.apiUrl}/${u.id}`).subscribe({
      next: () => {
        this.afficherMessage('Utilisateur supprimé.', 'succes');
        this.chargerUtilisateurs();
      },
      error: (erreur) => {
        console.error('Erreur de suppression :', erreur);
        this.afficherMessage(
          'Suppression impossible. Cet utilisateur possède peut-être des données associées.',
          'erreur'
        );
      }
    });
  }

  initiales(u: Utilisateur): string {
    return `${u.prenom?.charAt(0) ?? ''}${u.nom?.charAt(0) ?? ''}`
      .toUpperCase();
  }

  afficherMessage(
    texte: string,
    type: 'succes' | 'erreur'
  ): void {
    this.message = texte;
    this.typeMessage = type;
  }
}
