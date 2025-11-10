import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ElementRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { IonContent, ModalController, AngularDelegate } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { InicioPage } from './inicio.page';
import { Personajes } from 'src/app/services/personajes';
import { Hero } from 'src/app/interfaces/interfaces';

class PersonajesStub {
  getHeroes(limit: number) {
    const heroes: Partial<Hero>[] = Array.from({ length: limit }).map((_, i) => ({ id: i + 1, name: `H${i+1}` })) as Hero[];
    return of(heroes as Hero[]);
  }
}

describe('InicioPage', () => {
  let component: InicioPage;
  let fixture: ComponentFixture<InicioPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      
      providers: [
        { provide: Personajes, useClass: PersonajesStub },
        { provide: ModalController, useValue: { create: () => Promise.resolve({ present: () => Promise.resolve() }) } },
        { provide: AngularDelegate, useValue: {} as any }
      ],
      imports: [InicioPage, RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(InicioPage);
    component = fixture.componentInstance;
  });

  it('creates and loads heroes on init', () => {
    expect(component).toBeTruthy();
    component.ngOnInit();
    expect(component.cargando).toBeFalse();
    expect(component.heroes.length).toBeGreaterThan(0);
  });

  it('scrolls to info section with IonContent', () => {
    const contentSpy = jasmine.createSpyObj<IonContent>('IonContent', ['scrollToPoint']);
    (component as any).content = contentSpy;
    component.infoSection = new ElementRef({ offsetTop: 120 });
    component.irAInfo();
    expect(contentSpy.scrollToPoint).toHaveBeenCalled();
    const args = contentSpy.scrollToPoint.calls.mostRecent().args;
    expect(args[0]).toBe(0);
    expect(args[2]).toBe(600);
  });
});
