import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DetalleComponent } from './detalle.component';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

describe('DetalleComponent', () => {
  let component: DetalleComponent;
  let fixture: ComponentFixture<DetalleComponent>;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [DetalleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DetalleComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);

    localStorage.setItem('id_noticia', '1');
    localStorage.setItem('categoria', '2');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load the news when ngOnInit is called', () => {
    const mockNoticia = {
      id_noticia: 1,
      fotoNoticia: 'foto1.jpg',
      foto: 'autor1.jpg',
    };

    component.ngOnInit();

    const req = httpMock.expectOne('http://localhost:8080/noticias/mostrar');
    expect(req.request.method).toBe('GET');
    req.flush([mockNoticia]);

    expect(component.noticia).toEqual(mockNoticia);
    expect(component.imagenNoticia).toBe('foto1.jpg');
    expect(component.imagenAutor).toBe('autor1.jpg');
  });

  it('should load related news when cargarNoticiasRelacionadas is called', () => {
    const mockNoticiasRelacionadas = [
      { id_noticia: 2, titulo: 'Noticia Relacionada 1' },
      { id_noticia: 3, titulo: 'Noticia Relacionada 2' },
    ];

    component.cargarNoticiasRelacionadas();

    const req = httpMock.expectOne('http://localhost:8080/noticias/categoria/2');
    expect(req.request.method).toBe('GET');
    req.flush(mockNoticiasRelacionadas);

    expect(component.noticiasRelacionadas).toEqual(mockNoticiasRelacionadas);
  });

  it('should return a truncated summary when obtenerResumen is called', () => {
    const cuerpo = 'Esta es una noticia con más de 25 palabras para probar la función de resumen. Vamos a cortar el texto.';
    const resumen = component.obtenerResumen(cuerpo);

    expect(resumen).toBe('Esta es una noticia con más de 25 palabras para probar...');
  });

  it('should navigate to the selected news and reload the page when irANoticia is called', () => {
    spyOn(localStorage, 'setItem');
   

    component.irANoticia(1);

    expect(localStorage.setItem).toHaveBeenCalledWith('id_noticia', '1');
    expect(window.location.reload).toHaveBeenCalled();
  });

  it('should save category id in localStorage when guardarCategoria is called', () => {
    spyOn(localStorage, 'setItem');

    component.guardarCategoria(3);

    expect(localStorage.setItem).toHaveBeenCalledWith('categoria', '3');
  });

  it('should navigate to the home page when regresar is called', () => {
    spyOn(router, 'navigate');

    component.regresar();

    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  afterEach(() => {
    httpMock.verify();
  });
});
