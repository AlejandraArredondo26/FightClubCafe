import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistoriaComponent } from './historia.component';
import { ModalController } from '@ionic/angular';

describe('HistoriaComponent', () => {
  let component: HistoriaComponent;
  let fixture: ComponentFixture<HistoriaComponent>;
  let modalCtrlMock: any;

  beforeEach(async () => {

    modalCtrlMock = {
      dismiss: jasmine.createSpy('dismiss').and.returnValue(Promise.resolve())
    };

    await TestBed.configureTestingModule({
      imports: [HistoriaComponent],
      providers: [
        { provide: ModalController, useValue: modalCtrlMock }
      ]
    })
    .overrideComponent(HistoriaComponent, {
      set: {
        providers: [
          { provide: ModalController, useValue: modalCtrlMock }
        ]
      }
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close modal on cerrar()', async () => {
    await component.cerrar();
    expect(modalCtrlMock.dismiss).toHaveBeenCalled();
  });
});
