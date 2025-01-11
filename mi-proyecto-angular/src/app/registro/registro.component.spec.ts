import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistroComponent } from './registro.component';
import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';

describe('RegistroComponent', () => {
  let component: RegistroComponent;
  let fixture: ComponentFixture<RegistroComponent>;
  let http: HttpClient;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      declarations: [RegistroComponent],
      providers: [FormBuilder]
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroComponent);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpClient);
    router = TestBed.inject(Router);

    spyOn(router, 'navigate');
    spyOn(window, 'alert');  // Para espiar alert()
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form group with default values', () => {
    expect(component.registroForm).toBeDefined();
    expect(component.registroForm.get('nombres')).toBeDefined();
    expect(component.registroForm.get('apellidos')).toBeDefined();
    expect(component.registroForm.get('edad')).toBeDefined();
    expect(component.registroForm.get('fechaNacimiento')).toBeDefined();
    expect(component.registroForm.get('correo')).toBeDefined();
    expect(component.registroForm.get('password')).toBeDefined();
  });

  it('should be invalid when form fields are empty', () => {
    component.registroForm.setValue({
      nombres: '',
      apellidos: '',
      edad: '',
      fechaNacimiento: '',
      correo: '',
      password: ''
    });
    expect(component.registroForm.valid).toBeFalse();
  });

  it('should be valid when all fields are correctly filled', () => {
    component.registroForm.setValue({
      nombres: 'Juan',
      apellidos: 'Perez',
      edad: 30,
      fechaNacimiento: '1994-01-01',
      correo: 'juan.perez@example.com',
      password: 'password123'
    });
    expect(component.registroForm.valid).toBeTrue();
  });

  it('should call http.post and navigate to home on successful registration', () => {
    const mockResponse = { success: true };
    spyOn(http, 'post').and.returnValue(of(mockResponse));

    component.registroForm.setValue({
      nombres: 'Juan',
      apellidos: 'Perez',
      edad: 30,
      fechaNacimiento: '1994-01-01',
      correo: 'juan.perez@example.com',
      password: 'password123'
    });

    component.registrarCliente();

    expect(http.post).toHaveBeenCalledWith(
      'http://localhost:8080/clientes/insertar',
      jasmine.any(String),
      jasmine.any(Object)
    );
    expect(window.alert).toHaveBeenCalledWith('Registro exitoso');
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should show an error message if registration fails', () => {
    const errorResponse = { message: 'Error al registrar' };
    spyOn(http, 'post').and.returnValue(throwError(errorResponse));

    component.registroForm.setValue({
      nombres: 'Juan',
      apellidos: 'Perez',
      edad: 30,
      fechaNacimiento: '1994-01-01',
      correo: 'juan.perez@example.com',
      password: 'password123'
    });

    component.registrarCliente();

    expect(window.alert).toHaveBeenCalledWith('Error al registrar: Error al registrar');
  });

  it('should alert the user to complete the form if the form is invalid', () => {
    component.registroForm.setValue({
      nombres: '',
      apellidos: '',
      edad: '',
      fechaNacimiento: '',
      correo: '',
      password: ''
    });

    component.registrarCliente();

    expect(window.alert).toHaveBeenCalledWith('Por favor, complete todos los campos correctamente.');
  });

  it('should navigate to home when regresar is called', () => {
    component.regresar();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should validate that the email is required and in correct format', () => {
    const email = component.registroForm.get('correo');
    email?.setValue('');
    expect(email?.valid).toBeFalse();
    email?.setValue('invalid-email');
    expect(email?.valid).toBeFalse();
    email?.setValue('valid.email@example.com');
    expect(email?.valid).toBeTrue();
  });

  it('should validate that password is required and has a minimum length of 8', () => {
    const password = component.registroForm.get('password');
    password?.setValue('');
    expect(password?.valid).toBeFalse();
    password?.setValue('short');
    expect(password?.valid).toBeFalse();
    password?.setValue('longenoughpassword');
    expect(password?.valid).toBeTrue();
  });
});
