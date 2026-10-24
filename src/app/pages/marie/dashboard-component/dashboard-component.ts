import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Mariage, MariageService } from '../../../services/mariage';

@Component({
  selector: 'app-dashboard-component',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './dashboard-component.html',
  styleUrl: './dashboard-component.css',
})
export class DashboardComponent implements OnInit {
  private mariageService = inject(MariageService);

  mariage: Mariage | null = null;
  formulaire: Partial<Mariage> = {};

  chargement = true;
  enregistrement = false;
  modeModification = false;

  messageErreur = '';
  messageSucces = '';

  // Les statistiques seront raccordées aux vraies données du backend.
  // On utilise null pour ne pas afficher de faux chiffres.
  statistiques = {
    totalInvites: null as number | null,
    invitationsAnnulees: null as number | null,
    presencesConfirmees: null as number | null,
    totalTables: null as number | null,
  };

  constructor(
    private cdr: ChangeDetectorRef) {

  }

  ngOnInit(): void {
    this.chargerMonMariage();
  }

  chargerMonMariage(): void {
    this.chargement = true;
    this.messageErreur = '';

    this.mariageService.getMonMariage().subscribe({
      next: (resultat) => {
        this.mariage = resultat;
        this.chargement = false;
        // Demander à Angular de mettre à jour le HTML
        this.cdr.detectChanges();
      },
      error: (erreur) => {
        if (erreur.status === 404) {
          this.messageErreur =
            erreur.error?.detail ||
            'Aucun mariage n’est associé à votre compte.  Veuillez contacter l’administrateur';
          this.chargement = false;
        } else {
          this.messageErreur = "Impossible de charger votre mariage. Veillez consulter l'administrateur.";
          this.chargement = false;
        }
      }
    });
  }

  ouvrirModification(): void {
    if (!this.mariage) {
      return;
    }

    // Copie des données pour ne pas modifier l'affichage avant la sauvegarde.
    this.formulaire = { ...this.mariage };
    this.messageErreur = '';
    this.messageSucces = '';
    this.modeModification = true;
  }

  annulerModification(): void {
    this.modeModification = false;
    this.formulaire = {};
    this.messageErreur = '';
  }

  enregistrerModifications(): void {
    if (!this.mariage?.id) {
      this.messageErreur = 'Impossible d’identifier le mariage à modifier.';
      return;
    }

    this.enregistrement = true;
    this.messageErreur = '';
    this.messageSucces = '';

    this.mariageService
      .modifierMariage(this.mariage.id, this.formulaire)
      .subscribe({
        next: (resultat) => {
          this.mariage = resultat;
          this.enregistrement = false;
          this.modeModification = false;
          
          alert('Les informations du mariage ont été mises à jour');
          this.annulerModification()
          this.messageSucces = 'Les informations du mariage ont été mises à jour.';
        },
        error: (erreur) => {
          console.error('Erreur de modification :', erreur);

          this.enregistrement = false;
          this.messageErreur =
            erreur.error?.message ??
            'La modification a échoué. Vérifiez les autorisations et les données envoyées.';
        }
      });
  }
}