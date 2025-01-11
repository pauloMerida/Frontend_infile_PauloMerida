import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let httpMock: HttpTestingController;
  let router: Router;
  let httpClient: HttpClient;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        HttpClientTestingModule,
        RouterTestingModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    httpClient = TestBed.inject(HttpClient);
    fixture.detectChanges();
  });

  // Test case 1: Verificar que el formulario se crea correctamente
  it('debería crear el formulario con los campos esperados', () => {
    expect(component.loginForm).toBeTruthy();
    expect(component.email).toBeTruthy();
    expect(component.password).toBeTruthy();
  });

  // Test case 2: Verificar que se muestra el mensaje de error cuando el formulario es inválido
  it('debería mostrar un mensaje de error cuando el formulario es inválido', () => {
    component.loginForm.controls['email'].setValue('');
    component.loginForm.controls['password'].setValue('');
    component.onSubmit();
    expect(component.errorMessage).toBe('Por favor, completa el formulario correctamente.');
  });

  // Test case 3: Verificar que el componente hace una solicitud HTTP cuando el formulario es válido
  it('debería realizar una solicitud HTTP cuando el formulario es válido', () => {
    const formData = { correo: 'test@test.com', password: 'password123' };
    component.loginForm.controls['email'].setValue(formData.correo);
    component.loginForm.controls['password'].setValue(formData.password);

    spyOn(httpClient, 'post').and.returnValue(of(true)); // Simula una respuesta exitosa

    component.onSubmit();

    const req = httpMock.expectOne('http://localhost:8080/clientes/verificar');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toContain('correo=test@test.com');
    expect(req.request.body).toContain('password=password123');
    req.flush(true);

    expect(component.isLoading).toBe(false);
  });

  // Test case 4: Verificar que el componente maneja la respuesta exitosa correctamente
  it('debería navegar a /home cuando la respuesta es true', () => {
    const formData = { correo: 'test@test.com', password: 'password123' };
    component.loginForm.controls['email'].setValue(formData.correo);
    component.loginForm.controls['password'].setValue(formData.password);

    spyOn(httpClient, 'post').and.returnValue(of(true));
    spyOn(router, 'navigate'); // Espía la navegación

    component.onSubmit();

    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });

  // Test case 5: Verificar que el componente maneja la respuesta con error correctamente
  it('debería mostrar un mensaje de error cuando la respuesta es false', () => {
    const formData = { correo: 'test@test.com', password: 'password123' };
    component.loginForm.controls['email'].setValue(formData.correo);
    component.loginForm.controls['password'].setValue(formData.password);

    spyOn(httpClient, 'post').and.returnValue(of(false));

    component.onSubmit();

    expect(component.isLoading).toBe(false);
    expect(component.errorMessage).toBe('Correo o contraseña incorrectos');
  });

  // Test case 6: Verificar que el componente maneja errores en la solicitud HTTP
  it('debería mostrar un mensaje de error cuando hay un error en la solicitud HTTP', () => {
    const formData = { correo: 'test@test.com', password: 'password123' };
    component.loginForm.controls['email'].setValue(formData.correo);
    component.loginForm.controls['password'].setValue(formData.password);

    spyOn(httpClient, 'post').and.returnValue(throwError('Error en la solicitud'));

    component.onSubmit();

    expect(component.isLoading).toBe(false);
    expect(component.errorMessage).toBe('Correo o contraseña incorrectos');
  });

  // Test case 7: Verificar que el componente navega a la página de registro
  it('debería navegar a la página de registro cuando se llama a irARegistro', () => {
    spyOn(router, 'navigate'); // Espía la navegación

    component.irARegistro();

    expect(router.navigate).toHaveBeenCalledWith(['/registro']);
  });

  afterEach(() => {
    httpMock.verify();
  });
});
