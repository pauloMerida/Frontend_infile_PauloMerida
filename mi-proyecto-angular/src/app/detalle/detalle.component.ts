import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {
  noticia: any;
  imagenNoticia: string = '';
  imagenAutor: string = '';
  noticiasRelacionadas: any[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.cargarNoticia();
    this.cargarNoticiasRelacionadas();
  }

  cargarNoticia(): void {
    const idNoticia = localStorage.getItem('id_noticia');
    if (idNoticia) {
      this.http.get<any[]>(`http://localhost:8080/noticias/mostrar`).subscribe({
        next: (noticias) => {
          this.noticia = noticias.find(n => n.id_noticia === parseInt(idNoticia));
          if (this.noticia) {
            this.imagenNoticia = this.noticia.fotoNoticia;
            this.imagenAutor = this.noticia.foto;
          }
        },
        error: (err) => {
          console.error('Error al cargar la noticia', err);
        }
      });
    }
  }

  cargarNoticiasRelacionadas(): void {
    const categoriaId = localStorage.getItem('categoria');
    if (categoriaId) {
      this.http.get<any[]>(`http://localhost:8080/noticias/categoria/${categoriaId}`).subscribe({
        next: (noticias) => {
          this.noticiasRelacionadas = noticias;
        },
        error: (err) => {
          console.error('Error al cargar las noticias relacionadas', err);
        }
      });
    }
  }

  obtenerResumen(cuerpo: string): string {
    const palabras = cuerpo.split(' ');
    return palabras.slice(0, 25).join(' ') + (palabras.length > 25 ? '...' : '');
  }

  // Función para redirigir a la noticia seleccionada y recargar la página
  irANoticia(idNoticia: number): void {
    localStorage.setItem('id_noticia', idNoticia.toString());
    window.location.reload(); // Recargamos la página para que se cargue la nueva noticia
  }
  guardarCategoria(id: number): void {
    localStorage.setItem('categoria', id.toString());
  }
  regresar(): void {
    this.router.navigate(['/']);
  }
}
