import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`,
  styles: [`
        :host {
            display: block;
            min-height: 100vh;
            min-width: 100vh;
            background: #0d1117;
        }    
    `]
})
export class App {}
