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

    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]

  });


  connexion(): void {

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }


    const email = this.loginForm.value.email!;
    const password = this.loginForm.value.password!;

    // console.log('votre email est :', email, "et votre mot de passe est: ", password)
    // if ( email=== "jo1@gmail.com" && password ==="1111" ) {
    //   this.router.navigate([ '/admin/dashboard'])

    // } if ( email=== "jordan@gmail.com" && password ==="1111" ) {
    //   this.router.navigate([ '/marie/dashboard'])

    // } else {this.messageErreur =
    //          'Email ou mot de passe incorrect.';


    this.authService.login(email, password).subscribe({
      next: (reponse) => {
         console.log('Connexion réussie');
    console.log('Rôle reçu :', reponse.role);
    console.log('Jeton reçu :', !!reponse.token);
        // Enregistrer le JWT et les informations renvoyées par Spring Boot.
        this.authService.sauvegarderConnexion(reponse);

        // Redirection en fonction du rôle fourni par le backend.
        if (reponse.role === 'ADMIN') {
          this.router.navigate(['/admin/dashboard']);
        } else if (reponse.role === 'MARIE') {
          this.router.navigate(['/marie/dashboard']);
        } else {
          this.authService.logout();
          this.messageErreur =
            'Ce rôle ne possède pas encore de page de connexion autorisée.';
        }
      },

      error: (erreur) => {
        console.error('Erreur de connexion :', erreur);

        this.messageErreur =
          erreur?.error?.message ||
          'Email ou mot de passe incorrect, ou compte désactivé.';
      }
    });

  }
}