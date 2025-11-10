import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Personajes } from './personajes';

describe('Personajes service', () => {
  let service: Personajes;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(Personajes);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('fetches and slices heroes by limit', () => {
    const mock = Array.from({ length: 30 }).map((_, i) => ({ id: i + 1, name: `H${i+1}` }));
    let res: any[] = [];

    service.getHeroes(10).subscribe(r => (res = r));
    const req = httpMock.expectOne('https://akabab.github.io/superhero-api/api/all.json');
    expect(req.request.method).toBe('GET');
    req.flush(mock);

    expect(res.length).toBe(10);
    expect(res[0].id).toBe(1);
  });
});
