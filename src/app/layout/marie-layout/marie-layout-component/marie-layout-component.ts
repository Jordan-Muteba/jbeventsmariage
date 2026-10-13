import {
  Component,
  HostListener,
  OnInit,
  inject
} from '@angular/core';

import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet
} from '@angular/router';

import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../core/services/theme-service';

@Component({
  selector: 'app-marie-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './marie-layout-component.html',
  styleUrl: './marie-layout-component.css',
})
export class MarieLayoutComponent implements OnInit {

  private router = inject(Router);

  protected themeService = inject(ThemeService);

  sidebarOuverte = false;

  ngOnInit(): void {
    this.adapterSidebar();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.adapterSidebar();
  }

  private adapterSidebar(): void {
    if (typeof window !== 'undefined') {
      this.sidebarOuverte = window.innerWidth >= 1024;
    }
  }

  toggleSidebar(): void {
    this.sidebarOuverte = !this.sidebarOuverte;
  }

  fermerSidebar(): void {
    this.sidebarOuverte = false;
  }

  fermerSidebarMobile(): void {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      this.sidebarOuverte = false;
    }
  }

  changerTheme(): void {
    this.themeService.changerTheme();
  }

  estSombre(): boolean {
    return this.themeService.estSombre();
  }

  deconnexion(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');

    this.router.navigate(['/login']);
  }
}