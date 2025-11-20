import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ElementRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { IonContent, ModalController, AngularDelegate } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { InicioPage } from './inicio.page';
import { Personajes } from 'src/app/services/personajes';
import { Personaje } from 'src/app/interfaces/interfaces';

// ====== STUB CORRECTAMENTE ESTRUCTURADO ======
class PersonajesStub {
  getPersonajes() {
    const personajes: Personaje[] = [
      {
        id: '1',
        nombre: 'Goku',
        descripcion: 'Saiyajin poderoso',
        dano: 9000,
        velocidad: 8000,
        imagen: 'goku.png'
      },
      {
        id: '2',
        nombre: 'Vegeta',
        descripcion: 'Príncipe Saiyajin',
        dano: 8500,
        velocidad: 7800,
        imagen: 'vegeta.png'
      }
    ];
    return of(personajes);
  }
}

describe('InicioPage', () => {
  let component: InicioPage;
  let fixture: ComponentFixture<InicioPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Personajes, useClass: PersonajesStub },
        {
          provide: ModalController,
          useValue: {
            create: () =>
              Promise.resolve({
                present: () => Promise.resolve()
              })
          }
        },
        { provide: AngularDelegate, useValue: {} as any }
      ],
      imports: [InicioPage, RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(InicioPage);
    component = fixture.componentInstance;
  });

  // =================================================
  //                TEST 1: Carga inicial
  // =================================================
  it('debe crearse y cargar personajes en ngOnInit', () => {
    expect(component).toBeTruthy();

    component.ngOnInit();

    expect(component.personajesRecientes.length).toBe(2);

    // Validar que coinciden con el stub
    const p = component.personajesRecientes[0];
    expect(p.id).toBe('1');
    expect(p.nombre).toBe('Goku');
    expect(p.descripcion).toBe('Saiyajin poderoso');
    expect(p.dano).toBe(9000);
    expect(p.velocidad).toBe(8000);
    expect(p.imagen).toBe('goku.png');
  });

  // =================================================
  //                TEST 2: Scroll
  // =================================================
  it('debe hacer scroll a la sección info con IonContent', () => {
    const contentSpy = jasmine.createSpyObj<IonContent>('IonContent', [
      'scrollToPoint'
    ]);

    (component as any).content = contentSpy;
    component.infoSection = new ElementRef({ offsetTop: 250 });

    component.irAInfo();

    expect(contentSpy.scrollToPoint).toHaveBeenCalled();

    const args = contentSpy.scrollToPoint.calls.mostRecent().args;

    expect(args[0]).toBe(0); // x
    expect(args[2]).toBe(600); // duración
  });

});
