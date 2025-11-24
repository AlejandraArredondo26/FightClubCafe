import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Usuario } from 'src/app/interfaces/interfaces';

@Component({
  standalone: false,
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss']
})
export class RegistroPage implements OnInit {

  form: FormGroup;
  personajes: { id: string; nombre: string }[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: AuthService,
    private firestore: Firestore
  ) {

    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      personaje_id: ['', Validators.required]
    });
  }

  ngOnInit() {
    const col = collection(this.firestore, 'personajes');

    collectionData(col, { idField: 'id' }).subscribe((data: any[]) => {
      this.personajes = data;
    });
  }

  async crearCuenta() {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: Omit<Usuario, 'id'> & { contraseña: string } = {
      nombre: this.form.get('nombre')?.value,
      correo: this.form.get('email')?.value,
      contraseña: this.form.get('password')?.value,
      personaje_id: this.form.get('personaje_id')?.value
    };

    // 🔥 Registrar usuario y obtener su ID generado por Firestore
    const userId = await this.auth.registrarUsuario(payload);

    if (userId) {
      // Guardamos el ID del usuario recién creado
      localStorage.setItem('usuario_id', userId);

      // Redirigimos a login
      this.router.navigate(['/login']);
    }
  }
}
