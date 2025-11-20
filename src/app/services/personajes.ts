import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Hero } from '../interfaces/interfaces';
import { Firestore, collection, collectionData, doc, docData } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class Personajes {
  //private readonly apiUrl = 'https://akabab.github.io/superhero-api/api/all.json';

  constructor(private http: HttpClient, private firestore: Firestore) { }

  //getHeroes(limit: number = 20): Observable<Hero[]> {
  //return this.http.get<Hero[]>(this.apiUrl).pipe(
  //map((heroes) => heroes.slice(0, limit))
  //);
  //}
  getPersonajes() {
    const personajesRef = collection(this.firestore, 'personajes');
    return collectionData(personajesRef, { idField: 'id' });
  }

  getPersonajesDetalle(id: string) {
    //Consulta de la colección el documento con el id que recibimos
    const personajeRef = doc(this.firestore, `personajes/${id}`);
    //Extraemos los datos del objeto encontrado y lo retornamos
    return docData(personajeRef);
  }


}
