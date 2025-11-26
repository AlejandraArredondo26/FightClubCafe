import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PerfilPage } from './perfil.page';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ToastController } from '@ionic/angular';
import { Firestore } from '@angular/fire/firestore';

describe('PerfilPage', () => {
  let component: PerfilPage;
  let fixture: ComponentFixture<PerfilPage>;

  // === MOCKS ===
  const routerMock = {
    navigate: jasmine.createSpy('navigate')
  };

  const authServiceMock = {
    actualizarUsuario: jasmine.createSpy('actualizarUsuario')
      .and.returnValue(Promise.resolve(true))
  };

  // mock del toast
  let toastInstance: any;

  const toastCtrlMock = {
    create: jasmine.createSpy('create').and.callFake((opts) => {
      toastInstance = {
        present: jasmine.createSpy('present'),
        ...opts
      };
      return Promise.resolve(toastInstance);
    })
  };

  const firestoreMock = {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PerfilPage],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: ToastController, useValue: toastCtrlMock },
        { provide: Firestore, useValue: firestoreMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PerfilPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // =====================================================
  // 0. Componente creado
  // =====================================================
  it('should create', () => {
    expect(component).toBeTruthy();
    });

  // =====================================================
  // 1. ionViewWillEnter() → carga usuario desde localStorage
  // =====================================================
  it('should load user from localStorage on ionViewWillEnter', () => {
    const usuario = {
      id: '999',
      nombre: 'Ana',
      correo: 'ana@mail.com',
      personaje_id: 'p2'
    };

    localStorage.setItem('usuario', JSON.stringify(usuario));

    component.ionViewWillEnter();

    expect(component.usuario).toEqual(usuario);
  });

  // =====================================================
  // 2. guardarCambios() → actualizarUsuario = TRUE
  // =====================================================
  it('should save changes when actualizarUsuario returns true', async () => {
    component.usuario = {
      id: '123',
      nombre: 'Nuevo Nombre',
      correo: 'nuevo@mail.com',
      personaje_id: 'p1'
    };

    const toastSpy = spyOn(component as any, 'showToast')
      .and.returnValue(Promise.resolve());

    await component.guardarCambios();

    expect(authServiceMock.actualizarUsuario).toHaveBeenCalledWith(
      '123',
      { nombre: 'Nuevo Nombre', correo: 'nuevo@mail.com', personaje_id: 'p1' }
    );

    const saved = JSON.parse(localStorage.getItem('usuario')!);
    expect(saved.nombre).toBe('Nuevo Nombre');

    expect(toastSpy).toHaveBeenCalledWith(
      'Cambios guardados correctamente',
      'success'
    );
  });

  // =====================================================
  // 3. guardarCambios() → actualizarUsuario = FALSE
  // =====================================================
  it('should show error toast when actualizarUsuario returns false', async () => {
    authServiceMock.actualizarUsuario.and.returnValue(Promise.resolve(false));

    component.usuario = {
      id: '33',
      nombre: 'Test',
      correo: 't@t.com',
      personaje_id: 'p3'
    };

    const toastSpy = spyOn(component as any, 'showToast')
      .and.returnValue(Promise.resolve());

    await component.guardarCambios();

    expect(toastSpy).toHaveBeenCalledWith(
      'Error al guardar los cambios',
      'danger'
    );
  });

  // =====================================================
  // 4. guardarCambios() → usuario = null
  // =====================================================
  it('should not call actualizarUsuario if usuario is null', async () => {
    component.usuario = null;

    await component.guardarCambios();

    expect(authServiceMock.actualizarUsuario).not.toHaveBeenCalled();
  });

  // =====================================================
  // 5. logout()
  // =====================================================
  it('should logout and navigate to login', () => {
    localStorage.setItem('usuario', 'test-user');
    localStorage.setItem('usuario_id', '999');

    component.logout();

    expect(localStorage.getItem('usuario')).toBeNull();
    expect(localStorage.getItem('usuario_id')).toBeNull();

    expect(routerMock.navigate).toHaveBeenCalledWith(
      ['/login'],
      { replaceUrl: true }
    );
  });

  // =====================================================
  // 6. guardarCambios() → debe guardar en localStorage y llamar showToast
  // =====================================================
  it('should store in localStorage and show success toast when ok=true', async () => {
    component.usuario = {
      id: '555',
      nombre: 'Usuario Test',
      correo: 'test@mail.com',
      personaje_id: 'pj7'
    };

    authServiceMock.actualizarUsuario.and.returnValue(Promise.resolve(true));

    const localSpy = spyOn(localStorage, 'setItem');
    const toastSpy = spyOn(component as any, 'showToast')
      .and.returnValue(Promise.resolve());

    await component.guardarCambios();

    expect(localSpy).toHaveBeenCalledWith(
      'usuario',
      JSON.stringify(component.usuario)
    );

    expect(toastSpy).toHaveBeenCalledWith(
      'Cambios guardados correctamente',
      'success'
    );
  });

  // =====================================================
  // 7. showToast() → verifica create() + present()
  // =====================================================
  it('should create and present a toast in showToast()', async () => {
    await component.showToast('Hola', 'danger');

    expect(toastCtrlMock.create).toHaveBeenCalledWith({
      message: 'Hola',
      duration: 2000,
      color: 'danger'
    });

    expect(toastInstance.present).toHaveBeenCalled();
  });

});
