import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false
})
export class HeaderComponent {
  @Input() titulo: string = '';

  constructor(private router: Router) {}

  abrirPerfil() {
    const userId = localStorage.getItem('usuario_id');

    if (userId) {
      this.router.navigate(['/perfil']);  // Usuario logueado
    } else {
      this.router.navigate(['/login']);   // Usuario NO logueado
    }
  }
}
