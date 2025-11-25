import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, NavigationEnd } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AppComponent } from './app.component';
import { Subject } from 'rxjs';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  // 🔥 Mock de eventos del router
  let routerEvents$: Subject<any>;
  let routerMock: any;

  // 🔥 Mock del menú de Ionic
  let menuMock: any;

  beforeEach(async () => {
    routerEvents$ = new Subject<any>();

    routerMock = {
      events: routerEvents$.asObservable()
    };

    menuMock = {
      close: jasmine.createSpy('close')
    };

    spyOn(localStorage, 'getItem').and.returnValue(null);

    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: MenuController, useValue: menuMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  // ======================================================
  //        COMPONENTE SE CREA CORRECTAMENTE
  // ======================================================
  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  // ======================================================
  //        PRUEBA DEL SUBSCRIBE A ROUTER.EVENTS
  // ======================================================
  it('debe reaccionar al NavigationEnd: cerrar menú + ocultar menu login', () => {

    // Ejecuta la detección inicial
    fixture.detectChanges();

    // Emitimos un evento de NavigationEnd simulado
    routerEvents$.next(
      new NavigationEnd(1, '/login', '/login')
    );

    // Verifica que disableMenu se configuró correctamente
    expect(component.disableMenu).toBeTrue();

    // Verifica que menu.close() se llamó con el id correcto
    expect(menuMock.close).toHaveBeenCalledWith('main-menu');
  });

  // ======================================================
  //        PRUEBA: SI NO ES LOGIN, NO DESHABILITA MENÚ
  // ======================================================
  it('debe mantener el menú habilitado si la ruta no es login', () => {

    fixture.detectChanges();

    routerEvents$.next(
      new NavigationEnd(1, '/inicio', '/inicio')
    );

    expect(component.disableMenu).toBeFalse();
  });

  // ======================================================
  //        PRUEBA DE cargarUsuario()
  // ======================================================
  it('debe cargar datos del usuario si existe usuario_id', () => {

    (localStorage.getItem as jasmine.Spy).and.returnValue('xyz123');

    component.cargarUsuario();

    // Verifica que usuarioActual se cargó
    expect(component.usuarioActual).toEqual({ id: 'xyz123' });

    // Verifica que se agregaron las opciones correctas
    const ultimo = component.elementos.slice(-2);

    expect(ultimo).toEqual([
      { icono: 'person-circle-outline', nombre: 'Mi Perfil', ruta: '/perfil' },
      { icono: 'log-out-outline', nombre: 'Salir', ruta: '/logout' }
    ]);
  });

});
