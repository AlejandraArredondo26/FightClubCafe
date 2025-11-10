import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

interface Elemento {
  icono: string;
  nombre: string;
  ruta: string;
}

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  elementos: Elemento[] = [
    { icono: 'home-outline', nombre: 'Inicio', ruta: '/inicio' },
    { icono: 'chatbubbles-outline', nombre: 'Foro', ruta: '/foro' },
    { icono: 'images-outline', nombre: 'Galería', ruta: '/galeria' },
    { icono: 'search-outline', nombre: 'Buscar', ruta: '/buscar' },
  ];

  disableMenu = false;

  constructor(private router: Router) {
    this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
        const url = ev.urlAfterRedirects || ev.url;
        this.disableMenu = url.includes('/login');
      }
    });
  }
}
