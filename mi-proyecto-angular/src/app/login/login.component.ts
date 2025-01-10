import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/)
        ]
      ]
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const formData = new URLSearchParams();
      formData.append('correo', this.loginForm.value.email);
      formData.append('password', this.loginForm.value.password);

      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

      this.http
        .post('http://localhost:8080/clientes/verificar', formData.toString(), { headers })
        .subscribe(
          (response) => {
            this.isLoading = false;
            console.log('Login successful', response);
            // Redirigir a la página principal o almacenar el token si la autenticación es exitosa
          },
          (error) => {
            this.isLoading = false;
            this.errorMessage = 'Correo o contraseña incorrectos';
          }
        );
    } else {
      this.errorMessage = 'Por favor, completa el formulario correctamente.';
    }
  }
}
