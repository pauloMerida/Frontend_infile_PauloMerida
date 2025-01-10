import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NoticiasService } from '../services/noticias.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  noticias: any[] = [];

  constructor(private noticiasService: NoticiasService, private router: Router) {}

  ngOnInit(): void {
    this.fetchNoticias();
  }

  fetchNoticias(): void {
    this.noticiasService.getNoticias().subscribe({
      next: (data) => {
        this.noticias = data;
      },
      error: (err) => {
        console.error('Error fetching noticias:', err);
      }
    });
  }

  irANoticia(categoria: string, idNoticia: number): void {
    localStorage.setItem('categoria', categoria);
    localStorage.setItem('id_noticia', idNoticia.toString());
    this.router.navigate(['/detalle']); 
  }
  regresar(): void {
    this.router.navigate(['/']);
  }
  guardarCategoria(id: number): void {
    localStorage.setItem('categoria', id.toString());  // Guardamos el ID en localStorage
    this.router.navigate(['/noticia-categoria']);  // Redirigimos a la página de noticias
  }
}
