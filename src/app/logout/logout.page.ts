import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-logout',
  templateUrl: './logout.page.html',
  styleUrls: ['./logout.page.scss'],
})
export class LogoutPage {

  constructor(private router: Router) {
    this.cerrarSesion();
  }

  cerrarSesion() {
    // Quitar todos los datos del usuario guardados en localStorage
    localStorage.removeItem('usuario_id');
    localStorage.removeItem('usuario_nombre');
    localStorage.removeItem('usuario_correo');

    // Redirigir a login y reemplazar historial
    this.router.navigate(['/login'], { replaceUrl: true });
  }
}
