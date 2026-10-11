import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ThemeService } from '../../../core/services/theme-service';

@Component({
  selector: 'app-admin-layout-component',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './admin-layout-component.html',
  styleUrl: './admin-layout-component.css',
})
export class AdminLayoutComponent {

  private router = inject(Router);
  protected themeService = inject(ThemeService);

  sidebarOuverte = true;

  changerTheme(): void {
    this.themeService.changerTheme();
  }

  estSombre(): boolean {
    return this.themeService.estSombre();
  }

  toggleSidebar(): void {
    this.sidebarOuverte = !this.sidebarOuverte;
  }

  deconnexion(): void {

    localStorage.removeItem('token');
    localStorage.removeItem('role');

    this.router.navigate(['/login']);
  }
}