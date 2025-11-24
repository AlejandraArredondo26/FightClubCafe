import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MenuController } from '@ionic/angular';

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
  elementosBase: Elemento[] = [
    { icono: 'home-outline', nombre: 'Inicio', ruta: '/inicio' },
    { icono: 'chatbubbles-outline', nombre: 'Foro', ruta: '/foro' },
    { icono: 'images-outline', nombre: 'Galería', ruta: '/galeria' },
    { icono: 'person-outline', nombre: 'Nosotros', ruta: '/nosotros' },
  ];

  elementos: Elemento[] = [];
  disableMenu = false;
  usuarioActual: any = null;

  constructor(
    private router: Router,
    private menu: MenuController
  ) {
    this.cargarUsuario();

    this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
        const url = ev.urlAfterRedirects || ev.url;

        // Ocultar el menú si estamos en login
        this.disableMenu = url.includes('/login');

        // 🔥 Cerrar el menú cuando se navega
        this.menu.close('main-menu');

        this.cargarUsuario();
      }
    });
  }

  cargarUsuario() {
    const userId = localStorage.getItem('usuario_id');

    this.usuarioActual = userId ? { id: userId } : null;

    this.elementos = [...this.elementosBase];

    if (!this.usuarioActual) {
      this.elementos.push({
        icono: 'log-in-outline',
        nombre: 'Login',
        ruta: '/login',
      });
    } else {
      this.elementos.push(
        {
          icono: 'person-circle-outline',
          nombre: 'Mi Perfil',
          ruta: '/perfil',
        },
        {
          icono: 'log-out-outline',
          nombre: 'Salir',
          ruta: '/logout',
        }
      );
    }
  }
}
