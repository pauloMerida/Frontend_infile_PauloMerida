import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticiaCategoriaComponent } from './noticia-categoria.component';

describe('NoticiaCategoriaComponent', () => {
  let component: NoticiaCategoriaComponent;
  let fixture: ComponentFixture<NoticiaCategoriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NoticiaCategoriaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoticiaCategoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
