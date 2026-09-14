import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../core/services/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login'], {
      isAuthenticated: false,
      isCliente: false,
      isStaff: false
    });
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParams: { returnUrl: '/leads' }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve submeter e navegar para returnUrl se for staff', () => {
    authServiceSpy.login.and.returnValue(of({
      id: 'usr-1',
      nome: 'Admin',
      email: 'admin@archiflow.com',
      perfil: 'Administrador'
    }));

    component.loginForm.setValue({
      email: 'admin@archiflow.com',
      senha: 'Password123!'
    });

    component.onSubmit();

    expect(authServiceSpy.login).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/leads']);
  });

  it('deve submeter e navegar para /portal se for cliente', () => {
    (Object.getOwnPropertyDescriptor(authServiceSpy, 'isCliente')?.get as jasmine.Spy).and.returnValue(true);
    authServiceSpy.login.and.returnValue(of({
      id: 'cli-1',
      nome: 'Cliente Exemplo',
      email: 'cliente@email.com',
      perfil: 'Cliente',
      projetoId: 'proj-123'
    }));

    component.loginForm.setValue({
      email: 'cliente@email.com',
      senha: 'Password123!'
    });

    component.onSubmit();

    expect(authServiceSpy.login).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/portal/proj-123']);
  });

  it('deve exibir mensagem de erro se o login falhar', () => {
    authServiceSpy.login.and.returnValue(throwError(() => ({
      error: { message: 'Credenciais inválidas.' }
    })));

    component.loginForm.setValue({
      email: 'invalido@email.com',
      senha: 'Errada'
    });

    component.onSubmit();

    expect(component.errorMessage).toBe('Credenciais inválidas.');
    expect(component.loading).toBeFalse();
  });
});
