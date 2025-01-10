import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
})
export class RegistroComponent {
  registroForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.registroForm = this.fb.group({
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      edad: ['', [Validators.required, Validators.min(1)]],
      fechaNacimiento: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
        ],
      ],
    });
  }

  registrarCliente(): void {
    if (this.registroForm.valid) {
      const formData = new URLSearchParams();
      formData.set('nombres', this.registroForm.get('nombres')?.value);
      formData.set('apellidos', this.registroForm.get('apellidos')?.value);
      formData.set('edad', this.registroForm.get('edad')?.value.toString());
      formData.set(
        'fechaNacimiento',
        this.registroForm.get('fechaNacimiento')?.value
      );
      formData.set('correo', this.registroForm.get('correo')?.value);
      formData.set('password', this.registroForm.get('password')?.value);
      formData.set('token', '0');

      const headers = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
      });

      this.http
        .post('http://localhost:8080/clientes/insertar', formData.toString(), {
          headers,
        })
        .subscribe({
          next: () => {
            alert('Registro exitoso');
            this.router.navigate(['/']);
          },
          error: (err) => {
            alert('Error al registrar: ' + err.message);
          },
        });
    } else {
      alert('Por favor, complete todos los campos correctamente.');
    }
  }

  regresar(): void {
    this.router.navigate(['/']);
  }
}
