import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  query,
  where,
  getDocs,
  addDoc, updateDoc,doc
} from '@angular/fire/firestore';
import { Usuario } from 'src/app/interfaces/interfaces';
@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(private firestore: Firestore) { }

  // ----------------------------------------------------
  // LOGIN
  // ----------------------------------------------------
  async login(email: string, password: string): Promise<Usuario | null> {

    const ref = collection(this.firestore, 'usuarios');

    const q = query(
      ref,
      where('correo', '==', email),
      where('contraseña', '==', password)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return null;
    }

    const docSnap = snapshot.docs[0];
    const data = docSnap.data() as Omit<Usuario, 'id'>;

    const user: Usuario = {
      id: docSnap.id,
      ...data
    };

    localStorage.setItem('usuario', JSON.stringify(user));
    localStorage.setItem('usuario_id', user.id);



    return user;
  }


  // ----------------------------------------------------
  // REGISTRO
  // ----------------------------------------------------
  async registrarUsuario(data: Omit<Usuario, 'id'> & { contraseña: string }): Promise<string | null> {
    try {
      const usuariosRef = collection(this.firestore, 'usuarios');
      const resp = await addDoc(usuariosRef, data);

      return resp.id;

    } catch (error) {
      console.error('Error guardando usuario:', error);
      return null;
    }
  }

  async actualizarUsuario(id: string, data: Partial<Usuario>): Promise<boolean> {
    try {
      const ref = doc(this.firestore, 'usuarios', id);
      await updateDoc(ref, data);
      return true;
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      return false;
    }
  }

}
