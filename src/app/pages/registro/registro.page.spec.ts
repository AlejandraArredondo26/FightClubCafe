import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RegistroPage } from './registro.page';

class RouterStub {
  navigate = jasmine.createSpy('navigate');
}

describe('RegistroPage', () => {
  let component: RegistroPage;
  let fixture: ComponentFixture<RegistroPage>;
  let router: RouterStub;

  beforeEach(() => {
    router = new RouterStub();
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [RegistroPage],
      providers: [{ provide: Router, useValue: router }],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(RegistroPage);
    component = fixture.componentInstance;
  });

  it('requires valid fields', () => {
    component.form.setValue({ nombre: '', email: '', password: '' });
    component.crearCuenta();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('navigates to /login on success', () => {
    component.form.setValue({ nombre: 'Ana', email: 'ana@x.y', password: '123456' });
    component.crearCuenta();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
