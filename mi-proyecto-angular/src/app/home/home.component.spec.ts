import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HomeComponent } from './home.component';
import { NoticiasService } from '../services/noticias.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let noticiasService: NoticiasService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [HomeComponent],
      providers: [NoticiasService]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    noticiasService = TestBed.inject(NoticiasService);
    router = TestBed.inject(Router);

    spyOn(router, 'navigate');
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch noticias on ngOnInit', () => {
    const mockNoticias = [
      { id_noticia: 1, titulo: 'Noticia 1', categoria: 'Categoria 1' },
      { id_noticia: 2, titulo: 'Noticia 2', categoria: 'Categoria 2' }
    ];

    spyOn(noticiasService, 'getNoticias').and.returnValue(of(mockNoticias));

    component.ngOnInit();

    expect(noticiasService.getNoticias).toHaveBeenCalled();
    expect(component.noticias).toEqual(mockNoticias);
  });

  it('should handle error when fetchNoticias fails', () => {
    spyOn(noticiasService, 'getNoticias').and.returnValue(throwError('Error fetching noticias'));

    spyOn(console, 'error'); // To capture console.error

    component.fetchNoticias();

    expect(noticiasService.getNoticias).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith('Error fetching noticias:', 'Error fetching noticias');
  });

  it('should navigate to detalle page with category and news id when irANoticia is called', () => {
    const categoria = 'Categoria 1';
    const idNoticia = 1;

    component.irANoticia(categoria, idNoticia);

    expect(localStorage.getItem('categoria')).toBe(categoria);
    expect(localStorage.getItem('id_noticia')).toBe(idNoticia.toString());
    expect(router.navigate).toHaveBeenCalledWith(['/detalle']);
  });

  it('should navigate to home page when regresar is called', () => {
    component.regresar();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should save category id and navigate to noticia-categoria page when guardarCategoria is called', () => {
    const idCategoria = 3;

    component.guardarCategoria(idCategoria);

    expect(localStorage.getItem('categoria')).toBe(idCategoria.toString());
    expect(router.navigate).toHaveBeenCalledWith(['/noticia-categoria']);
  });
});
