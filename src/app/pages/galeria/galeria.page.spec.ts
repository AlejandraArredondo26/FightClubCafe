import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { GaleriaPage } from './galeria.page';
import { Personajes } from 'src/app/services/personajes';
import { Hero } from 'src/app/interfaces/interfaces';

class PersonajesStub {
  getHeroes(limit: number) {
    const heroes: Partial<Hero>[] = Array.from({ length: limit }).map((_, i) => ({ id: i + 1, name: `H${i+1}` })) as Hero[];
    return of(heroes as Hero[]);
  }
}

describe('GaleriaPage', () => {
  let component: GaleriaPage;
  let fixture: ComponentFixture<GaleriaPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GaleriaPage],
      providers: [{ provide: Personajes, useClass: PersonajesStub }],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(GaleriaPage);
    component = fixture.componentInstance;
    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
