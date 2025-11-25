import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { GaleriaPage } from './galeria.page';

describe('GaleriaPage', () => {
  let component: GaleriaPage;
  let fixture: ComponentFixture<GaleriaPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GaleriaPage],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(GaleriaPage);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create the page', () => {
    expect(component).toBeTruthy();
  });

  it('should open the viewer with correct image and description', () => {
    const src = 'assets/images/1.jpeg';

    component.abrirImagen(src);

    expect(component.currentSrc).toBe(src);
    expect(component.currentDescripcion).toBe(component.descripciones[src]);
    expect(component.viewerOpen).toBeTrue();
  });

  it('should show fallback description when image has no description', () => {
    const src = 'assets/images/no-existe.jpeg';

    component.abrirImagen(src);

    expect(component.currentDescripcion).toBe('Imagen sin descripción.');
  });
});
