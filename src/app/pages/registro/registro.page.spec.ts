import { TestBed } from '@angular/core/testing';
import { RegistroPage } from './registro.page';
import { Router } from '@angular/router';
import { Firestore } from '@angular/fire/firestore';
import { AuthService } from 'src/app/services/auth.service';


describe('RegistroPage', () => {
  let component: RegistroPage;
  let routerMock: jasmine.SpyObj<Router>;
  let firestoreMock: any;
  let authMock: any;

  beforeEach(() => {
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    firestoreMock = {
      collection: jasmine.createSpy('collection').and.returnValue({}),
    };

    authMock = {
      registrarUsuario: jasmine.createSpy('registrarUsuario')
        .and.returnValue(Promise.resolve('abc123')) // simula ID generado
    };

    TestBed.configureTestingModule({
      providers: [
        RegistroPage,
        { provide: Router, useValue: routerMock },
        { provide: Firestore, useValue: firestoreMock },
        { provide: AuthService, useValue: authMock }
      ]
    });

    component = TestBed.inject(RegistroPage);

    // Simular formulario válido
    component.form.setValue({
      nombre: 'Test User',
      email: 'test@test.com',
      password: '123456',
      personaje_id: '1'
    });
  });

  it('should navigate to /login on successful registration', async () => {

    // Ejecutamos el método real del componente
    await component.crearCuenta();

    // Esperar que navegue
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });

});
