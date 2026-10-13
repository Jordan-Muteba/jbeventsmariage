
import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ThemeService } from '../../../core/services/theme-service';

// Interface d'une boisson
interface BoissonAffichee {
  id: number;
  libelle: string;
  description: string;
  logo: string;
}

// Interface d'un message du livre d'or
interface MessageLivreOr {
  id: number;
  nom: string;
  texte: string;
}

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './accueil.html',
  styleUrl: './accueil.css',
})
export class Accueil implements OnInit, OnDestroy {

  codeInvitation = '';

  private interval: ReturnType<typeof setInterval> | undefined;

  invitation = {
    invite: {
      nomComplet: 'Richard KAMBALA'
    },

    mariage: {
      nomMarie: 'Jordan',
      nomMariee: 'Grâce',
      dateMariage: '24 Juin 2027',
      dateTechnique: '2027-06-24T15:00:00',
      heureMariage: '15:00',
      lieu: 'Pullman Kinshasa',
      adresse: 'Kinshasa, République Démocratique du Congo',

      description:
        'Deux histoires, deux chemins et désormais une seule histoire à écrire ensemble.',

      hero: 'images/accueil/hero12.jpg',
      save: 'images/accueil/saveSansFond2.png',
      ligne: 'images/accueil/ligne.png',
      qr: 'images/accueil/qr.jpg',
      histoire: 'images/histoire.jpg',
      ceremonie: 'images/ceremonie.jpg',
      reception: 'images/reception.jpg',
      livre: 'images/livre1.jpg',
      logo: 'images/accueil/logo3.png',
      // logo: 'images/accueil/logo2.jpeg',


      galerie: [
        'images/galerie-1.jpg',
        'images/galerie-2.jpg',
        'images/galerie-3.jpg',
        'images/galerie-4.jpg'
      ],
    }
  };

  compteARebours = {
    jours: 0,
    heures: 0,
    minutes: 0,
    secondes: 0
  };

  // =========================
  // BOISSONS
  // =========================

  boissons: BoissonAffichee[] = [

    {
      id: 1,
      libelle: 'Castel',
      description: 'Boisson fraîche',
      logo: 'images/boissons/castel.png'
    },
    {
      id: 2,
      libelle: 'Beaufort',
      description: 'Pour votre célébration',
      logo: 'images/boissons/beaufort-1.jpg'
    },
    {
      id: 3,
      libelle: 'Nkoyi & Likofi',
      description: 'À partager',
      logo: 'images/boissons/nkoyi.png',
    },
    {
      id: 4,
      libelle: 'Tembo',
      description: 'Une autre saveur',
      logo: 'images/boissons/TEMBO.png '
    },
    {
      id: 5,
      libelle: 'Turbo King ',
      description: 'Une autre saveur',
      logo: 'images/boissons/Turbo_King.jpg '
    },
    {
      id: 6,
      libelle: 'Heineken ',
      description: 'Une autre saveur',
      logo: 'images/boissons/heineken.png '
    },
    {
      id: 7,
      libelle: 'Du Vin',
      description: 'Une autre saveur',
      logo: 'images/boissons/vin.jpg'
    },
    {
      id: 8,
      libelle: 'Coca ',
      description: 'Une autre saveur',
      logo: 'images/boissons/coca.jpg'
    },
    {
      id: 9,
      libelle: 'Fanta ',
      description: 'Une autre saveur',
      logo: 'images/boissons/fanta.jpg '
    },
    {
      id: 10,
      libelle: 'Maltina',
      description: 'Une autre saveur',
      logo: 'images/boissons/maltina.jpg '
    },
  ];

  boissonsSelectionnees: number[] = [];
  messageBoissons = '';

  // =========================
  // LIVRE D'OR
  // =========================

  nouveauMessage = {
    nom: '',
    texte: ''
  };

  messagesLivreOr: MessageLivreOr[] = [];

  messageLivreOr = '';














  private themeInitial!: boolean;















  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private themeService: ThemeService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.codeInvitation =
        params.get('codeInvitation') || '';

      console.log( 'Code invitation :',  this.codeInvitation );
    });

     // Mémoriser le thème avant le forçage
    this.themeInitial = this.themeService.estSombre();

    // Forcer temporairement le thème noir
    if (!this.themeInitial) {
      this.themeService.changerTheme();
    }


    this.demarrerCompteARebours();
  }

  ngOnDestroy(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }

        // Restaurer le thème initial à la sortie de la page
    const themeActuel = this.themeService.estSombre();

    if (themeActuel !== this.themeInitial) {
      this.themeService.changerTheme();
    }

  }

  pageLogin() {
    this.router.navigate([
      '/login'
    ]);
  }

  // =========================
  // COMPTE À REBOURS
  // =========================

  private demarrerCompteARebours(): void {
    this.calculerCompteARebours();

    this.interval = setInterval(() => {
      this.calculerCompteARebours();
    }, 1000);
  }

  private calculerCompteARebours(): void {
    const maintenant = new Date().getTime();

    const dateMariage = new Date(
      this.invitation.mariage.dateTechnique
    ).getTime();

    const difference = dateMariage - maintenant;

    if (difference <= 0) {
      this.compteARebours = {
        jours: 0,
        heures: 0,
        minutes: 0,
        secondes: 0
      };

      return;
    }

    this.compteARebours.jours = Math.floor(
      difference / (1000 * 60 * 60 * 24)
    );

    this.compteARebours.heures = Math.floor(
      (difference / (1000 * 60 * 60)) % 24
    );

    this.compteARebours.minutes = Math.floor(
      (difference / (1000 * 60)) % 60
    );

    this.compteARebours.secondes = Math.floor(
      (difference / 1000) % 60
    );
  }

  // =========================
  // NAVIGATION ET CARTE
  // =========================

  confirmerPresence(): void {
    this.router.navigate([
      '/invitation',
      this.codeInvitation,
      'confirmation'
    ]);
  }

  ouvrirCarte(): void {
    const adresse = encodeURIComponent(
      this.invitation.mariage.adresse
    );

    window.open(
      `https://www.google.com/maps/search/?api=1&query=${adresse}`,
      '_blank'
    );
  }

  faireDefiler(id: string): void {
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth'
    });
  }

  // =========================
  // GESTION DES BOISSONS
  // =========================

  estSelectionnee(id: number): boolean {
    return this.boissonsSelectionnees.includes(id);
  }

  selectionnerBoisson(id: number): void {
    this.messageBoissons = '';

    if (this.estSelectionnee(id)) {
      this.boissonsSelectionnees =
        this.boissonsSelectionnees.filter(
          boissonId => boissonId !== id
        );

      return;
    }

    if (this.boissonsSelectionnees.length >= 2) {
      this.messageBoissons =
        'Vous pouvez choisir au maximum deux bouteilles.';

      return;
    }

    this.boissonsSelectionnees = [
      ...this.boissonsSelectionnees,
      id
    ];
  }

  enregistrerBoissons(): void {
    if (this.boissonsSelectionnees.length === 0) {
      this.messageBoissons =
        'Veuillez choisir au moins une bouteille.';

      return;
    }

    // L'appel au backend Spring Boot sera ajouté ensuite.
    this.messageBoissons =
      'Votre sélection est prête à être enregistrée.';
  }

  // =========================
  // LIVRE D'OR
  // =========================

  publierMessage(event: Event): void {
    event.preventDefault();

    const nom = this.nouveauMessage.nom.trim();
    const texte = this.nouveauMessage.texte.trim();

    if (!nom || !texte) {
      this.messageLivreOr =
        'Veuillez remplir votre nom et votre message.';

      return;
    }

    // Affichage local temporaire.
    // Les messages seront ensuite enregistrés dans MySQL.
    const message: MessageLivreOr = {
      id: Date.now(),
      nom,
      texte
    };

    this.messagesLivreOr = [
      message,
      ...this.messagesLivreOr
    ];

    this.nouveauMessage = {
      nom: '',
      texte: ''
    };

    this.messageLivreOr =
      'Merci pour votre gentil message !';
  }
}