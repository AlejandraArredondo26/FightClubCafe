import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ForoPage } from './foro.page';

import { Firestore } from '@angular/fire/firestore';
import { of, Subject } from 'rxjs';

// =====================
// MOCK COMPLETO FIRESTORE
// =====================
class FirestoreMock {
  collection = jasmine.createSpy('collection').and.callFake(() => ({}));
  collectionData = jasmine.createSpy('collectionData').and.callFake(() => of([]));
  addDoc = jasmine.createSpy('addDoc').and.returnValue(Promise.resolve());
  doc = jasmine.createSpy('doc').and.callFake(() => ({}));
  getDoc = jasmine.createSpy('getDoc').and.returnValue(
    Promise.resolve({
      exists: () => true,
      data: () => ({ nombre: 'Usuario Test' })
    })
  );
}

describe('ForoPage', () => {

  let component: ForoPage;
  let fixture: ComponentFixture<ForoPage>;
  let firestoreMock: any;

  beforeEach(async () => {
    firestoreMock = new FirestoreMock();

    await TestBed.configureTestingModule({
      declarations: [ ForoPage ],
      providers: [
        FormBuilder,
        { provide: Firestore, useValue: firestoreMock }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ForoPage);
    component = fixture.componentInstance;

    // Mock localStorage.getItem
    spyOn(localStorage, 'getItem').and.returnValue('123');

    component.ngOnInit();
    fixture.detectChanges();
  });

  // =========================================
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // =========================================
  // Formularios inicializados
  it('creates and initializes forms', () => {
    expect(component.threadForm).toBeTruthy();
    expect(component.replyForm).toBeTruthy();
    expect(component.threadForm.get('text')).toBeTruthy();
    expect(component.replyForm.get('text')).toBeTruthy();
  });

  // =========================================
  // cargarDatosUsuario
  it('cargarDatosUsuario asigna el nombre cuando el doc existe', async () => {
    component.usuarioActualId = '123';

    await component.cargarDatosUsuario();

    expect(firestoreMock.doc).toHaveBeenCalled();
    expect(firestoreMock.getDoc).toHaveBeenCalled();
    expect(component.usuarioActualNombre).toBe('Usuario Test');
  });

  // =========================================
  // addThread sin login
  it('no permite agregar hilo sin login', async () => {
    (localStorage.getItem as jasmine.Spy).and.returnValue(null);
    component.usuarioActualId = null;

    spyOn(window, 'alert');

    component.threadForm = new FormBuilder().group({ text: 'Hola' });

    await component.addThread();

    expect(window.alert).toHaveBeenCalledWith("Debes iniciar sesión para comentar.");
    expect(firestoreMock.addDoc).not.toHaveBeenCalled();
  });

  // =========================================
  // addThread inválido
  it('no agrega hilo si el formulario es inválido', async () => {
    component.usuarioActualId = '123';
    component.threadForm = new FormBuilder().group({ text: '' });

    await component.addThread();

    expect(firestoreMock.addDoc).not.toHaveBeenCalled();
  });

  // =========================================
  // addThread válido
  it('agrega hilo cuando todo es válido', async () => {
    component.usuarioActualId = '123';
    component.usuarioActualNombre = 'Tester';
    component.threadForm = new FormBuilder().group({ text: 'Nuevo hilo' });

    const resetSpy = spyOn(component.threadForm, 'reset');

    await component.addThread();

    expect(firestoreMock.addDoc).toHaveBeenCalled();
    expect(resetSpy).toHaveBeenCalled();
  });

  // =========================================
  // toggleReplyForm sin login
  it('toggleReplyForm muestra alerta si no hay login', () => {
    component.usuarioActualId = null;

    spyOn(window, 'alert');

    const thread = { ui: { showReplyForm: false } };

    component.toggleReplyForm(thread);

    expect(window.alert).toHaveBeenCalledWith("Debes iniciar sesión para responder.");
    expect(thread.ui.showReplyForm).toBeFalse();
  });

  // =========================================
  // toggleReplyForm con login
  it('toggleReplyForm alterna el estado y resetea el formulario', () => {
    component.usuarioActualId = '123';

    component.replyForm = new FormBuilder().group({ text: 'algo' });
    const resetSpy = spyOn(component.replyForm, 'reset');

    const thread = { ui: { showReplyForm: false } };

    component.toggleReplyForm(thread);

    expect(thread.ui.showReplyForm).toBeTrue();
    expect(resetSpy).toHaveBeenCalled();
  });

  // =========================================
  // addReply sin login
  it('addReply muestra alerta si no hay login', async () => {
    component.usuarioActualId = null;

    spyOn(window, 'alert');

    const thread = { id: '1', ui: { showReplyForm: true } };

    await component.addReply(thread);

    expect(window.alert).toHaveBeenCalledWith("Debes iniciar sesión para responder.");
    expect(firestoreMock.addDoc).not.toHaveBeenCalled();
  });

  // =========================================
  // addReply inválido
  it('addReply no ejecuta addDoc si formulario inválido', async () => {
    component.usuarioActualId = '123';
    component.replyForm = new FormBuilder().group({ text: '' });

    const thread = { id: '1', ui: { showReplyForm: true } };

    await component.addReply(thread);

    expect(firestoreMock.addDoc).not.toHaveBeenCalled();
  });

  // =========================================
  // addReply válido
  it('addReply ejecuta addDoc si todo es válido', async () => {
    component.usuarioActualId = '123';
    component.usuarioActualNombre = 'Tester';
    component.replyForm = new FormBuilder().group({ text: 'Respuesta válida' });

    const resetSpy = spyOn(component.replyForm, 'reset');
    const thread = { id: '1', ui: { showReplyForm: true } };

    await component.addReply(thread);

    expect(firestoreMock.addDoc).toHaveBeenCalled();
    expect(thread.ui.showReplyForm).toBeFalse();
    expect(resetSpy).toHaveBeenCalled();
  });

  // =========================================
  // getRespuestas
  it('getRespuestas retorna solo las respuestas del hilo pedido', () => {
    component.respuestas = [
      { thread_id: 'a', texto: '1' },
      { thread_id: 'b', texto: '2' },
      { thread_id: 'a', texto: '3' }
    ] as any;

    const resultado = component.getRespuestas('a');

    expect(resultado.length).toBe(2);
    expect(resultado[0].texto).toBe('1');
    expect(resultado[1].texto).toBe('3');
  });

});
