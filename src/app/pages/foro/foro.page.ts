import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  Firestore,
  collection,
  addDoc,
  collectionData,
  doc,
  getDoc,
  Timestamp
} from '@angular/fire/firestore';
import { ForoComentario, ForoRespuesta } from 'src/app/interfaces/interfaces';

@Component({
  standalone: false,
  selector: 'app-foro',
  templateUrl: './foro.page.html',
  styleUrls: ['./foro.page.scss'],
})
export class ForoPage implements OnInit {

  threads: (ForoComentario & { ui: { showReplyForm: boolean } })[] = [];
  respuestas: ForoRespuesta[] = [];

  threadForm!: FormGroup;
  replyForm!: FormGroup;

  usuarioActualId: string | null = null;
  usuarioActualNombre: string = "";

  constructor(
    private fb: FormBuilder,
    private firestore: Firestore
  ) {}

  async ngOnInit() {

    // Verificar login
    this.usuarioActualId = localStorage.getItem("usuario_id");

    if (this.usuarioActualId) {
      await this.cargarDatosUsuario();
    }

    // Formularios
    this.threadForm = this.fb.group({
      text: ['', [Validators.required]],
    });

    this.replyForm = this.fb.group({
      text: ['', [Validators.required]],
    });

    this.cargarHilos();
  }

  // =======================================================
  // CARGAR DATOS DEL USUARIO
  // =======================================================
  async cargarDatosUsuario() {
    const ref = doc(this.firestore, `usuarios/${this.usuarioActualId}`);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      this.usuarioActualNombre = snap.data()['nombre'];
    }
  }

  // =======================================================
  // CARGAR HILOS DEL FORO
  // =======================================================
  cargarHilos() {
    const ref = collection(this.firestore, 'foro');

    collectionData(ref, { idField: 'id' }).subscribe(async (data: any[]) => {
      this.threads = data
        .map(d => ({
          ...d,
          createdAt: d.createdAt instanceof Timestamp ? d.createdAt.toDate() : new Date(d.createdAt),
          ui: { showReplyForm: false }
        }))
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      for (const thread of this.threads) {
        await this.cargarRespuestas(thread.id);
      }
    });
  }

  // =======================================================
  // CARGAR RESPUESTAS
  // =======================================================
  async cargarRespuestas(threadId: string) {
    const ref = collection(this.firestore, `foro/${threadId}/respuestas`);

    collectionData(ref, { idField: 'id' }).subscribe((data: any[]) => {
      const respuestasConvertidas = data.map(d => ({
        ...d,
        createdAt: d.createdAt instanceof Timestamp ? d.createdAt.toDate() : new Date(d.createdAt),
        thread_id: threadId
      }));

      this.respuestas = this.respuestas.filter(r => r.thread_id !== threadId);
      this.respuestas.push(...respuestasConvertidas);
    });
  }

  // =======================================================
  // AGREGAR NUEVO COMENTARIO
  // =======================================================
  async addThread() {
    if (!this.usuarioActualId) {
      alert("Debes iniciar sesión para comentar.");
      return;
    }

    if (this.threadForm.invalid) return;

    const ref = collection(this.firestore, 'foro');

    await addDoc(ref, {
      comentario: this.threadForm.value.text.trim(),
      usuario_id: this.usuarioActualId,
      nombre: this.usuarioActualNombre,
      createdAt: Timestamp.now()
    });

    this.threadForm.reset();
  }

  // =======================================================
  // ABRIR / CERRAR FORM DE RESPUESTA
  // =======================================================
  toggleReplyForm(thread: any) {
    if (!this.usuarioActualId) {
      alert("Debes iniciar sesión para responder.");
      return;
    }

    thread.ui.showReplyForm = !thread.ui.showReplyForm;
    if (thread.ui.showReplyForm) this.replyForm.reset();
  }

  // =======================================================
  // AGREGAR RESPUESTA
  // =======================================================
  async addReply(thread: any) {
    if (!this.usuarioActualId) {
      alert("Debes iniciar sesión para responder.");
      return;
    }

    if (this.replyForm.invalid) return;

    const ref = collection(this.firestore, `foro/${thread.id}/respuestas`);

    await addDoc(ref, {
      texto: this.replyForm.value.text.trim(),
      usuario_id: this.usuarioActualId,
      nombre: this.usuarioActualNombre,
      createdAt: Timestamp.now()
    });

    thread.ui.showReplyForm = false;
    this.replyForm.reset();
  }

  getRespuestas(threadId: string) {
    return this.respuestas.filter(r => r.thread_id === threadId);
  }
  
}
