import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoticiaCategoriaComponent } from './noticia-categoria.component';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('NoticiaCategoriaComponent', () => {
  let component: NoticiaCategoriaComponent;
  let fixture: ComponentFixture<NoticiaCategoriaComponent>;
  let http: HttpClient;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [NoticiaCategoriaComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(NoticiaCategoriaComponent);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpClient);
    router = TestBed.inject(Router);

    spyOn(router, 'navigate');
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'categoria') return '1';  // Simulamos que el ID de la categoría está en localStorage
      return null;
    });
    spyOn(localStorage, 'setItem');
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set categoriaId from localStorage on ngOnInit', () => {
    component.ngOnInit();
    expect(component.categoriaId).toBe(1);  // El valor predeterminado o el valor de localStorage
  });

  it('should call cargarNoticiasRelacionadas on ngOnInit', () => {
    spyOn(component, 'cargarNoticiasRelacionadas');
    component.ngOnInit();
    expect(component.cargarNoticiasRelacionadas).toHaveBeenCalled();
  });

  it('should load related noticias when cargarNoticiasRelacionadas is called', () => {
    const mockNoticias = [
      { id_noticia: 1, titulo: 'Noticia 1', categoria: 'Categoria 1' },
      { id_noticia: 2, titulo: 'Noticia 2', categoria: 'Categoria 1' }
    ];
    
    spyOn(http, 'get').and.returnValue(of(mockNoticias));

    component.cargarNoticiasRelacionadas();
    expect(http.get).toHaveBeenCalledWith('http://localhost:8080/noticias/categoria/1');
    expect(component.noticiasRelacionadas).toEqual(mockNoticias);
  });

  it('should handle error when cargarNoticiasRelacionadas fails', () => {
    spyOn(http, 'get').and.returnValue(throwError('Error al cargar noticias'));

    spyOn(console, 'error');  // To capture console.error

    component.cargarNoticiasRelacionadas();
    
    expect(console.error).toHaveBeenCalledWith('Error al cargar las noticias', 'Error al cargar noticias');
  });

  it('should return the first 25 words from the body when obtenerResumen is called', () => {
    const cuerpo = 'Este es un ejemplo de texto largo para probar la función obtenerResumen de este componente.';
    const resumen = component.obtenerResumen(cuerpo);
    expect(resumen).toBe('Este es un ejemplo de texto largo para probar la función obtenerResumen...');
  });

  it('should navigate to detalle page with noticia id when irANoticia is called', () => {
    const idNoticia = 1;

    component.irANoticia(idNoticia);

    expect(localStorage.setItem).toHaveBeenCalledWith('id_noticia', idNoticia.toString());
    expect(router.navigate).toHaveBeenCalledWith(['/detalle']);
  });

  it('should save category id in localStorage when guardarCategoria is called', () => {
    const idCategoria = 2;

    component.guardarCategoria(idCategoria);

    expect(localStorage.setItem).toHaveBeenCalledWith('categoria', idCategoria.toString());
  });

  it('should navigate to home page when regresar is called', () => {
    component.regresar();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });
});
