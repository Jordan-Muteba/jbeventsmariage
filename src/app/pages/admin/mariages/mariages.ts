
import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Mariage, MariageService, Utilisateur } from '../../../services/mariage';

@Component({
  selector: 'app-mariages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mariages.html'
})
export class MariagesComponent implements OnInit {

  mariages: Mariage[] = [];
  utilisateursMarie: Utilisateur[] = [];

  chargement = false;
  enregistrement = false;

  afficherFormulaire = false;
  afficherAssociation = false;
  afficherDetails = false;
modeModification = false;

  message = '';
  typeMessage: 'succes' | 'erreur' = 'succes';

  mariageSelectionne: Mariage | null = null;

  formulaire = this.nouveauMariage();

  association = {
    mariageId: 0,
    utilisateurMarieId: 0,
    utilisateurMarieeId: 0
  };

  constructor(private mariageService: MariageService,
    
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.chargerDonnees();
  }

  nouveauMariage() {
    return {
      nomMarie: '',
      nomMariee: '',
      description: '',
      dateMariage: '',
      heureMariage: '',
      lieu: '',
      adresse: '',
      photoPrincipale: '',
      video: ''
    };
  }

  chargerDonnees(): void {
    this.chargement = true;

    this.mariageService.getUtilisateurs().subscribe({
      next: (utilisateurs) => {
        this.utilisateursMarie = utilisateurs.filter(
          u => u.role === 'MARIE' && u.actif
        );

        this.chargerMariages();

        // Demander à Angular de mettre à jour le HTML
        this.cdr.detectChanges();
      },
      error: (erreur) => {
        console.error('Erreur de chargement des utilisateurs :', erreur);
        this.chargement = false;
        this.afficherMessage(
          'Impossible de charger les comptes. Vérifie la connexion et les droits administrateur.',
          'erreur'
        );
      }
    });
  }

  chargerMariages(): void {
    this.mariageService.getMariages().subscribe({
      next: (donnees) => {
        this.mariages = donnees;
        this.chargement = false;
        
        // Demander à Angular de mettre à jour le HTML
        this.cdr.detectChanges();
      },
      error: (erreur) => {
        console.error('Erreur de chargement des mariages :', erreur);
        this.chargement = false;
        this.afficherMessage(
          'Impossible de charger les mariages.',
          'erreur'
        );
      }
    });
  }

ouvrirCreation(): void {
  this.formulaire = this.nouveauMariage();
  this.modeModification = false;
  this.mariageSelectionne = null;
  this.afficherFormulaire = true;
  this.afficherDetails = false;
  this.afficherAssociation = false;
  this.message = '';
}


fermerCreation(): void {
  this.afficherFormulaire = false;
  this.modeModification = false;
  this.mariageSelectionne = null;
}

  creerMariage(): void {
    if (
      !this.formulaire.nomMarie.trim() ||
      !this.formulaire.nomMariee.trim()
    ) {
      this.afficherMessage(
        'Veuillez renseigner le nom du marié et celui de la mariée.',
        'erreur'
      );
      return;
    }

    this.enregistrement = true;
    this.message = '';

    this.mariageService.creerMariage(this.formulaire).subscribe({
      next: (mariage) => {
        this.enregistrement = false;
        this.afficherFormulaire = false;
        this.formulaire = this.nouveauMariage();

        this.afficherMessage(
          `Le mariage a été créé avec succès. Identifiant : ${mariage.id}.`,
          'succes'
        );

        this.chargerMariages();
      },
      error: (erreur) => {
        console.error('Erreur de création du mariage :', erreur);
        this.enregistrement = false;

        this.afficherMessage(
          erreur.error?.message || 'La création du mariage a échoué.',
          'erreur'
        );
      }
    });
  }

  ouvrirAssociation(mariage: Mariage): void {
    this.mariageSelectionne = mariage;

    this.association = {
      mariageId: mariage.id,
      utilisateurMarieId: mariage.utilisateurMarie?.id ?? 0,
      utilisateurMarieeId: mariage.utilisateurMariee?.id ?? 0
    };

    this.afficherAssociation = true;
    this.afficherFormulaire = false;
    this.message = '';
  }

  fermerAssociation(): void {
    this.afficherAssociation = false;
    this.mariageSelectionne = null;
  }

  associerCouple(): void {
    const {
      mariageId,
      utilisateurMarieId,
      utilisateurMarieeId
    } = this.association;

    if (!utilisateurMarieId || !utilisateurMarieeId) {
      this.afficherMessage(
        'Sélectionnez le compte du marié et celui de la mariée.',
        'erreur'
      );
      return;
    }

    if (utilisateurMarieId === utilisateurMarieeId) {
      this.afficherMessage(
        'Les deux personnes doivent avoir des comptes différents.',
        'erreur'
      );
      return;
    }

    this.enregistrement = true;
    this.message = '';

    this.mariageService.associerComptes(
      mariageId,
      utilisateurMarieId,
      utilisateurMarieeId
    ).subscribe({
      next: () => {
        this.enregistrement = false;
        this.afficherAssociation = false;
        this.mariageSelectionne = null;

        this.afficherMessage(
          'Les deux comptes sont maintenant associés au même mariage.',
          'succes'
        );

        this.chargerDonnees();
      },
      error: (erreur) => {
        console.error('Erreur d’association :', erreur);
        this.enregistrement = false;

        this.afficherMessage(
          erreur.error?.message ||
          erreur.error?.detail ||
          'Association impossible. Vérifiez les comptes sélectionnés.',
          'erreur'
        );
      }
    });
  }

  nomUtilisateur(id: number | undefined): string {
    if (id == null) {
      return 'Non associé';
    }

    const utilisateur = this.utilisateursMarie.find(u => u.id === id);

    return utilisateur
      ? `${utilisateur.prenom} ${utilisateur.nom}`
      : 'Non associé';
  }

  
compterCouplesAssocies(): number {
  return this.mariages.filter(
    mariage => !!mariage.utilisateurMarie && !!mariage.utilisateurMariee
  ).length;
}




// Afficher le détail d'un mariage
ouvrirDetails(mariage: Mariage): void {
  this.mariageSelectionne = mariage;
  this.afficherDetails = true;
  this.afficherFormulaire = false;
  this.afficherAssociation = false;
  this.message = '';
}

// Fermer la fenêtre de détail
fermerDetails(): void {
  this.afficherDetails = false;
  this.mariageSelectionne = null;
}

// Ouvrir le formulaire de modification
ouvrirModification(mariage: Mariage): void {
  this.mariageSelectionne = mariage;

  this.formulaire = {
    nomMarie: mariage.nomMarie ?? '',
    nomMariee: mariage.nomMariee ?? '',
    description: mariage.description ?? '',
    dateMariage: mariage.dateMariage ?? '',
    heureMariage: mariage.heureMariage ?? '',
    lieu: mariage.lieu ?? '',
    adresse: mariage.adresse ?? '',
    photoPrincipale: mariage.photoPrincipale ?? '',
    video: mariage.video ?? ''
  };

  this.modeModification = true;
  this.afficherFormulaire = true;
  this.afficherDetails = false;
  this.afficherAssociation = false;
  this.message = '';
}


// Enregistrer une création ou une modification
enregistrerMariage(): void {
  if (
    !this.formulaire.nomMarie.trim() ||
    !this.formulaire.nomMariee.trim()
  ) {
    this.afficherMessage(
      'Veuillez renseigner le nom du marié et celui de la mariée.',
      'erreur'
    );
    return;
  }

  // Si nous sommes en mode modification
  if (this.modeModification && this.mariageSelectionne) {
    this.enregistrement = true;
    this.message = '';

    this.mariageService.modifierMariage(
      this.mariageSelectionne.id,
      this.formulaire
    ).subscribe({
      next: () => {
        this.enregistrement = false;
        this.afficherFormulaire = false;
        this.modeModification = false;
        this.mariageSelectionne = null;

        this.afficherMessage(
          'Les modifications du mariage ont été enregistrées.',
          'succes'
        );
        alert('Les modifications du mariage ont été enregistrées.'+
          'succes')

        this.chargerMariages();
      },
      error: (erreur) => {
        console.error('Erreur de modification du mariage :', erreur);
        this.enregistrement = false;

        this.afficherMessage(
          erreur.error?.message ||
          erreur.error?.detail ||
          'Impossible de modifier ce mariage.',
          'erreur'
        );
      }
    });

    return;
  }

  // Sinon, créer un nouveau mariage
  this.creerMariage();
  alert('le mariage a été crée avec succès !')
  
        this.chargerMariages();
}







  afficherMessage(
    texte: string,
    type: 'succes' | 'erreur'
  ): void {
    this.message = texte;
    this.typeMessage = type;
  }
}