import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { LoginPage } from './login.page';
import { AuthService } from 'src/app/services/auth.service';

// ==== Mocks ====
class AuthServiceMock {
  login = jasmine.createSpy('login')
    .and.returnValue(Promise.resolve({ 
      id:'123', nombre:'Test', correo:'a@b.c', personaje_id:'1'
    }));
}

class RouterStub {
  navigate = jasmine.createSpy('navigate');
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
        { provide: AuthService, useValue: auth }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('invalid form blocks submit', async () => {
    component.loginForm.setValue({ email: '', password: '' });

    await component.onLogin();

    expect(router.navigate).not.toHaveBeenCalled();
    expect(auth.login).not.toHaveBeenCalled();
  });

  it('navigates to /inicio on valid submit', async () => {
    component.loginForm.setValue({ email: 'a@b.c', password: '123456' });

    await component.onLogin();

    expect(auth.login).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/inicio']);
  });
});
