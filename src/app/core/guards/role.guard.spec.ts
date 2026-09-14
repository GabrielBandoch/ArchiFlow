import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { staffGuard, portalGuard } from './role.guard';
import { AuthService } from '../services/auth.service';

describe('Role Guards', () => {
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', [], {
      isAuthenticated: false,
      isCliente: false,
      isStaff: false
    });
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });
  });

  describe('staffGuard', () => {
    it('deve redirecionar para login se nao autenticado', () => {
      (Object.getOwnPropertyDescriptor(authServiceSpy, 'isAuthenticated')?.get as jasmine.Spy).and.returnValue(false);
      const result = TestBed.runInInjectionContext(() => staffGuard({} as any, { url: '/projetos' } as any));
      expect(result).toBeFalse();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login'], { queryParams: { returnUrl: '/projetos' } });
    });

    it('deve redirecionar para portal se usuario for cliente', () => {
      (Object.getOwnPropertyDescriptor(authServiceSpy, 'isAuthenticated')?.get as jasmine.Spy).and.returnValue(true);
      (Object.getOwnPropertyDescriptor(authServiceSpy, 'isCliente')?.get as jasmine.Spy).and.returnValue(true);
      const result = TestBed.runInInjectionContext(() => staffGuard({} as any, { url: '/projetos' } as any));
      expect(result).toBeFalse();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/portal']);
    });

    it('deve permitir acesso se autenticado e for staff', () => {
      (Object.getOwnPropertyDescriptor(authServiceSpy, 'isAuthenticated')?.get as jasmine.Spy).and.returnValue(true);
      (Object.getOwnPropertyDescriptor(authServiceSpy, 'isCliente')?.get as jasmine.Spy).and.returnValue(false);
      const result = TestBed.runInInjectionContext(() => staffGuard({} as any, { url: '/projetos' } as any));
      expect(result).toBeTrue();
    });
  });

  describe('portalGuard', () => {
    it('deve redirecionar para login se nao autenticado', () => {
      (Object.getOwnPropertyDescriptor(authServiceSpy, 'isAuthenticated')?.get as jasmine.Spy).and.returnValue(false);
      const result = TestBed.runInInjectionContext(() => portalGuard({} as any, { url: '/portal' } as any));
      expect(result).toBeFalse();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login'], { queryParams: { returnUrl: '/portal' } });
    });

    it('deve permitir acesso se autenticado', () => {
      (Object.getOwnPropertyDescriptor(authServiceSpy, 'isAuthenticated')?.get as jasmine.Spy).and.returnValue(true);
      const result = TestBed.runInInjectionContext(() => portalGuard({} as any, { url: '/portal' } as any));
      expect(result).toBeTrue();
    });
  });
});
