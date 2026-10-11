import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private readonly cleTheme = 'theme';

  private readonly platformId = inject(PLATFORM_ID);

  constructor() {
    this.chargerTheme();
  }

  changerTheme(): void {

    // On vérifie que nous sommes dans le navigateur
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const html = document.documentElement;

    if (html.classList.contains('dark')) {

      html.classList.remove('dark');

      localStorage.setItem(this.cleTheme, 'light');

    } else {

      html.classList.add('dark');

      localStorage.setItem(this.cleTheme, 'dark');
    }
  }

  estSombre(): boolean {

    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }

    return document.documentElement.classList.contains('dark');
  }

  chargerTheme(): void {

    // localStorage et document n'existent que dans le navigateur
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const theme = localStorage.getItem(this.cleTheme);

    if (theme === 'dark') {

      document.documentElement.classList.add('dark');

    } else {

      document.documentElement.classList.remove('dark');
    }
  }
}