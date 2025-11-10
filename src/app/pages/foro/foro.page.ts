import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Reply {
  id: number;
  author: string;
  text: string;
  createdAt: string; // ISO
}

interface Thread {
  id: number;
  author: string;
  text: string;
  createdAt: string; // ISO
  replies: Reply[];
  ui?: { showReplyForm?: boolean };
}

@Component({
  standalone:false,
  selector: 'app-foro',
  templateUrl: './foro.page.html',
  styleUrls: ['./foro.page.scss'],
})
export class ForoPage implements OnInit {

  threads: Thread[] = [];

  threadForm!: FormGroup;
  replyForm!: FormGroup;

  private storageKey = 'foro_threads_v1';
  private idCounter = 1;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.threadForm = this.fb.group({
      author: ['', [Validators.required, Validators.maxLength(60)]],
      text: ['', [Validators.required, Validators.maxLength(2000)]],
    });

    this.replyForm = this.fb.group({
      author: ['', [Validators.required, Validators.maxLength(60)]],
      text: ['', [Validators.required, Validators.maxLength(2000)]],
    });

    this.loadFromStorage();
  }

  // ---- Crear hilo ----
  addThread() {
    if (this.threadForm.invalid) return;
    const now = new Date().toISOString();

    const newThread: Thread = {
      id: this.nextId(),
      author: this.threadForm.value.author.trim(),
      text: this.threadForm.value.text.trim(),
      createdAt: now,
      replies: []
    };

    this.threads = [newThread, ...this.threads];
    this.threadForm.reset();
    this.saveToStorage();
  }

  // ---- Mostrar/Ocultar form de respuesta ----
  toggleReplyForm(t: Thread) {
    t.ui = t.ui || {};
    t.ui.showReplyForm = !t.ui.showReplyForm;
    if (t.ui.showReplyForm) this.replyForm.reset();
  }

  // ---- Agregar respuesta ----
  addReply(t: Thread) {
    if (this.replyForm.invalid) return;

    const r: Reply = {
      id: this.nextId(),
      author: this.replyForm.value.author.trim(),
      text: this.replyForm.value.text.trim(),
      createdAt: new Date().toISOString()
    };

    t.replies = [...(t.replies || []), r];
    t.ui = { showReplyForm: false };
    this.threads = this.threads.map(x => x.id === t.id ? t : x);
    this.replyForm.reset();
    this.saveToStorage();
  }

  // ---- Borrar hilo ----
  deleteThread(id: number) {
    this.threads = this.threads.filter(t => t.id !== id);
    this.saveToStorage();
  }

  // ---- trackBy ----
  trackByThread = (_: number, t: Thread) => t.id;
  trackByReply  = (_: number, r: Reply) => r.id;

  // ---- Persistencia ----
  private saveToStorage() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.threads));
    } catch {}
  }

  private loadFromStorage() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (raw) {
        const list = JSON.parse(raw) as Thread[];
        this.threads = list;
        const maxId = list.reduce(
          (m, t) => Math.max(m, t.id, ...(t.replies?.map(r => r.id) ?? [0])),
          0
        );
        this.idCounter = maxId + 1;
      } else {
        this.threads = [];
      }
    } catch {
      this.threads = [];
    }
  }

  private nextId() { return this.idCounter++; }
}

