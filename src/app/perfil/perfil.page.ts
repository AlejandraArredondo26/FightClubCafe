import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/interfaces/interfaces';
import { AuthService } from 'src/app/services/auth.service';
import { ToastController } from '@ionic/angular';

@Component({
  standalone:false,
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  usuario: Usuario | null = null;

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.cargarUsuario();
  }

  ionViewWillEnter() {
    this.cargarUsuario();
  }

  cargarUsuario() {
    const data = localStorage.getItem('usuario');
    this.usuario = data ? JSON.parse(data) : null;
  }

  // ----------------------------------------
  // TOAST ESTILIZADO
  // ----------------------------------------
  async showToast(message: string, color: string = 'success') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color,
      position: 'bottom',
      cssClass: 'perfil-toast'
    });
    toast.present();
  }

  // ----------------------------------------
  // GUARDAR CAMBIOS
  // ----------------------------------------
  async guardarCambios() {
    if (!this.usuario) return;

    const ok = await this.authService.actualizarUsuario(this.usuario.id, {
      nombre: this.usuario.nombre,
      correo: this.usuario.correo
    });

    if (ok) {
      // Guardar en localStorage
      localStorage.setItem('usuario', JSON.stringify(this.usuario));

      this.showToast('Cambios guardados correctamente', 'success');
    } else {
      this.showToast('Error al guardar los cambios', 'danger');
    }
  }

  // ----------------------------------------
  // LOGOUT
  // ----------------------------------------
  logout() {
    localStorage.removeItem('usuario');
    localStorage.removeItem('usuario_id');
    this.router.navigate(['/login'], { replaceUrl: true });
  }
}
