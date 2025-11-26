import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ElementRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { IonContent, ModalController, AngularDelegate } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';

import { InicioPage } from './inicio.page';
import { Personajes } from 'src/app/services/personajes';
import { Personaje } from 'src/app/interfaces/interfaces';

// ====== STUB DEL SERVICIO Personajes ======
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

        // ====== MOCK DE MODAL CONTROLLER ======
        {
          provide: ModalController,
          useValue: {
            create: () =>
              Promise.resolve({
                present: () => Promise.resolve()
              })
          }
        },

        // ===== FIX: AngularDelegate completo =====
        {
          provide: AngularDelegate,
          useValue: {
            create: () => ({}),
            attachViewToDom: () => Promise.resolve(),
            removeViewFromDom: () => Promise.resolve()
          }
        }
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

    const p = component.personajesRecientes[0];
    expect(p.id).toBe('1');
    expect(p.nombre).toBe('Goku');
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

    expect(args[0]).toBe(0);
    expect(args[2]).toBe(600);
  });

  // =================================================
  //        TEST 3: abrirModal(id)
  // =================================================
  it('debe abrir un modal con el id correcto', async () => {
    const modalSpy = jasmine.createSpyObj('modal', ['present']);

    const modalCtrl = TestBed.inject(ModalController);
    const modalCtrlSpy = spyOn(modalCtrl, 'create')
      .and.returnValue(Promise.resolve(modalSpy));

    await component.abrirModal('123');

    expect(modalCtrlSpy).toHaveBeenCalledWith({
      component: jasmine.any(Function),
      componentProps: { id: '123' },
      backdropDismiss: true,
      cssClass: 'detalle-modal'
    });

    expect(modalSpy.present).toHaveBeenCalled();
  });

  // =================================================
  //     TEST 4: verMas() con import dinámico
  // =================================================
  it('debe abrir modal con HistoriaComponent usando import dinámico', async () => {
    const modalSpy = jasmine.createSpyObj('modal', ['present']);

    const modalCtrl = TestBed.inject(ModalController);
    const modalCtrlSpy = spyOn(modalCtrl, 'create')
      .and.returnValue(Promise.resolve(modalSpy));

    // Fake del componente cargado dinámicamente
    const historiaFake = {
      HistoriaComponent: class FakeHistoria {}
    };

    // ======== MOCK DE import() =========
    const g: any = globalThis;
    const realImport = g.import;

    g.__fakeDynamicImport = () => Promise.resolve(historiaFake);
    g.import = (path: string) => g.__fakeDynamicImport(path);

    spyOn(g, '__fakeDynamicImport').and.callThrough();

    await component.verMas();

    expect(g.__fakeDynamicImport).toHaveBeenCalled();

    expect(modalCtrlSpy).toHaveBeenCalledWith({
      component: historiaFake.HistoriaComponent,
      cssClass: 'detalle-modal',
      backdropDismiss: true
    });

    expect(modalSpy.present).toHaveBeenCalled();

    g.import = realImport;
  });
});
