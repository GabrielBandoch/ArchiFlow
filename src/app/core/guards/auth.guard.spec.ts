import { TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { authGuard } from "./auth.guard";
import { AuthService } from "../services/auth.service";

describe("authGuard", () => {
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj("AuthService", [], {
      isAuthenticated: false,
    });
    routerSpy = jasmine.createSpyObj("Router", ["navigate"]);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });
  });

  it("deve permitir acesso se autenticado", () => {
    (
      Object.getOwnPropertyDescriptor(authServiceSpy, "isAuthenticated")
        ?.get as jasmine.Spy
    ).and.returnValue(true);

    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as any, { url: "/dashboard" } as any),
    );

    expect(result).toBeTrue();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it("deve redirecionar para login com returnUrl se nao autenticado", () => {
    (
      Object.getOwnPropertyDescriptor(authServiceSpy, "isAuthenticated")
        ?.get as jasmine.Spy
    ).and.returnValue(false);

    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as any, { url: "/dashboard" } as any),
    );

    expect(result).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(["/login"], {
      queryParams: { returnUrl: "/dashboard" },
    });
  });
});
