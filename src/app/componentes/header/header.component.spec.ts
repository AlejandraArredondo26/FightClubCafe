import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderComponent ],
      imports: [
        IonicModule.forRoot(),
        RouterTestingModule.withRoutes([])   // Router mock
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ===========================================
  // PRUEBA 1: usuario logueado → ir a /perfil
  // ===========================================
  it('should navigate to /perfil if usuario_id exists', () => {
    spyOn(router, 'navigate');

    localStorage.setItem('usuario_id', '12345');

    component.abrirPerfil();

    expect(router.navigate).toHaveBeenCalledWith(['/perfil']);
  });

  // =============================================
  // PRUEBA 2: usuario NO logueado → ir a /login
  // =============================================
  it('should navigate to /login if usuario_id does NOT exist', () => {
    spyOn(router, 'navigate');

    localStorage.removeItem('usuario_id');

    component.abrirPerfil();

    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

});
