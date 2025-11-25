import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { Firestore } from '@angular/fire/firestore';
import { Usuario } from 'src/app/interfaces/interfaces';

// ===== MOCKS FIREBASE =====
const collectionMock = jasmine.createSpy('collection');
const queryMock = jasmine.createSpy('query');
const whereMock = jasmine.createSpy('where');
const getDocsMock = jasmine.createSpy('getDocs');
const addDocMock = jasmine.createSpy('addDoc');
const updateDocMock = jasmine.createSpy('updateDoc');
const docMock = jasmine.createSpy('doc');

// Asignamos funciones al entorno global
(globalThis as any).collection = collectionMock;
(globalThis as any).query = queryMock;
(globalThis as any).where = whereMock;
(globalThis as any).getDocs = getDocsMock;
(globalThis as any).addDoc = addDocMock;
(globalThis as any).updateDoc = updateDocMock;
(globalThis as any).doc = docMock;

describe('AuthService', () => {
    let service: AuthService;
    let firestoreStub: any;

    beforeEach(() => {
        firestoreStub = {};

        TestBed.configureTestingModule({
            providers: [
                AuthService,
                { provide: Firestore, useValue: firestoreStub }
            ]
        });

        service = TestBed.inject(AuthService);

        // Reset mocks
        collectionMock.calls.reset();
        queryMock.calls.reset();
        whereMock.calls.reset();
        getDocsMock.calls.reset();
        addDocMock.calls.reset();
        updateDocMock.calls.reset();
        docMock.calls.reset();

        spyOn(localStorage, 'setItem');
    });

    // ======================================================
    //                    LOGIN OK COMPLETO
    // ======================================================
    it('debe hacer login correctamente y evaluar todo el flujo query()', async () => {

        const fakeUser: Usuario = {
            id: 'abc123',
            nombre: 'Test User',
            correo: 'test@test.com',
            personaje_id: '1'
        };

        const fakeSnapshot = {
            empty: false,
            docs: [
                {
                    id: fakeUser.id,
                    data: () => ({
                        nombre: fakeUser.nombre,
                        correo: fakeUser.correo,
                        personaje_id: fakeUser.personaje_id
                    })
                }
            ]
        };

        // ------- MOCK DE RESPUESTA FIRESTORE -------
        getDocsMock.and.returnValue(Promise.resolve(fakeSnapshot));

        // ------- EJECUCIÓN DEL LOGIN -------
        const result = await service.login('test@test.com', '123456');

        // ------- VALIDACIÓN DEL USUARIO RETORNADO -------
        expect(result).toEqual(fakeUser);

        // ------- VALIDACIÓN LOCALSTORAGE -------
        expect(localStorage.setItem).toHaveBeenCalledWith(
            'usuario',
            JSON.stringify(fakeUser)
        );
        expect(localStorage.setItem).toHaveBeenCalledWith('usuario_id', 'abc123');

        // ------- VALIDAR COLLECTION('usuarios') -------
        expect(collectionMock).toHaveBeenCalledTimes(1);
        const collectionArgs = collectionMock.calls.mostRecent().args;
        expect(collectionArgs[0]).toBe(firestoreStub);
        expect(collectionArgs[1]).toBe('usuarios');

        // ------- VALIDAR WHERE() CON PARÁMETROS CORRECTOS -------
        expect(whereMock).toHaveBeenCalledWith('correo', '==', 'test@test.com');
        expect(whereMock).toHaveBeenCalledWith('contraseña', '==', '123456');

        const whereCalls = whereMock.calls.allArgs();
        expect(whereCalls.length).toBe(2);
        expect(whereCalls[0]).toEqual(['correo', '==', 'test@test.com']);
        expect(whereCalls[1]).toEqual(['contraseña', '==', '123456']);

        // ------- VALIDAR QUERY() -------
        expect(queryMock).toHaveBeenCalledTimes(1);
        const queryArgs = queryMock.calls.mostRecent().args;

        expect(queryArgs.length).toBe(3); // ref + 2 where()

        // ref devuelto por collection()
        expect(queryArgs[0]).toBe(collectionMock.calls.mostRecent().returnValue);

        // where correctos en orden
        expect(queryArgs[1]).toBe(whereMock.calls.all()[0].returnValue);
        expect(queryArgs[2]).toBe(whereMock.calls.all()[1].returnValue);

        // ------- VALIDAR GETDOCS() -------
        expect(getDocsMock).toHaveBeenCalledWith(queryMock.calls.mostRecent().returnValue);

    });


    // ======================================================
    //                    LOGIN FAIL
    // ======================================================
    it('debe regresar null cuando no encuentra usuario', async () => {

        const fakeSnapshot = {
            empty: true,
            docs: []
        };
        getDocsMock.and.returnValue(Promise.resolve(fakeSnapshot));

        const result = await service.login('no@existe.com', 'wrong');

        expect(result).toBeNull();
    });

    // ======================================================
    //                REGISTRAR USUARIO
    // ======================================================
    it('debe registrar usuario y devolver ID', async () => {

        addDocMock.and.returnValue(Promise.resolve({ id: 'nuevo123' }));

        const data = {
            nombre: 'Nuevo',
            correo: 'nuevo@test.com',
            personaje_id: '22',
            contraseña: '1234'
        };

        const result = await service.registrarUsuario(data);

        expect(result).toBe('nuevo123');
        expect(addDocMock).toHaveBeenCalled();
    });

    // ======================================================
    //                ACTUALIZAR USUARIO
    // ======================================================
    it('debe actualizar usuario y devolver true', async () => {

        updateDocMock.and.returnValue(Promise.resolve(true));
        docMock.and.returnValue({});

        const result = await service.actualizarUsuario('abc123', {
            nombre: 'Nuevo Nombre'
        });

        expect(result).toBeTrue();
        expect(updateDocMock).toHaveBeenCalled();
    });

    // ======================================================
    //          FALLA AL ACTUALIZAR USUARIO
    // ======================================================
    it('debe devolver false si updateDoc falla', async () => {

        updateDocMock.and.returnValue(Promise.reject('error'));

        const result = await service.actualizarUsuario('abc123', {
            nombre: 'X'
        });

        expect(result).toBeFalse();
    });

});
