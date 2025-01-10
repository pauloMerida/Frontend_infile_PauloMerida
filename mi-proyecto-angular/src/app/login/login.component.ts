import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(private fb: FormBuilder, private http: HttpClient,private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          
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
  irARegistro(): void {
    this.router.navigate(['/registro']);
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
            if (response==true){
              this.router.navigate(['/home']);
            }
            
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
