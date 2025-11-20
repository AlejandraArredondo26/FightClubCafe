import { ComponentFixture, TestBed, waitForAsync, fakeAsync, tick } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';
import { DetalleComponent } from './detalle.component';
import { Personajes } from 'src/app/services/personajes';
import { of } from 'rxjs';
import { Personaje } from 'src/app/interfaces/interfaces';

describe('DetalleComponent', () => {
  let component: DetalleComponent;
  let fixture: ComponentFixture<DetalleComponent>;
  let personajesServiceSpy: jasmine.SpyObj<Personajes>;
  let modalCtrlSpy: jasmine.SpyObj<ModalController>;

  beforeEach(waitForAsync(() => {
    personajesServiceSpy = jasmine.createSpyObj('Personajes', ['getPersonajesDetalle']);
    modalCtrlSpy = jasmine.createSpyObj('ModalController', ['dismiss']);

    TestBed.configureTestingModule({
      declarations: [DetalleComponent],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: Personajes, useValue: personajesServiceSpy },
        { provide: ModalController, useValue: modalCtrlSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DetalleComponent);
    component = fixture.componentInstance;
    component.id = 'V123';
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call dismiss when cerrar() is executed', () => {
    component.cerrar();
    expect(modalCtrlSpy.dismiss).toHaveBeenCalled();
  });

  it('should assign detallePersonaje correctly from service', fakeAsync(() => {
    const mockPersonaje: Personaje = {
      id: 'V123',
      nombre: 'Vegeta',
      descripcion: 'Guerrero Saiyajin orgulloso',
      dano: 8500,
      velocidad: 8200,
      imagen: 'vegeta.jpg'
    };

    personajesServiceSpy.getPersonajesDetalle.and.returnValue(of(mockPersonaje));

    component.ngOnInit();
    tick();

    expect(personajesServiceSpy.getPersonajesDetalle).toHaveBeenCalledWith('V123');
    expect(component.detallePersonaje).toEqual(mockPersonaje);
  }));

});
