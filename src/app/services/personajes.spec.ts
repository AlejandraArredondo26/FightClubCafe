import { TestBed } from '@angular/core/testing';
import { Personajes } from './personajes';

import { HttpClientModule } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { firebaseConfig } from 'src/environments/firebaseConfig';

describe('Personajes service', () => {
  let service: Personajes;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [
        provideFirebaseApp(() => initializeApp(firebaseConfig)),
        provideFirestore(() => getFirestore()),
        Personajes
      ]
    });

    service = TestBed.inject(Personajes);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // ==========================================
  //         getPersonajes() TEST REAL
  // ==========================================
  it('getPersonajes debe emitir un array', (done) => {
    const obs$ = service.getPersonajes();

    expect(obs$).toBeTruthy();
    expect(typeof obs$.subscribe).toBe('function');

    obs$.subscribe({
      next: (data) => {
        expect(Array.isArray(data)).toBeTrue();
        done();
      },
      error: (e) => {
        fail('Error en getPersonajes: ' + e);
        done();
      }
    });
  });

  // ==========================================
  //    getPersonajesDetalle(id) TEST REAL
  // ==========================================
  it('getPersonajesDetalle debe emitir un objeto', (done) => {
    const idPrueba = 'personaje1';

    const obs$ = service.getPersonajesDetalle(idPrueba);

    expect(obs$).toBeTruthy();
    expect(typeof obs$.subscribe).toBe('function');

    obs$.subscribe({
      next: (data) => {
        expect(typeof data).toBe('object');
        done();
      },
      error: (e) => {
        fail('Error en getPersonajesDetalle: ' + e);
        done();
      }
    });
  });

});
