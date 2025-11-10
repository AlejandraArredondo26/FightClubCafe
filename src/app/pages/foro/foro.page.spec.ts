import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ForoPage } from './foro.page';

describe('ForoPage', () => {
  let component: ForoPage;
  let fixture: ComponentFixture<ForoPage>;

  beforeEach(() => {
 
    try { localStorage.removeItem('foro_threads_v1'); } catch {}
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [ForoPage],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(ForoPage);
    component = fixture.componentInstance;
    component.ngOnInit();
  });

  afterEach(() => {
    try { localStorage.removeItem('foro_threads_v1'); } catch {}
  });

  it('creates and initializes forms', () => {
    expect(component).toBeTruthy();
    expect(component['threadForm']).toBeTruthy();
    expect(component['replyForm']).toBeTruthy();
  });

  it('adds a new thread', () => {
    component['threadForm'].setValue({ author: 'Ana', text: 'Hola' });
    component.addThread();
    expect(component.threads.length).toBe(1);
    expect(component.threads[0].author).toBe('Ana');
  });

  it('toggles reply form and adds reply', () => {
 
    component['threadForm'].setValue({ author: 'Ana', text: 'Tema' });
    component.addThread();
    const t = component.threads[0];
    component.toggleReplyForm(t);
    expect(t.ui?.showReplyForm).toBeTrue();
    component['replyForm'].setValue({ author: 'Luis', text: 'Respuesta' });
    component.addReply(t);
    expect(t.replies.length).toBe(1);
    expect(t.ui?.showReplyForm).toBeFalse();
  });
});
