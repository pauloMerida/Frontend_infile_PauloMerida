import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-noticia-categoria',
  templateUrl: './noticia-categoria.component.html',
  styleUrls: ['./noticia-categoria.component.css']
})
export class NoticiaCategoriaComponent implements OnInit {
  categoriaId: number = 1;  // Valor por defecto (Deportes)
  noticiasRelacionadas: any[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    // Recupera el ID de la categoría desde localStorage
    const categoria = localStorage.getItem('categoria');
    if (categoria) {
      this.categoriaId = parseInt(categoria);  // Asigna el ID de la categoría
      this.cargarNoticiasRelacionadas();  // Carga las noticias de esa categoría
    } else {
      this.categoriaId = 1;  // Si no hay categoría guardada, por defecto es 1 (Deportes)
      this.cargarNoticiasRelacionadas();  // Carga noticias de la categoría por defecto
    }
  }

  cargarNoticiasRelacionadas(): void {
    // Realiza la solicitud HTTP con el ID de la categoría
    this.http.get<any[]>(`http://localhost:8080/noticias/categoria/${this.categoriaId}`).subscribe({
      next: (noticias) => {
        this.noticiasRelacionadas = noticias;  // Almacena las noticias relacionadas
      },
      error: (err) => {
        console.error('Error al cargar las noticias', err);
      }
    });
  }

  obtenerResumen(cuerpo: string): string {
    // Devuelve las primeras 25 palabras del cuerpo
    const palabras = cuerpo.split(' ');
    return palabras.slice(0, 25).join(' ') + (palabras.length > 25 ? '...' : '');
  }

  // Redirige a detalle al hacer clic en una noticia
  irANoticia(idNoticia: number): void {
    localStorage.setItem('id_noticia', idNoticia.toString());
    this.router.navigate(['/detalle']);  // Redirige al componente de detalle
  }

  // Guarda el ID de la categoría en localStorage y redirige
  guardarCategoria(id: number): void {
    localStorage.setItem('categoria', id.toString());
  }
  regresar(): void {
    this.router.navigate(['/']);
  }
}
