import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { LoginPage } from './login.page';
import { AuthService } from 'src/app/services/auth.service';
import { ToastController } from '@ionic/angular';

// ==== Mocks ====

class AuthServiceMock {
  login = jasmine.createSpy('login').and.returnValue(
    Promise.resolve({
      id: '123',
      nombre: 'Test',
      correo: 'a@b.c',
      personaje_id: '1'
    })
  );
}

class RouterStub {
  navigate = jasmine.createSpy('navigate');
}

class ToastControllerMock {
  create = jasmine.createSpy('create').and.returnValue(
    Promise.resolve({
      present: jasmine.createSpy('present')
    })
  );
}

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let router: RouterStub;
  let auth: AuthServiceMock;

  beforeEach(async () => {
    router = new RouterStub();
    auth = new AuthServiceMock();

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [LoginPage],
      providers: [
        { provide: Router, useValue: router },
        { provide: AuthService, useValue: auth },
        { provide: ToastController, useClass: ToastControllerMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // -----------------------------------------------------
  // FORM INVALID
  // -----------------------------------------------------
  it('invalid form blocks submit', async () => {
    component.loginForm.setValue({ email: '', password: '' });

    await component.onLogin();

    expect(router.navigate).not.toHaveBeenCalled();
    expect(auth.login).not.toHaveBeenCalled();
  });

  // -----------------------------------------------------
  // LOGIN OK
  // -----------------------------------------------------
  it('navigates to /inicio on valid submit', async () => {
    component.loginForm.setValue({ email: 'a@b.c', password: '123456' });

    await component.onLogin();

    expect(auth.login).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/inicio']);
  });

  // -----------------------------------------------------
  // LOGIN THROW ERROR
  // -----------------------------------------------------
  it('muestra toast de error cuando login lanza excepción', async () => {
    auth.login.and.returnValue(Promise.reject('Fallo en login'));

    const toastSpy = spyOn(component, 'showToast').and.callThrough();
    const consoleSpy = spyOn(console, 'error');

    component.loginForm.setValue({ email: 'a@b.c', password: '123456' });

    await component.onLogin();

    expect(consoleSpy).toHaveBeenCalled();
    expect(toastSpy).toHaveBeenCalledWith('Error al intentar iniciar sesión');
    expect(router.navigate).not.toHaveBeenCalled();
  });

  // -----------------------------------------------------
  // LOGIN RETURNS NULL (INCORRECT USER)
  // -----------------------------------------------------
  it('muestra toast cuando el usuario no existe', async () => {
    auth.login.and.returnValue(Promise.resolve(null));

    const toastSpy = spyOn(component, 'showToast').and.callThrough();

    component.loginForm.setValue({ email: 'wrong@mail.com', password: 'bad' });

    await component.onLogin();

    expect(toastSpy).toHaveBeenCalledWith('Correo o contraseña incorrectos');
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
