import {
  Component
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ToastController } from '@ionic/angular';
import { Usuario } from 'src/app/interfaces/interfaces';

@Component({
  standalone: false,
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage {

  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: AuthService,
    private toastCtrl: ToastController
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  // ----------------------------------------------------
  // LOGIN
  // ----------------------------------------------------
  async onLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const email: string = this.loginForm.get('email')?.value;
    const password: string = this.loginForm.get('password')?.value;

    let user: Usuario | null = null;

    try {
      user = await this.auth.login(email, password);
    } catch (e) {
      console.error(e);
      this.showToast('Error al intentar iniciar sesión');
      return;
    }

    if (!user) {
      this.showToast('Correo o contraseña incorrectos');
      return;
    }

    console.log('Usuario logueado:', user);

    // ------------------------------------------------------------------
    // 🔥🔥 GUARDAR EL USUARIO EN LOCALSTORAGE (ESTO TE FALTABA)
    // ------------------------------------------------------------------
    localStorage.setItem('usuario_id', user.id.toString());
    localStorage.setItem('usuario_nombre', user.nombre);
    localStorage.setItem('usuario_correo', user.correo);

    this.showToast('Acceso correcto', 'success');
    this.router.navigate(['/inicio']);
  }

  // ----------------------------------------------------
  // TOAST
  // ----------------------------------------------------
  async showToast(message: string, color: 'danger' | 'success' = 'danger') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color
    });
    toast.present();
  }

  goToRegister() { }
  goToForgotPassword() { }
}
