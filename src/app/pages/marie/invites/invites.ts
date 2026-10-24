import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Mariage, MariageService } from '../../../services/mariage';
import {
  InviteService,
  Invite,
  TableMariage,
  InvitationCreee,
  TypeInvitation
} from '../../../services/invite';

@Component({
  selector: 'app-invites',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './invites.html',
  styleUrl: './invites.css',
})
export class Invites implements OnInit {
  private readonly mariageService = inject(MariageService);
  private readonly inviteService = inject(InviteService);

  mariage: Mariage | null = null;
  codeMariage = '';

  invites: Invite[] = [];
  tables: TableMariage[] = [];

  recherche = '';
  chargement = true;
  enregistrement = false;

  afficherFormulaire = false;
  modeModification = false;

  inviteEnModification: Invite | null = null;

  messageErreur = '';
  messageSucces = '';

  lienCree = '';
  nomInviteCree = '';

  tableIdSelectionnee = '';

  formulaire: Invite = this.nouveauFormulaire();

  ngOnInit(): void {
    this.chargerMonMariage();
  }

  get totalPersonnes(): number {
  return this.invites.reduce(
    (total, invite) =>
      total + 1 + (invite.nombreAccompagnants || 0),
    0
  );
}

  private nouveauFormulaire(): Invite {
    return {
      nomComplet: '',
      telephone: '',
      nombreAccompagnants: 0,
      heureArriveePrevue: null,
      remarque: '',
      typeInvitation: 'INDIVIDUELLE',
      tableMariage: null
    };
  }

  chargerMonMariage(): void {
    this.chargement = true;
    this.messageErreur = '';

    this.mariageService.getMonMariage().subscribe({
      next: mariage => {
        this.mariage = mariage;
        this.codeMariage = mariage.codeInvitation ?? '';

        if (!this.codeMariage) {
          this.messageErreur =
            'Le code du mariage est introuvable. Veuillez contacter l’administrateur.';
          this.chargement = false;
          return;
        }

        this.chargerTables();
        this.chargerInvites();
      },
      error: erreur => {
        console.error('Erreur de chargement du mariage :', erreur);

        this.messageErreur =
          erreur.error?.message ??
          'Impossible de charger votre mariage. Vérifiez votre connexion et vos autorisations.';

        this.chargement = false;
      }
    });
  }

  chargerInvites(): void {
    if (!this.codeMariage) {
      return;
    }

    this.inviteService.lister(
      this.codeMariage,
      this.recherche
    ).subscribe({
      next: resultat => {
        this.invites = resultat ?? [];
        this.chargement = false;
      },
      error: erreur => {
        console.error('Erreur de chargement des invités :', erreur);

        this.messageErreur =
          erreur.error?.message ??
          'Impossible de charger la liste des invités.';

        this.chargement = false;
      }
    });
  }

  chargerTables(): void {
    if (!this.codeMariage) {
      return;
    }

    this.inviteService.listerTables(this.codeMariage).subscribe({
      next: resultat => {
        this.tables = resultat ?? [];
      },
      error: erreur => {
        console.error('Erreur de chargement des tables :', erreur);
        this.messageErreur =
          'Les invités pourront être gérés, mais le chargement des tables a échoué.';
      }
    });
  }

  rechercherInvites(): void {
    this.chargement = true;
    this.chargerInvites();
  }

  ouvrirCreation(): void {
    this.formulaire = this.nouveauFormulaire();
    this.tableIdSelectionnee = '';
    this.inviteEnModification = null;
    this.modeModification = false;
    this.afficherFormulaire = true;

    this.messageErreur = '';
    this.messageSucces = '';
    this.lienCree = '';
    this.nomInviteCree = '';
  }

  ouvrirModification(invite: Invite): void {
    this.formulaire = {
      ...invite,
      nombreAccompagnants: invite.nombreAccompagnants ?? 0,
      heureArriveePrevue: invite.heureArriveePrevue ?? null,
      remarque: invite.remarque ?? ''
    };

    this.inviteEnModification = invite;
    this.modeModification = true;
    this.afficherFormulaire = true;

    this.tableIdSelectionnee =
      invite.tableMariage?.id != null
        ? String(invite.tableMariage.id)
        : '';

    this.messageErreur = '';
    this.messageSucces = '';
    this.lienCree = '';
  }

  fermerFormulaire(): void {
    this.afficherFormulaire = false;
    this.inviteEnModification = null;
    this.messageErreur = '';
  }

  validerFormulaire(): boolean {
    const nom = this.formulaire.nomComplet.trim();
    const telephone = this.formulaire.telephone.trim();
    const accompagnants = Number(this.formulaire.nombreAccompagnants);

    if (!nom || !telephone) {
      this.messageErreur =
        'Le nom complet et le numéro de téléphone sont obligatoires.';
      return false;
    }

    if (!Number.isInteger(accompagnants) || accompagnants < 0) {
      this.messageErreur =
        'Le nombre d’accompagnants doit être un entier positif ou nul.';
      return false;
    }

    if (
      this.formulaire.typeInvitation === 'INDIVIDUELLE'
      && accompagnants !== 0
    ) {
      this.messageErreur =
        'Une invitation individuelle ne peut pas avoir d’accompagnant.';
      return false;
    }

    if (
      this.formulaire.typeInvitation === 'COUPLE'
      && accompagnants !== 1
    ) {
      this.messageErreur =
        'Une invitation couple doit avoir exactement un accompagnant.';
      return false;
    }

    if (
      this.formulaire.typeInvitation === 'FAMILIALE'
      && accompagnants < 1
    ) {
      this.messageErreur =
        'Une invitation familiale doit avoir au moins un accompagnant.';
      return false;
    }

    return true;
  }

  enregistrer(): void {
    this.messageErreur = '';
    this.messageSucces = '';
    this.lienCree = '';

    if (!this.validerFormulaire()) {
      return;
    }

    if (!this.codeMariage) {
      this.messageErreur = 'Le code du mariage est indisponible.';
      return;
    }

    this.enregistrement = true;

    const donnees: Invite = {
      ...this.formulaire,
      nomComplet: this.formulaire.nomComplet.trim(),
      telephone: this.formulaire.telephone.trim(),
      nombreAccompagnants: Number(
        this.formulaire.nombreAccompagnants
      ),
      remarque: this.formulaire.remarque?.trim() ?? ''
    };

    if (this.modeModification && this.inviteEnModification?.id) {
      this.modifierInvite(this.inviteEnModification.id, donnees);
    } else {
      this.creerInvite(donnees);
    }
  }

  private creerInvite(donnees: Invite): void {
    this.inviteService.creer(this.codeMariage, donnees).subscribe({
      next: resultat => {
        this.nomInviteCree = resultat.nomComplet;
        this.lienCree = resultat.lienInvitation;

        const tableId = Number(this.tableIdSelectionnee);

        if (this.tableIdSelectionnee && Number.isInteger(tableId)) {
          this.inviteService.affecterTable(resultat.id, tableId).subscribe({
            next: () => {
              this.finaliserCreation();
              this.messageSucces =
                'Invité créé et table affectée avec succès.';
            },
            error: erreur => {
              console.error('Erreur d’affectation de table :', erreur);

              this.finaliserCreation();

              this.messageErreur =
                this.extraireErreur(erreur) +
                ' L’invité a bien été créé : son lien personnalisé reste disponible.';
            }
          });
        } else {
          this.finaliserCreation();
          this.messageSucces =
            'Invité créé avec succès. Son lien personnalisé est prêt.';
        }
      },
      error: erreur => {
        console.error('Erreur de création de l’invité :', erreur);
        this.messageErreur = this.extraireErreur(erreur);
        this.enregistrement = false;
      }
    });
  }

  private finaliserCreation(): void {
    this.enregistrement = false;
    this.afficherFormulaire = false;
    this.chargerInvites();
  }

  private modifierInvite(id: number, donnees: Invite): void {
    this.inviteService.modifier(id, donnees).subscribe({
      next: inviteModifie => {
        const tableId = Number(this.tableIdSelectionnee);
        const ancienneTableId =
          this.inviteEnModification?.tableMariage?.id;

        // Une table sélectionnée différente entraîne une nouvelle affectation.
        // Une sélection vide ne retire pas une affectation existante.
        if (
          this.tableIdSelectionnee
          && Number.isInteger(tableId)
          && tableId !== ancienneTableId
        ) {
          this.inviteService.affecterTable(id, tableId).subscribe({
            next: () => {
              this.enregistrement = false;
              this.afficherFormulaire = false;
              this.messageSucces =
                'Invité modifié et table mise à jour avec succès.';
              this.chargerInvites();
            },
            error: erreur => {
              console.error('Erreur de changement de table :', erreur);

              this.enregistrement = false;
              this.afficherFormulaire = false;
              this.messageErreur =
                'Les informations de l’invité ont été modifiées, mais la table n’a pas été changée. ' +
                this.extraireErreur(erreur);

              this.chargerInvites();
            }
          });
        } else {
          this.enregistrement = false;
          this.afficherFormulaire = false;
          this.messageSucces = 'Invité modifié avec succès.';
          this.chargerInvites();
        }
      },
      error: erreur => {
        console.error('Erreur de modification :', erreur);
        this.messageErreur = this.extraireErreur(erreur);
        this.enregistrement = false;
      }
    });
  }

  supprimerInvite(invite: Invite): void {
    if (!invite.id) {
      return;
    }

    const confirmer = window.confirm(
      `Voulez-vous vraiment supprimer l’invitation de ${invite.nomComplet} ?`
    );

    if (!confirmer) {
      return;
    }

    this.messageErreur = '';
    this.messageSucces = '';

    this.inviteService.supprimer(invite.id).subscribe({
      next: () => {
        this.messageSucces =
          `L’invitation de ${invite.nomComplet} a été supprimée.`;
        this.chargerInvites();
      },
      error: erreur => {
        console.error('Erreur de suppression :', erreur);
        this.messageErreur = this.extraireErreur(erreur);
      }
    });
  }

  copierLien(lien: string): void {
    if (!lien) {
      return;
    }

    if (!navigator.clipboard) {
      this.messageErreur =
        'La copie automatique n’est pas disponible dans ce navigateur. Copiez le lien manuellement.';
      return;
    }

    navigator.clipboard.writeText(lien)
      .then(() => {
        this.messageSucces = 'Lien copié. Vous pouvez le partager.';
      })
      .catch(erreur => {
        console.error('Erreur de copie :', erreur);
        this.messageErreur =
          'Impossible de copier le lien. Essayez de le sélectionner manuellement.';
      });
  }

  partagerWhatsApp(lien: string, nom: string): void {
    const message =
      `Bonjour ${nom}, voici votre invitation personnalisée à notre mariage : ${lien}`;

    window.open(
      `https://wa.me/?text=${encodeURIComponent(message)}`,
      '_blank',
      'noopener,noreferrer'
    );
  }

  nomTable(invite: Invite): string {
    return invite.tableMariage?.nom ?? 'Non affectée';
  }

  libelleType(type: TypeInvitation): string {
    switch (type) {
      case 'INDIVIDUELLE':
        return 'Individuelle';
      case 'COUPLE':
        return 'Couple';
      case 'FAMILIALE':
        return 'Familiale';
    }
  }


  chargerLienInvite(invite: Invite): void {
  if (!invite.id) {
    return;
  }

  this.messageErreur = '';
  this.messageSucces = '';

  this.inviteService.obtenirLien(invite.id).subscribe({
    next: resultat => {
      this.nomInviteCree = invite.nomComplet;
      this.lienCree = resultat.lienInvitation;
    },
    error: erreur => {
      console.error('Erreur de récupération du lien :', erreur);
      this.messageErreur = this.extraireErreur(erreur);
    }
  });
}

  private extraireErreur(erreur: any): string {
    return erreur.error?.detail
      ?? erreur.error?.message
      ?? (typeof erreur.error === 'string' ? erreur.error : null)
      ?? 'Une erreur est survenue. Vérifiez les données et les autorisations.';
  }
}