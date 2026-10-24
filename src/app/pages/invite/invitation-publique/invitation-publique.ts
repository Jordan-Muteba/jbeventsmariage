import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InvitationPublique, InvitationService } from '../../../services/invitation-publique';


@Component({
  selector: 'app-invitation-publique',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './invitation-publique.html',
  styleUrl: './invitation-publique.css'
})
export class InvitationPubliqueComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private invitationService = inject(InvitationService);
  private cdr = inject(ChangeDetectorRef);

  invitation: InvitationPublique | null = null;
  chargement = true;
  erreur = '';

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const code = params.get('code');

      if (!code) {
        this.erreur = 'Le lien de votre invitation est invalide.';
        this.chargement = false;
        return;
      }

      this.chargerInvitation(code);
    });
  }

  chargerInvitation(code: string): void {
    this.chargement = true;
    this.erreur = '';
    this.invitation = null;

    this.invitationService.obtenirInvitationPublique(code).subscribe({
      next: (donnees) => {
        console.log('Invitation récupérée :', donnees);
        this.invitation = donnees;
        this.chargement = false;
          this.cdr.detectChanges();

        console.log('chargement terminé:', this.chargement);
        
      },

      error: (err) => {
        console.error('Erreur HTTP :', err);

        console.error('Erreur de chargement :', err);

        this.erreur =
          err.status === 404
            ? 'Cette invitation est introuvable ou le lien est invalide.'
            : 'Impossible de charger votre invitation. Veuillez réessayer plus tard.';

        this.chargement = false;
        this.cdr.detectChanges();
      },

       complete: () => {
    console.log('Requête HTTP terminée.');
  }
    });
  }
}
