import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth-service';
import { ThemeService } from '../../../core/services/theme-service';

@Component({
  selector: 'app-login-component',
  imports: [    
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './login-component.html',
  styleUrl: './login-component.css',
})

export class LoginComponent {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);


  messageErreur = '';

   private themeService = inject(ThemeService);
  
    changerTheme(): void {
      this.themeService.changerTheme();
    }
  
    estSombre(): boolean {
      return this.themeService.estSombre();
    }
  

  

  loginForm = this.fb.group({

    email: [ '', [  Validators.required,  Validators.email] ],
    password: ['',[  Validators.required] ]

  });


  connexion(): void {

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }


    const email = this.loginForm.value.email!;
    const password = this.loginForm.value.password!;


    this.authService.login(email, password).subscribe({
        next: (reponse) => {
          this.authService.sauvegarderConnexion(reponse);

          if (reponse.role === 'ADMIN') {
            this.router.navigate([
              '/admin/dashboard'
            ]);
          }

          else if (reponse.role === 'MARIE') {
            this.router.navigate([
              '/marie/dashboard'
            ]);
          }
        },

        error: (error) => {
          console.error('Erreur connexion :', error);

          this.messageErreur =
            error?.error?.message
            || 'Email ou mot de passe incorrect.';
        }

      });
  }
}