import { TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { moduleGuard } from "./module.guard";
import { AuthService } from "../services/auth.service";

describe("moduleGuard", () => {
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj(
      "AuthService",
      ["hasModulePermission", "getFirstAllowedRoute"],
      {
        isAuthenticated: false,
        isCliente: false,
      },
    );
    routerSpy = jasmine.createSpyObj("Router", ["navigate"]);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });
  });

  it("deve redirecionar para login se nao autenticado", () => {
    (
      Object.getOwnPropertyDescriptor(authServiceSpy, "isAuthenticated")
        ?.get as jasmine.Spy
    ).and.returnValue(false);

    const guard = moduleGuard("financeiro");
    const result = TestBed.runInInjectionContext(() =>
      guard({} as any, { url: "/financeiro" } as any),
    );

    expect(result).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(["/login"], {
      queryParams: { returnUrl: "/financeiro" },
    });
  });

  it("deve redirecionar para portal se usuario for cliente", () => {
    (
      Object.getOwnPropertyDescriptor(authServiceSpy, "isAuthenticated")
        ?.get as jasmine.Spy
    ).and.returnValue(true);
    (
      Object.getOwnPropertyDescriptor(authServiceSpy, "isCliente")
        ?.get as jasmine.Spy
    ).and.returnValue(true);

    const guard = moduleGuard("financeiro");
    const result = TestBed.runInInjectionContext(() =>
      guard({} as any, { url: "/financeiro" } as any),
    );

    expect(result).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(["/portal"]);
  });

  it("deve permitir acesso se autenticado e tem permissao no modulo", () => {
    (
      Object.getOwnPropertyDescriptor(authServiceSpy, "isAuthenticated")
        ?.get as jasmine.Spy
    ).and.returnValue(true);
    (
      Object.getOwnPropertyDescriptor(authServiceSpy, "isCliente")
        ?.get as jasmine.Spy
    ).and.returnValue(false);
    authServiceSpy.hasModulePermission.and.returnValue(true);

    const guard = moduleGuard("financeiro");
    const result = TestBed.runInInjectionContext(() =>
      guard({} as any, { url: "/financeiro" } as any),
    );

    expect(result).toBeTrue();
    expect(authServiceSpy.hasModulePermission).toHaveBeenCalledWith("financeiro");
  });

  it("deve redirecionar para primeira rota permitida se autenticado mas sem permissao", () => {
    (
      Object.getOwnPropertyDescriptor(authServiceSpy, "isAuthenticated")
        ?.get as jasmine.Spy
    ).and.returnValue(true);
    (
      Object.getOwnPropertyDescriptor(authServiceSpy, "isCliente")
        ?.get as jasmine.Spy
    ).and.returnValue(false);
    authServiceSpy.hasModulePermission.and.returnValue(false);
    authServiceSpy.getFirstAllowedRoute.and.returnValue("/dashboard");

    const guard = moduleGuard("financeiro");
    const result = TestBed.runInInjectionContext(() =>
      guard({} as any, { url: "/financeiro" } as any),
    );

    expect(result).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(["/dashboard"]);
  });
});
