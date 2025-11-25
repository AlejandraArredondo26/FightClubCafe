import { TestBed } from '@angular/core/testing';
import { Personajes } from './personajes';

import { HttpClientModule } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { firebaseConfig } from 'src/environments/firebaseConfig';
import { firstValueFrom } from 'rxjs';

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
  it('getPersonajes debe emitir un array', async () => {
    const obs$ = service.getPersonajes();
    const data = await firstValueFrom(obs$);

    expect(Array.isArray(data)).toBeTrue();
  });

  // ==========================================
  //    getPersonajesDetalle(id) TEST REAL
  // ==========================================
  it('getPersonajesDetalle debe emitir un objeto', async () => {
    const idPrueba = 'personaje1';

    const obs$ = service.getPersonajesDetalle(idPrueba);
    const data = await firstValueFrom(obs$);

    expect(typeof data).toBe('object');
  });

});
