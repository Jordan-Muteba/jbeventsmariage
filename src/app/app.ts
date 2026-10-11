import { Component, signal, inject} from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ThemeService } from './core/services/theme-service';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontendInvitation');

    private themeService = inject(ThemeService);

  changerTheme(): void {
    this.themeService.changerTheme();
  }

  estSombre(): boolean {
    return this.themeService.estSombre();
  }
}
