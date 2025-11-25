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

  const toastCtrlMock = {
    create: jasmine.createSpy('create').and.returnValue(
      Promise.resolve({ present: () => {} })
    )
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
  // 1. guardarCambios() → actualizarUsuario = TRUE
  // =====================================================
  it('should save changes when actualizarUsuario returns true', async () => {
    component.usuario = {
      id: '123',
      nombre: 'Nuevo Nombre',
      correo: 'nuevo@mail.com'
    } as any;

    const toastSpy = spyOn(component as any, 'showToast');

    await component.guardarCambios();

    expect(authServiceMock.actualizarUsuario).toHaveBeenCalledWith(
      '123',
      { nombre: 'Nuevo Nombre', correo: 'nuevo@mail.com' }
    );

    // Verifica que localStorage guarda los datos
    const saved = JSON.parse(localStorage.getItem('usuario')!);
    expect(saved.nombre).toBe('Nuevo Nombre');

    expect(toastSpy).toHaveBeenCalledWith(
      'Cambios guardados correctamente',
      'success'
    );
  });

  // =====================================================
  // 2. guardarCambios() → actualizarUsuario = FALSE
  // =====================================================
  it('should show error toast when actualizarUsuario returns false', async () => {
    authServiceMock.actualizarUsuario.and.returnValue(Promise.resolve(false));

    component.usuario = {
      id: '33',
      nombre: 'Test',
      correo: 't@t.com'
    } as any;

    const toastSpy = spyOn(component as any, 'showToast');

    await component.guardarCambios();

    expect(toastSpy).toHaveBeenCalledWith(
      'Error al guardar los cambios',
      'danger'
    );
  });

  // =====================================================
  // 3. guardarCambios() → usuario = null
  // =====================================================
  it('should not call actualizarUsuario if usuario is null', async () => {
    component.usuario = null;

    await component.guardarCambios();

    expect(authServiceMock.actualizarUsuario).not.toHaveBeenCalled();
  });

  // =====================================================
  // 4. logout()
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
});
