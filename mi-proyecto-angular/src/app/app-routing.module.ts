import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { RegistroComponent } from './registro/registro.component';
import { DetalleComponent } from './detalle/detalle.component';
import { NoticiaCategoriaComponent } from './noticia-categoria/noticia-categoria.component';
const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'detalle', component: DetalleComponent },
  { path: 'noticia-categoria', component: NoticiaCategoriaComponent },
  //{ path: 'detalle-noticia', loadComponent: () => import('./detalle-noticia/detalle-noticia.component').then(m => m.DetalleNoticiaComponent) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
