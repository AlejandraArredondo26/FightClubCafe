import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginPage } from './login.page';

class RouterStub {
  navigate = jasmine.createSpy('navigate');
}

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let router: RouterStub;

  beforeEach(() => {
    router = new RouterStub();
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [LoginPage],
      providers: [{ provide: Router, useValue: router }],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
  });

  it('invalid form blocks submit', () => {
    component.loginForm.setValue({ email: '', password: '' });
    component.onLogin();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('navigates to /inicio on valid submit', () => {
    component.loginForm.setValue({ email: 'a@b.c', password: 'x' });
    component.onLogin();
    expect(router.navigate).toHaveBeenCalledWith(['/inicio']);
  });
});
